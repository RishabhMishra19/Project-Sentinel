package com.sentinel.server.tenant.service;

import com.sentinel.server.common.exception.ConflictException;
import com.sentinel.server.common.exception.ResourceNotFoundException;
import com.sentinel.server.common.response.PageResponse;
import com.sentinel.server.tenant.dto.request.CreateTenantRequest;
import com.sentinel.server.tenant.dto.response.TenantResponse;
import com.sentinel.server.tenant.dto.request.UpdateTenantRequest;
import com.sentinel.server.tenant.entity.Tenant;
import com.sentinel.server.tenant.entity.TenantStatus;
import com.sentinel.server.tenant.mapper.TenantMapper;
import com.sentinel.server.tenant.repository.TenantRepository;
import com.sentinel.server.tenant.repository.TenantSpecifications;
import com.sentinel.server.user.entity.User;
import com.sentinel.server.user.repository.UserRepository;
import java.time.LocalDate;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class TenantFacadeImpl implements TenantFacade {

    private static final Sort DEFAULT_SORT = Sort.by(Sort.Direction.DESC, "createdAt");

    private final TenantRepository tenantRepository;
    private final UserRepository userRepository;
    private final TenantMapper tenantMapper;

    @Override
    @Transactional(readOnly = true)
    public PageResponse<TenantResponse> list(
            Pageable pageable,
            TenantStatus status,
            String q,
            String searchBy,
            LocalDate createdFrom,
            LocalDate createdTo) {
        Pageable effective = withDefaultSort(pageable);
        Specification<Tenant> spec =
                TenantSpecifications.withFilters(status, q, searchBy, createdFrom, createdTo);
        Page<Tenant> page = tenantRepository.findAll(spec, effective);
        return PageResponse.from(page.map(tenantMapper::toResponse));
    }

    @Override
    @Transactional(readOnly = true)
    public TenantResponse getById(UUID id) {
        return tenantMapper.toResponse(requireTenantWithAudit(id));
    }

    @Override
    public TenantResponse create(CreateTenantRequest request, UUID actorId) {
        if (tenantRepository.existsBySlugIgnoreCase(request.slug())) {
            throw new ConflictException("Tenant slug already exists");
        }
        User actorRef = userRepository.getReferenceById(actorId);
        Tenant tenant = new Tenant();
        tenant.setName(request.name());
        tenant.setSlug(request.slug());
        tenant.setStatus(TenantStatus.ACTIVE);
        tenant.setCreatedBy(actorRef);
        tenant.setUpdatedBy(actorRef);
        Tenant saved = tenantRepository.save(tenant);
        return tenantMapper.toResponse(requireTenantWithAudit(saved.getId()));
    }

    @Override
    public TenantResponse update(UUID id, UpdateTenantRequest request, UUID actorId) {
        Tenant tenant = requireTenant(id);
        if (tenantRepository.existsBySlugIgnoreCaseAndIdNot(request.slug(), id)) {
            throw new ConflictException("Tenant slug already exists");
        }
        tenant.setName(request.name());
        tenant.setSlug(request.slug());
        tenant.setUpdatedBy(userRepository.getReferenceById(actorId));
        tenantRepository.save(tenant);
        return tenantMapper.toResponse(requireTenantWithAudit(id));
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

    private Pageable withDefaultSort(Pageable pageable) {
        if (pageable.getSort().isSorted()) {
            return pageable;
        }
        return PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), DEFAULT_SORT);
    }
}
