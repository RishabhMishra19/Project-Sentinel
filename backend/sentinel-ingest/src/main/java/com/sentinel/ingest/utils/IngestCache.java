package com.sentinel.ingest.utils;

import com.sentinel.common.apikey.entity.ServiceApiKeyStatus;
import com.sentinel.common.apikey.repository.ServiceApiKeyRepository;
import com.sentinel.common.crypto.Sha256Hasher;
import com.sentinel.ingest.logs.repository.ServiceIdentityResolverRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.rubyeye.xmemcached.MemcachedClient;
import org.springframework.stereotype.Component;

import java.util.UUID;

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
        try{
            memcachedClient.set(key, ttl, value);
            return true;
        } catch (Exception e) {
            log.error("Failed to store ingest cache for key {}, ttl {}", key, value);
            return false;
        }
    }

    public <T> T resolve(String key){
        try{
            return memcachedClient.get(key);
        } catch (Exception e) {
            log.error("Failed to resolve ingest cache for key {}", key);
            return null;
        }
    }

    public ServiceIdentityResolverRepository.ServiceIdentity resolveServiceIdentity(UUID serviceId) {
        String key = SERVICE_IDENTITY_KEY + serviceId.toString();
        ServiceIdentityResolverRepository.ServiceIdentity serviceIdentity = null;
        try{
            serviceIdentity = memcachedClient.get(key);
            if(serviceIdentity == null){
                serviceIdentity = serviceIdentityResolverRepository.resolveServiceIdentity(serviceId);
                if(serviceIdentity != null) memcachedClient.set(key, TTL_IN_MS, serviceIdentity);
            }
        } catch (Exception e) {
            log.error(e.getMessage(), e);
            return serviceIdentityResolverRepository.resolveServiceIdentity(serviceId);
        }

        return serviceIdentity;
    }

    public boolean existsApiKey(String apiKey, UUID serviceId) {
        String key = API_KEY + serviceId.toString()+"_"+apiKey;
        Boolean exists = null;
        String keyHash = Sha256Hasher.hash(apiKey);
        try{
            exists = memcachedClient.get(key);
            if(exists == null){
                exists = serviceApiKeyRepository.existsByKeyHashAndServiceIdAndStatus(keyHash, serviceId,
                                                                                      ServiceApiKeyStatus.ACTIVE);
                memcachedClient.set(key, TTL_IN_MS, exists);
            }
        } catch (Exception e) {
            log.error(e.getMessage(), e);
            return serviceApiKeyRepository.existsByKeyHashAndServiceIdAndStatus(apiKey, serviceId,
                                                                                ServiceApiKeyStatus.ACTIVE);
        }

        return exists;
    }

}
