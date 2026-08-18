package com.sentinel.api.service.mapper;

import com.sentinel.server.product.entity.Product;
import com.sentinel.server.service.dto.request.CreateServiceRequest;
import com.sentinel.server.service.dto.response.ServiceResponse;
import com.sentinel.server.service.entity.Service;
import com.sentinel.server.service.entity.ServiceStatus;
import com.sentinel.server.user.entity.User;
import com.sentinel.server.user.mapper.UserMapper;
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
