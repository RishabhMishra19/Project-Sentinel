package com.sentinel.ingest.event.service.core;

import com.sentinel.common.observability.repository.ServiceInstanceRepository;
import com.sentinel.ingest.common.exception.NotFoundException;
import com.sentinel.ingest.config.IngestCacheConfig;
import java.util.Collection;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.stereotype.Service;

@Service
public class InstanceOwnershipService {

    private final ServiceInstanceRepository serviceInstanceRepository;
    private final CacheManager cacheManager;

    public InstanceOwnershipService(
            ServiceInstanceRepository serviceInstanceRepository, CacheManager cacheManager) {
        this.serviceInstanceRepository = serviceInstanceRepository;
        this.cacheManager = cacheManager;
    }

    public void assertOwnedByService(Collection<UUID> instanceIds, UUID serviceId) {
        Set<UUID> distinct = new HashSet<>(instanceIds);
        Cache cache = cacheManager.getCache(IngestCacheConfig.INSTANCE_SERVICE_CACHE);

        for (UUID instanceId : distinct) {
            UUID ownerServiceId = null;
            if (cache != null) {
                ownerServiceId = cache.get(instanceId, UUID.class);
            }
            if (ownerServiceId == null) {
                ownerServiceId = serviceInstanceRepository
                        .findById(instanceId)
                        .map(instance -> {
                            if (cache != null) {
                                cache.put(instance.getId(), instance.getServiceId());
                            }
                            return instance.getServiceId();
                        })
                        .orElse(null);
            }
            if (ownerServiceId == null || !ownerServiceId.equals(serviceId)) {
                throw new NotFoundException("Service instance not found: " + instanceId);
            }
        }
    }
}
