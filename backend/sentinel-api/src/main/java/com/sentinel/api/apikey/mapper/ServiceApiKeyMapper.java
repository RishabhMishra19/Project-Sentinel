package com.sentinel.api.apikey.mapper;

import com.sentinel.api.apikey.dto.request.CreateServiceApiKeyRequest;
import com.sentinel.api.apikey.dto.response.ServiceApiKeyCreatedResponse;
import com.sentinel.api.apikey.dto.response.ServiceApiKeyResponse;
import com.sentinel.common.postgresql.user.entity.User;
import com.sentinel.api.user.mapper.UserMapper;
import com.sentinel.common.postgresql.apikey.entity.ServiceApiKey;
import com.sentinel.common.postgresql.apikey.entity.ServiceApiKeyStatus;
import com.sentinel.common.crypto.Sha256Hasher;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
@RequiredArgsConstructor
public class ServiceApiKeyMapper {

    private final UserMapper userMapper;

    public ServiceApiKey toEntity(
        CreateServiceApiKeyRequest request, UUID serviceId, String rawApiKey, UUID actorId) {
        ServiceApiKey entity = new ServiceApiKey();
        entity.setServiceId(serviceId);
        entity.setName(request.name().trim());
        entity.setKeyHash(Sha256Hasher.hash(rawApiKey));
        entity.setStatus(ServiceApiKeyStatus.ACTIVE);
        entity.setCreatedById(actorId);
        entity.setUpdatedById(actorId);
        return entity;
    }

    public ServiceApiKeyResponse toResponse(ServiceApiKey key, User createdBy, User updatedBy) {
        return new ServiceApiKeyResponse(
            key.getId().toString(),
            key.getServiceId().toString(),
            key.getName(),
            key.getStatus(),
            userMapper.toBrief(createdBy),
            userMapper.toBrief(updatedBy),
            key.getCreatedAt(),
            key.getUpdatedAt(),
            key.getRevokedAt());
    }

    public ServiceApiKeyCreatedResponse toCreatedResponse(
        ServiceApiKey key, User createdBy, User updatedBy, String rawApiKey) {
        return new ServiceApiKeyCreatedResponse(
            key.getId().toString(),
            key.getServiceId().toString(),
            key.getName(),
            key.getStatus(),
            userMapper.toBrief(createdBy),
            userMapper.toBrief(updatedBy),
            key.getCreatedAt(),
            key.getUpdatedAt(),
            key.getRevokedAt(),
            rawApiKey);
    }
}
