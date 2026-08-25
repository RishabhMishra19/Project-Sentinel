package com.sentinel.api.service.mapper;

import com.sentinel.common.postgresql.product.Product;
import com.sentinel.api.service.dto.request.CreateServiceRequest;
import com.sentinel.api.service.dto.response.ServiceResponse;
import com.sentinel.common.postgresql.service.Service;
import com.sentinel.common.postgresql.service.ServiceStatus;
import com.sentinel.common.postgresql.user.User;
import com.sentinel.api.user.mapper.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ServiceMapper {

    private final UserMapper userMapper;

    public Service toEntity(CreateServiceRequest request, Product product, User actor) {
        Service service = new Service();
        service.setProduct(product);
        service.setName(request.name().trim());
        service.setStatus(ServiceStatus.ACTIVE);
        service.setCreatedBy(actor);
        service.setUpdatedBy(actor);
        return service;
    }

    public ServiceResponse toResponse(Service service) {
        return new ServiceResponse(
            service.getId().toString(),
            service.getProduct().getId().toString(),
            service.getProduct().getName(),
            service.getName(),
            service.getStatus(),
            userMapper.toBrief(service.getCreatedBy()),
            userMapper.toBrief(service.getUpdatedBy()),
            service.getCreatedAt(),
            service.getUpdatedAt());
    }
}
