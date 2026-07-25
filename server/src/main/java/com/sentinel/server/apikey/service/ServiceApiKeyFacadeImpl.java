package com.sentinel.server.apikey.service;

import com.sentinel.server.apikey.dto.request.CreateServiceApiKeyRequest;
import com.sentinel.server.apikey.dto.response.ServiceApiKeyCreatedResponse;
import com.sentinel.server.apikey.dto.response.ServiceApiKeyResponse;
import com.sentinel.server.apikey.entity.ServiceApiKey;
import com.sentinel.server.apikey.entity.ServiceApiKeyStatus;
import com.sentinel.server.apikey.mapper.ServiceApiKeyMapper;
import com.sentinel.server.apikey.repository.ServiceApiKeyRepository;
import com.sentinel.server.apikey.repository.ServiceApiKeySpecifications;
import com.sentinel.server.common.exception.BadRequestException;
import com.sentinel.server.common.exception.ConflictException;
import com.sentinel.server.common.exception.ResourceNotFoundException;
import com.sentinel.server.common.response.PageResponse;
import com.sentinel.server.product.entity.Product;
import com.sentinel.server.product.service.core.ProductService;
import com.sentinel.server.service.entity.Service;
import com.sentinel.server.service.service.core.ServiceService;
import com.sentinel.server.user.entity.User;
import com.sentinel.server.user.repository.UserRepository;
import java.security.SecureRandom;
import java.time.Instant;
import java.util.Base64;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.transaction.annotation.Transactional;

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
            UUID tenantId,
            UUID productId,
            UUID serviceId,
            Pageable pageable,
            ServiceApiKeyStatus status) {
        UUID effectiveTenantId = requireTenantId(tenantId);
        requireServiceInProduct(effectiveTenantId, productId, serviceId);
        Pageable effective = withDefaultSort(pageable);
        Specification<ServiceApiKey> spec =
                ServiceApiKeySpecifications.forService(serviceId, status);
        Page<ServiceApiKey> page = serviceApiKeyRepository.findAll(spec, effective);
        return PageResponse.from(page.map(serviceApiKeyMapper::toResponse));
    }

    @Override
    @Transactional(readOnly = true)
    public ServiceApiKeyResponse getById(
            UUID tenantId, UUID productId, UUID serviceId, UUID id) {
        UUID effectiveTenantId = requireTenantId(tenantId);
        requireServiceInProduct(effectiveTenantId, productId, serviceId);
        return serviceApiKeyMapper.toResponse(requireKey(serviceId, id));
    }

    @Override
    public ServiceApiKeyCreatedResponse create(
            UUID tenantId,
            UUID productId,
            UUID serviceId,
            CreateServiceApiKeyRequest request,
            UUID actorId) {
        UUID effectiveTenantId = requireTenantId(tenantId);
        Service service = requireServiceInProduct(effectiveTenantId, productId, serviceId);
        if (serviceApiKeyRepository.existsByServiceIdAndStatus(
                serviceId, ServiceApiKeyStatus.ACTIVE)) {
            throw new ConflictException("An active API key already exists for this service");
        }
        User actorRef = userRepository.getReferenceById(actorId);
        String rawApiKey = generateRawApiKey();
        ServiceApiKey saved = serviceApiKeyRepository.save(
                serviceApiKeyMapper.toEntity(
                        new CreateServiceApiKeyRequest(request.name().trim()),
                        service,
                        rawApiKey,
                        actorRef));
        ServiceApiKey withAudit = requireKey(serviceId, saved.getId());
        return serviceApiKeyMapper.toCreatedResponse(withAudit, rawApiKey);
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
        key.setUpdatedBy(userRepository.getReferenceById(actorId));
        serviceApiKeyRepository.save(key);
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
                .findWithAuditByIdAndServiceId(id, serviceId)
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

    private Pageable withDefaultSort(Pageable pageable) {
        if (pageable.getSort().isSorted()) {
            return pageable;
        }
        return PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), DEFAULT_SORT);
    }
}
