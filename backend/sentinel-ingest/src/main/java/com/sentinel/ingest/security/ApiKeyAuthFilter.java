package com.sentinel.ingest.security;

import tools.jackson.databind.ObjectMapper;
import com.sentinel.common.apikey.entity.ServiceApiKey;
import com.sentinel.common.apikey.entity.ServiceApiKeyStatus;
import com.sentinel.common.apikey.repository.ServiceApiKeyRepository;
import com.sentinel.common.crypto.Sha256Hasher;
import com.sentinel.ingest.common.dto.response.ApiError;
import com.sentinel.ingest.common.exception.ErrorCode;
import com.sentinel.ingest.config.IngestCacheConfig;
import com.sentinel.ingest.support.ServiceActiveChecker;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.time.Instant;
import java.util.Optional;
import java.util.UUID;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.http.MediaType;
import org.springframework.web.filter.OncePerRequestFilter;

public class ApiKeyAuthFilter extends OncePerRequestFilter {

    private static final String BEARER_PREFIX = "Bearer ";

    private final ServiceApiKeyRepository serviceApiKeyRepository;
    private final ServiceActiveChecker serviceActiveChecker;
    private final CacheManager cacheManager;
    private final ObjectMapper objectMapper;

    public ApiKeyAuthFilter(
            ServiceApiKeyRepository serviceApiKeyRepository,
            ServiceActiveChecker serviceActiveChecker,
            CacheManager cacheManager,
            ObjectMapper objectMapper) {
        this.serviceApiKeyRepository = serviceApiKeyRepository;
        this.serviceActiveChecker = serviceActiveChecker;
        this.cacheManager = cacheManager;
        this.objectMapper = objectMapper;
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();
        return path.startsWith("/actuator");
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String header = request.getHeader("Authorization");
        if (header == null || !header.startsWith(BEARER_PREFIX)) {
            writeUnauthorized(request, response, "Missing or invalid Authorization header");
            return;
        }

        String rawKey = header.substring(BEARER_PREFIX.length()).trim();
        if (rawKey.isEmpty()) {
            writeUnauthorized(request, response, "Missing API key");
            return;
        }

        String keyHash = Sha256Hasher.hash(rawKey);
        Optional<UUID> serviceIdOpt = resolveActiveServiceId(keyHash);
        if (serviceIdOpt.isEmpty()) {
            writeUnauthorized(request, response, "Invalid or revoked API key");
            return;
        }

        UUID serviceId = serviceIdOpt.get();
        if (!isServiceActive(serviceId)) {
            writeUnauthorized(request, response, "Service is not active");
            return;
        }

        ServicePrincipalHolder.set(request, new ServicePrincipal(serviceId));
        filterChain.doFilter(request, response);
    }

    private Optional<UUID> resolveActiveServiceId(String keyHash) {
        Cache cache = cacheManager.getCache(IngestCacheConfig.API_KEY_CACHE);
        if (cache != null) {
            UUID cached = cache.get(keyHash, UUID.class);
            if (cached != null) {
                return Optional.of(cached);
            }
        }

        Optional<UUID> serviceId = serviceApiKeyRepository
                .findByKeyHashAndStatus(keyHash, ServiceApiKeyStatus.ACTIVE)
                .map(ServiceApiKey::getServiceId);

        if (serviceId.isPresent() && cache != null) {
            cache.put(keyHash, serviceId.get());
        }
        return serviceId;
    }

    private boolean isServiceActive(UUID serviceId) {
        Cache cache = cacheManager.getCache(IngestCacheConfig.SERVICE_ACTIVE_CACHE);
        if (cache != null) {
            Boolean cached = cache.get(serviceId, Boolean.class);
            if (cached != null) {
                return cached;
            }
        }

        boolean active = serviceActiveChecker.isActive(serviceId);
        if (cache != null) {
            cache.put(serviceId, active);
        }
        return active;
    }

    private void writeUnauthorized(
            HttpServletRequest request, HttpServletResponse response, String message)
            throws IOException {
        ErrorCode code = ErrorCode.UNAUTHORIZED;
        response.setStatus(code.getStatus().value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        objectMapper.writeValue(
                response.getOutputStream(),
                new ApiError(
                        Instant.now(),
                        code.name(),
                        code.getReason(),
                        message,
                        request.getRequestURI(),
                        null));
    }
}
