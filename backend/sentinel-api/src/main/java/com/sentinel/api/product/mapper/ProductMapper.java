package com.sentinel.api.product.mapper;

import com.sentinel.server.product.dto.request.CreateProductRequest;
import com.sentinel.server.product.dto.response.ProductResponse;
import com.sentinel.server.product.entity.Product;
import com.sentinel.server.product.entity.ProductStatus;
import com.sentinel.server.tenant.entity.Tenant;
import com.sentinel.server.user.entity.User;
import com.sentinel.server.user.mapper.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ProductMapper {

    private final UserMapper userMapper;

    public Product toEntity(CreateProductRequest request, Tenant tenant, User actor) {
        Product product = new Product();
        product.setTenant(tenant);
        product.setName(request.name().trim());
        product.setStatus(ProductStatus.ACTIVE);
        product.setCreatedBy(actor);
        product.setUpdatedBy(actor);
        return product;
    }

    public ProductResponse toResponse(Product product) {
        return new ProductResponse(
                product.getId().toString(),
                product.getTenant().getId().toString(),
                product.getName(),
                product.getStatus(),
                userMapper.toBrief(product.getCreatedBy()),
                userMapper.toBrief(product.getUpdatedBy()),
                product.getCreatedAt(),
                product.getUpdatedAt());
    }
}
