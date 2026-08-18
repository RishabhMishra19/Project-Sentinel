package com.sentinel.api.tenant.service;

import com.sentinel.server.common.exception.ConflictException;
import com.sentinel.server.common.exception.ForbiddenException;
import com.sentinel.server.common.exception.ResourceNotFoundException;
import com.sentinel.server.common.query.ListQueryRequest;
import com.sentinel.server.common.response.PageResponse;
import com.sentinel.server.security.AccessSupport;
import com.sentinel.server.tenant.dto.request.CreateTenantRequest;
import com.sentinel.server.tenant.dto.request.UpdateTenantRequest;
import com.sentinel.server.tenant.dto.response.CreateTenantResponse;
import com.sentinel.server.tenant.dto.response.TenantResponse;
import com.sentinel.server.tenant.entity.Tenant;
import com.sentinel.server.tenant.entity.TenantStatus;
import com.sentinel.server.tenant.mapper.TenantMapper;
import com.sentinel.server.tenant.repository.TenantRepository;
import com.sentinel.server.tenant.repository.TenantSpecifications;
import com.sentinel.server.user.entity.User;
import com.sentinel.server.user.repository.UserRepository;
import com.sentinel.server.user.service.core.UserService;
import java.security.SecureRandom;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class TenantFacadeImpl implements TenantFacade {

    private static final Sort DEFAULT_SORT = Sort.by(Sort.Direction.DESC, "createdAt");
    private static final int TEMP_PASSWORD_LENGTH = 16;
    private static final String TEMP_PASSWORD_CHARS =
            "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%";
    private static final SecureRandom SECURE_RANDOM = new SecureRandom();

    private final TenantRepository tenantRepository;
    private final UserRepository userRepository;
    private final UserService userService;
    private final TenantMapper tenantMapper;
    private final PasswordEncoder passwordEncoder;
    private final AccessSupport accessSupport;

    @Override
    @Transactional(readOnly = true)
    public PageResponse<TenantResponse> list(ListQueryRequest query) {
        Pageable effective =
                query.toPageable(TenantSpecifications.SORTABLE_FIELDS, DEFAULT_SORT);
        Specification<Tenant> spec = TenantSpecifications.withFilters(query);
        Page<Tenant> page = tenantRepository.findAll(spec, effective);
        Map<UUID, List<String>> adminEmailsByTenant = adminEmailsByTenantIds(
                page.getContent().stream().map(Tenant::getId).toList());
        return PageResponse.from(page.map(tenant -> tenantMapper.toResponse(
                tenant, adminEmailsByTenant.getOrDefault(tenant.getId(), List.of()))));
    }

    @Override
    @Transactional(readOnly = true)
    public TenantResponse getById(UUID id) {
        requirePathMatchesActiveTenant(id);
        Tenant tenant = requireTenantWithAudit(id);
        List<String> adminEmails = userRepository
                .findByTenantIdAndTenantAdminTrueOrderByEmailAsc(id)
                .stream()
                .map(User::getEmail)
                .toList();
        return tenantMapper.toResponse(tenant, adminEmails);
    }

    @Override
    public CreateTenantResponse create(CreateTenantRequest request, UUID actorId) {
        if (tenantRepository.existsBySlugIgnoreCase(request.slug())) {
            throw new ConflictException("Tenant slug already exists");
        }
        String adminEmail = request.adminEmail().trim().toLowerCase();
        String adminDisplayName = request.adminDisplayName().trim();
        if (userService.existsByEmailIgnoreCase(adminEmail)) {
            throw new ConflictException("Email already exists");
        }

        User actorRef = userRepository.getReferenceById(actorId);
        Tenant tenant = new Tenant();
        tenant.setName(request.name().trim());
        tenant.setSlug(request.slug().trim());
        tenant.setStatus(TenantStatus.ACTIVE);
        tenant.setCreatedBy(actorRef);
        tenant.setUpdatedBy(actorRef);
        Tenant saved = tenantRepository.save(tenant);

        String temporaryPassword = generateTemporaryPassword();
        User admin = userService.create(
                adminEmail,
                adminDisplayName,
                passwordEncoder.encode(temporaryPassword),
                saved,
                true);

        Tenant withAudit = requireTenantWithAudit(saved.getId());
        return tenantMapper.toCreateResponse(
                withAudit, List.of(admin.getEmail()), admin, temporaryPassword);
    }

    @Override
    public TenantResponse update(UUID id, UpdateTenantRequest request, UUID actorId) {
        requirePathMatchesActiveTenant(id);
        Tenant tenant = requireTenant(id);
        if (tenantRepository.existsBySlugIgnoreCaseAndIdNot(request.slug(), id)) {
            throw new ConflictException("Tenant slug already exists");
        }
        tenant.setName(request.name());
        tenant.setSlug(request.slug());
        tenant.setUpdatedBy(userRepository.getReferenceById(actorId));
        tenantRepository.save(tenant);
        return getById(id);
    }

    @Override
    public void softDelete(UUID id, UUID actorId) {
        Tenant tenant = requireTenant(id);
        if (tenant.getStatus() == TenantStatus.INACTIVE) {
            return;
        }
        tenant.setStatus(TenantStatus.INACTIVE);
        tenant.setUpdatedBy(userRepository.getReferenceById(actorId));
        tenantRepository.save(tenant);
    }

    private Map<UUID, List<String>> adminEmailsByTenantIds(List<UUID> tenantIds) {
        if (tenantIds.isEmpty()) {
            return Collections.emptyMap();
        }
        return userRepository.findByTenantIdInAndTenantAdminTrue(tenantIds).stream()
                .collect(Collectors.groupingBy(
                        user -> user.getTenant().getId(),
                        Collectors.mapping(
                                User::getEmail,
                                Collectors.collectingAndThen(Collectors.toList(), emails -> emails
                                        .stream()
                                        .sorted(String.CASE_INSENSITIVE_ORDER)
                                        .toList()))));
    }

    private void requirePathMatchesActiveTenant(UUID id) {
        if (!accessSupport.canOperateOnTenant(id)) {
            throw new ForbiddenException("Access Denied");
        }
    }

    private Tenant requireTenant(UUID id) {
        return tenantRepository
                .findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tenant not found"));
    }

    private Tenant requireTenantWithAudit(UUID id) {
        return tenantRepository
                .findWithAuditById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Tenant not found"));
    }

    private String generateTemporaryPassword() {
        StringBuilder sb = new StringBuilder(TEMP_PASSWORD_LENGTH);
        for (int i = 0; i < TEMP_PASSWORD_LENGTH; i++) {
            sb.append(TEMP_PASSWORD_CHARS.charAt(SECURE_RANDOM.nextInt(TEMP_PASSWORD_CHARS.length())));
        }
        return sb.toString();
    }
}
