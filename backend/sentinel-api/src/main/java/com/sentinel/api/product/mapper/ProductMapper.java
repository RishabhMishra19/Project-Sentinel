package com.sentinel.api.product.mapper;

import com.sentinel.api.product.dto.request.CreateProductRequest;
import com.sentinel.api.product.dto.response.ProductResponse;
import com.sentinel.common.postgresql.product.Product;
import com.sentinel.common.postgresql.product.ProductStatus;
import com.sentinel.common.postgresql.tenant.Tenant;
import com.sentinel.common.postgresql.user.User;
import com.sentinel.api.user.mapper.UserMapper;
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
