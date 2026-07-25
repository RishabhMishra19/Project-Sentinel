package com.sentinel.server.tenant.mapper;

import com.sentinel.server.tenant.dto.response.CreateTenantResponse;
import com.sentinel.server.tenant.dto.response.TenantResponse;
import com.sentinel.server.tenant.entity.Tenant;
import com.sentinel.server.user.entity.User;
import com.sentinel.server.user.mapper.UserMapper;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class TenantMapper {

    private final UserMapper userMapper;

    public TenantResponse toResponse(Tenant tenant, List<String> adminEmails) {
        return new TenantResponse(
                tenant.getId().toString(),
                tenant.getName(),
                tenant.getSlug(),
                tenant.getStatus(),
                adminEmails,
                userMapper.toBrief(tenant.getCreatedBy()),
                userMapper.toBrief(tenant.getUpdatedBy()),
                tenant.getCreatedAt(),
                tenant.getUpdatedAt());
    }

    public CreateTenantResponse toCreateResponse(
            Tenant tenant, List<String> adminEmails, User admin, String temporaryPassword) {
        TenantResponse base = toResponse(tenant, adminEmails);
        return new CreateTenantResponse(
                base.id(),
                base.name(),
                base.slug(),
                base.status(),
                base.adminEmails(),
                base.createdBy(),
                base.updatedBy(),
                base.createdAt(),
                base.updatedAt(),
                new CreateTenantResponse.AdminSummary(
                        admin.getId().toString(),
                        admin.getEmail(),
                        admin.getDisplayName(),
                        admin.isTenantAdmin()),
                temporaryPassword);
    }
}
