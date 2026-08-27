package com.sentinel.ingest.logs.dto;

import com.sentinel.common.crypto.Sha256Hasher;

import java.util.UUID;

public record EndpointKey(UUID serviceId, String method, String pathTemplate) {
    public String getHash(){
        return Sha256Hasher.hash(String.format("%s_service_%s_method_%s_", serviceId, method, pathTemplate));
    }
}
