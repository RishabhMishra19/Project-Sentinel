package com.sentinel.api.service.service;

import com.sentinel.server.common.exception.BadRequestException;
import com.sentinel.server.common.exception.ConflictException;
import com.sentinel.server.common.exception.ResourceNotFoundException;
import com.sentinel.server.common.query.ListQueryRequest;
import com.sentinel.server.common.response.PageResponse;
import com.sentinel.server.product.entity.Product;
import com.sentinel.server.product.service.core.ProductService;
import com.sentinel.server.service.dto.request.CreateServiceRequest;
import com.sentinel.server.service.dto.response.ServiceResponse;
import com.sentinel.server.service.dto.request.UpdateServiceRequest;
import com.sentinel.server.service.entity.Service;
import com.sentinel.server.service.entity.ServiceStatus;
import com.sentinel.server.service.mapper.ServiceMapper;
import com.sentinel.server.service.repository.ServiceSpecifications;
import com.sentinel.server.service.service.core.ServiceService;
import com.sentinel.server.user.entity.User;
import com.sentinel.server.user.repository.UserRepository;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.transaction.annotation.Transactional;

@org.springframework.stereotype.Service
@RequiredArgsConstructor
@Transactional
public class ServiceFacadeImpl implements ServiceFacade {

    private static final Sort DEFAULT_SORT = Sort.by(Sort.Direction.DESC, "createdAt");

    private final ServiceService serviceService;
    private final ServiceMapper serviceMapper;
    private final ProductService productService;
    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public PageResponse<ServiceResponse> list(
            UUID tenantId, UUID productId, ListQueryRequest query) {
        UUID effectiveTenantId = requireTenantId(tenantId);
        requireProductInTenant(effectiveTenantId, productId);
        Pageable effective =
                query.toPageable(ServiceSpecifications.SORTABLE_FIELDS, DEFAULT_SORT);
        Specification<Service> spec = ServiceSpecifications.withFilters(productId, query);
        Page<Service> page = serviceService.findAll(spec, effective);
        return PageResponse.from(page.map(serviceMapper::toResponse));
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<ServiceResponse> listAll(UUID tenantId, ListQueryRequest query) {
        UUID effectiveTenantId = requireTenantId(tenantId);
        Pageable effective =
                query.toPageable(ServiceSpecifications.SORTABLE_FIELDS, DEFAULT_SORT);
        Specification<Service> spec = ServiceSpecifications.forTenant(effectiveTenantId, query);
        Page<Service> page = serviceService.findAll(spec, effective);
        return PageResponse.from(page.map(serviceMapper::toResponse));
    }

    @Override
    @Transactional(readOnly = true)
    public ServiceResponse getById(UUID tenantId, UUID productId, UUID id) {
        UUID effectiveTenantId = requireTenantId(tenantId);
        requireProductInTenant(effectiveTenantId, productId);
        return serviceMapper.toResponse(requireServiceWithAudit(productId, id));
    }

    @Override
    public ServiceResponse create(
            UUID tenantId, UUID productId, CreateServiceRequest request, UUID actorId) {
        UUID effectiveTenantId = requireTenantId(tenantId);
        Product product = requireProductInTenant(effectiveTenantId, productId);
        String name = request.name().trim();
        if (serviceService.existsByProductIdAndNameIgnoreCase(productId, name)) {
            throw new ConflictException("Service name already exists in this product");
        }
        User actorRef = userRepository.getReferenceById(actorId);
        Service saved = serviceService.save(
                serviceMapper.toEntity(new CreateServiceRequest(name), product, actorRef));
        return serviceMapper.toResponse(requireServiceWithAudit(productId, saved.getId()));
    }

    @Override
    public ServiceResponse update(
            UUID tenantId,
            UUID productId,
            UUID id,
            UpdateServiceRequest request,
            UUID actorId) {
        UUID effectiveTenantId = requireTenantId(tenantId);
        requireProductInTenant(effectiveTenantId, productId);
        Service service = requireService(productId, id);
        String name = request.name().trim();
        if (serviceService.existsByProductIdAndNameIgnoreCaseAndIdNot(productId, name, id)) {
            throw new ConflictException("Service name already exists in this product");
        }
        service.setName(name);
        service.setUpdatedBy(userRepository.getReferenceById(actorId));
        serviceService.save(service);
        return serviceMapper.toResponse(requireServiceWithAudit(productId, id));
    }

    @Override
    public void softDelete(UUID tenantId, UUID productId, UUID id, UUID actorId) {
        UUID effectiveTenantId = requireTenantId(tenantId);
        requireProductInTenant(effectiveTenantId, productId);
        Service service = requireService(productId, id);
        if (service.getStatus() == ServiceStatus.INACTIVE) {
            return;
        }
        service.setStatus(ServiceStatus.INACTIVE);
        service.setUpdatedBy(userRepository.getReferenceById(actorId));
        serviceService.save(service);
    }

    private UUID requireTenantId(UUID tenantId) {
        if (tenantId == null) {
            throw new BadRequestException("Active tenant is required");
        }
        return tenantId;
    }

    private Product requireProductInTenant(UUID tenantId, UUID productId) {
        Product product = productService
                .findWithAuditByIdAndTenantId(productId, tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        return product;
    }

    private Service requireService(UUID productId, UUID id) {
        Service service = serviceService
                .findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service not found"));
        if (!service.getProduct().getId().equals(productId)) {
            throw new ResourceNotFoundException("Service not found");
        }
        return service;
    }

    private Service requireServiceWithAudit(UUID productId, UUID id) {
        return serviceService
                .findWithAuditByIdAndProductId(id, productId)
                .orElseThrow(() -> new ResourceNotFoundException("Service not found"));
    }
}
