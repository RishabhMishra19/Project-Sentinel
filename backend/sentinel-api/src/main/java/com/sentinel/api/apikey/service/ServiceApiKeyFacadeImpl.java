package com.sentinel.api.apikey.service;

import com.sentinel.api.apikey.dto.request.CreateServiceApiKeyRequest;
import com.sentinel.api.apikey.dto.response.ServiceApiKeyCreatedResponse;
import com.sentinel.api.apikey.dto.response.ServiceApiKeyResponse;
import com.sentinel.api.apikey.mapper.ServiceApiKeyMapper;
import com.sentinel.api.apikey.repository.ServiceApiKeySpecifications;
import com.sentinel.api.common.exception.BadRequestException;
import com.sentinel.api.common.exception.ConflictException;
import com.sentinel.api.common.exception.ResourceNotFoundException;
import com.sentinel.api.common.query.ListQueryRequest;
import com.sentinel.api.common.response.PageResponse;
import com.sentinel.common.postgresql.product.Product;
import com.sentinel.api.product.service.core.ProductService;
import com.sentinel.common.postgresql.service.Service;
import com.sentinel.api.service.service.core.ServiceService;
import com.sentinel.common.postgresql.user.User;
import com.sentinel.api.user.repository.UserRepository;
import com.sentinel.common.apikey.entity.ServiceApiKey;
import com.sentinel.common.apikey.entity.ServiceApiKeyStatus;
import com.sentinel.common.apikey.repository.ServiceApiKeyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.Instant;
import java.util.Base64;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

@org.springframework.stereotype.Service
@RequiredArgsConstructor
@Transactional
public class ServiceApiKeyFacadeImpl implements ServiceApiKeyFacade {

    private static final Sort DEFAULT_SORT = Sort.by(Sort.Direction.DESC, "createdAt");
    private static final String KEY_PREFIX = "sent_";

    private final ServiceApiKeyRepository serviceApiKeyRepository;
    private final ServiceApiKeyMapper serviceApiKeyMapper;
    private final ProductService productService;
    private final ServiceService serviceService;
    private final UserRepository userRepository;
    private final SecureRandom secureRandom = new SecureRandom();

    @Override
    @Transactional(readOnly = true)
    public PageResponse<ServiceApiKeyResponse> list(
        UUID tenantId, UUID productId, UUID serviceId, ListQueryRequest query) {
        UUID effectiveTenantId = requireTenantId(tenantId);
        requireServiceInProduct(effectiveTenantId, productId, serviceId);
        Pageable effective =
            query.toPageable(ServiceApiKeySpecifications.SORTABLE_FIELDS, DEFAULT_SORT);
        Specification<ServiceApiKey> spec =
            ServiceApiKeySpecifications.forService(serviceId, query);
        Page<ServiceApiKey> page = serviceApiKeyRepository.findAll(spec, effective);
        Map<UUID, User> users = loadUsers(page.getContent());
        return PageResponse.from(page.map(key -> toResponse(key, users)));
    }

    @Override
    @Transactional(readOnly = true)
    public ServiceApiKeyResponse getById(
        UUID tenantId, UUID productId, UUID serviceId, UUID id) {
        UUID effectiveTenantId = requireTenantId(tenantId);
        requireServiceInProduct(effectiveTenantId, productId, serviceId);
        ServiceApiKey key = requireKey(serviceId, id);
        Map<UUID, User> users = loadUsers(List.of(key));
        return toResponse(key, users);
    }

    @Override
    public ServiceApiKeyCreatedResponse create(
        UUID tenantId,
        UUID productId,
        UUID serviceId,
        CreateServiceApiKeyRequest request,
        UUID actorId) {
        UUID effectiveTenantId = requireTenantId(tenantId);
        requireServiceInProduct(effectiveTenantId, productId, serviceId);
        if (serviceApiKeyRepository.existsByServiceIdAndStatus(
            serviceId, ServiceApiKeyStatus.ACTIVE)) {
            throw new ConflictException("An active API key already exists for this service");
        }
        String rawApiKey = generateRawApiKey();
        ServiceApiKey saved = serviceApiKeyRepository.save(
            serviceApiKeyMapper.toEntity(
                new CreateServiceApiKeyRequest(request.name().trim()),
                serviceId,
                rawApiKey,
                actorId));
        ServiceApiKey withIds = requireKey(serviceId, saved.getId());
        Map<UUID, User> users = loadUsers(List.of(withIds));
        return serviceApiKeyMapper.toCreatedResponse(
            withIds,
            users.get(withIds.getCreatedById()),
            users.get(withIds.getUpdatedById()),
            rawApiKey);
    }

    @Override
    public void revoke(
        UUID tenantId, UUID productId, UUID serviceId, UUID id, UUID actorId) {
        UUID effectiveTenantId = requireTenantId(tenantId);
        requireServiceInProduct(effectiveTenantId, productId, serviceId);
        ServiceApiKey key = requireKey(serviceId, id);
        if (key.getStatus() == ServiceApiKeyStatus.REVOKED) {
            return;
        }
        Instant now = Instant.now();
        key.setStatus(ServiceApiKeyStatus.REVOKED);
        key.setRevokedAt(now);
        key.setUpdatedById(actorId);
        serviceApiKeyRepository.save(key);
    }

    private ServiceApiKeyResponse toResponse(ServiceApiKey key, Map<UUID, User> users) {
        return serviceApiKeyMapper.toResponse(
            key, users.get(key.getCreatedById()), users.get(key.getUpdatedById()));
    }

    private Map<UUID, User> loadUsers(List<ServiceApiKey> keys) {
        Set<UUID> ids = new HashSet<>();
        for (ServiceApiKey key : keys) {
            if (key.getCreatedById() != null) {
                ids.add(key.getCreatedById());
            }
            if (key.getUpdatedById() != null) {
                ids.add(key.getUpdatedById());
            }
        }
        Map<UUID, User> users = new HashMap<>();
        if (!ids.isEmpty()) {
            for (User user : userRepository.findAllById(ids)) {
                users.put(user.getId(), user);
            }
        }
        return users;
    }

    private Service requireServiceInProduct(UUID tenantId, UUID productId, UUID serviceId) {
        requireProductInTenant(tenantId, productId);
        Service service = serviceService
            .findById(serviceId)
            .orElseThrow(() -> new ResourceNotFoundException("Service not found"));
        if (!service.getProduct().getId().equals(productId)) {
            throw new ResourceNotFoundException("Service not found");
        }
        return service;
    }

    private Product requireProductInTenant(UUID tenantId, UUID productId) {
        return productService
            .findWithAuditByIdAndTenantId(productId, tenantId)
            .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
    }

    private ServiceApiKey requireKey(UUID serviceId, UUID id) {
        return serviceApiKeyRepository
            .findByIdAndServiceId(id, serviceId)
            .orElseThrow(() -> new ResourceNotFoundException("API key not found"));
    }

    private UUID requireTenantId(UUID tenantId) {
        if (tenantId == null) {
            throw new BadRequestException("Active tenant is required");
        }
        return tenantId;
    }

    private String generateRawApiKey() {
        byte[] bytes = new byte[32];
        secureRandom.nextBytes(bytes);
        return KEY_PREFIX + Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }
}
