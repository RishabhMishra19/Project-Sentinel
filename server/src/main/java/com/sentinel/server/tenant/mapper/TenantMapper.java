package com.sentinel.server.tenant.mapper;

import com.sentinel.server.tenant.dto.TenantResponse;
import com.sentinel.server.tenant.entity.Tenant;
import com.sentinel.server.user.mapper.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class TenantMapper {

    private final UserMapper userMapper;

    public TenantResponse toResponse(Tenant tenant) {
        return new TenantResponse(
                tenant.getId().toString(),
                tenant.getName(),
                tenant.getSlug(),
                tenant.getStatus(),
                userMapper.toBrief(tenant.getCreatedBy()),
                userMapper.toBrief(tenant.getUpdatedBy()),
                tenant.getCreatedAt(),
                tenant.getUpdatedAt());
    }
}
