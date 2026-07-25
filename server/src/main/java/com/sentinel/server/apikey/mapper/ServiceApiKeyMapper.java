package com.sentinel.server.apikey.mapper;

import com.sentinel.server.apikey.dto.request.CreateServiceApiKeyRequest;
import com.sentinel.server.apikey.dto.response.ServiceApiKeyCreatedResponse;
import com.sentinel.server.apikey.dto.response.ServiceApiKeyResponse;
import com.sentinel.server.apikey.entity.ServiceApiKey;
import com.sentinel.server.apikey.entity.ServiceApiKeyStatus;
import com.sentinel.server.common.crypto.Sha256Hasher;
import com.sentinel.server.service.entity.Service;
import com.sentinel.server.user.entity.User;
import com.sentinel.server.user.mapper.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ServiceApiKeyMapper {

    private final UserMapper userMapper;

    public ServiceApiKey toEntity(
            CreateServiceApiKeyRequest request, Service service, String rawApiKey, User actor) {
        ServiceApiKey entity = new ServiceApiKey();
        entity.setService(service);
        entity.setName(request.name().trim());
        entity.setKeyHash(Sha256Hasher.hash(rawApiKey));
        entity.setStatus(ServiceApiKeyStatus.ACTIVE);
        entity.setCreatedBy(actor);
        entity.setUpdatedBy(actor);
        return entity;
    }

    public ServiceApiKeyResponse toResponse(ServiceApiKey key) {
        return new ServiceApiKeyResponse(
                key.getId().toString(),
                key.getService().getId().toString(),
                key.getName(),
                key.getStatus(),
                userMapper.toBrief(key.getCreatedBy()),
                userMapper.toBrief(key.getUpdatedBy()),
                key.getCreatedAt(),
                key.getUpdatedAt(),
                key.getRevokedAt());
    }

    public ServiceApiKeyCreatedResponse toCreatedResponse(ServiceApiKey key, String rawApiKey) {
        return new ServiceApiKeyCreatedResponse(
                key.getId().toString(),
                key.getService().getId().toString(),
                key.getName(),
                key.getStatus(),
                userMapper.toBrief(key.getCreatedBy()),
                userMapper.toBrief(key.getUpdatedBy()),
                key.getCreatedAt(),
                key.getUpdatedAt(),
                key.getRevokedAt(),
                rawApiKey);
    }
}
