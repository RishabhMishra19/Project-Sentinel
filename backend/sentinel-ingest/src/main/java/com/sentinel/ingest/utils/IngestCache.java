package com.sentinel.ingest.utils;

import com.sentinel.common.apikey.repository.ServiceApiKeyRepository;
import com.sentinel.ingest.logs.repository.ServiceIdentityResolverRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.rubyeye.xmemcached.MemcachedClient;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class IngestCache {

    private static final String SERVICE_IDENTITY_KEY = "service_identity_key_";
    private static final String API_KEY = "api_key_";
    private static final int TTL_IN_MS = 300;

    private final MemcachedClient memcachedClient;
    private final ServiceIdentityResolverRepository serviceIdentityResolverRepository;
    private final ServiceApiKeyRepository serviceApiKeyRepository;

    public <T> boolean store(String key, int ttl, T value) {
        try {
            memcachedClient.set(key, ttl, value);
            return true;
        } catch (Exception e) {
            log.error("Failed to store ingest cache for key {}, ttl {}", key, value);
            return false;
        }
    }

    public <T> T resolve(String key) {
        try {
            return memcachedClient.get(key);
        } catch (Exception e) {
            log.error("Failed to resolve ingest cache for key {}", key);
            return null;
        }
    }

}
