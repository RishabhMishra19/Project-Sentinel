package com.sentinel.loadEngine.loadTestData.service.impl;

import com.sentinel.common.cassandra.analytics.service.AnalyticsService;
import com.sentinel.common.cassandra.analytics.utils.AnalyticsBucket;
import com.sentinel.common.cassandra.analytics.utils.AnalyticsScope;
import com.sentinel.common.cassandra.requestlog.service.RequestLogCleanupService;
import com.sentinel.common.postgresql.apikey.entity.ServiceApiKey;
import com.sentinel.common.postgresql.apikey.entity.ServiceApiKeyStatus;
import com.sentinel.common.postgresql.apikey.repository.ServiceApiKeyRepository;
import com.sentinel.common.postgresql.endpoint.entity.Endpoint;
import com.sentinel.common.postgresql.endpoint.repository.EndpointRepository;
import com.sentinel.common.postgresql.product.entity.Product;
import com.sentinel.common.postgresql.product.entity.ProductStatus;
import com.sentinel.common.postgresql.product.repository.ProductRepository;
import com.sentinel.common.postgresql.service.entity.Service;
import com.sentinel.common.postgresql.service.entity.ServiceStatus;
import com.sentinel.common.postgresql.service.repository.ServiceRepository;
import com.sentinel.common.postgresql.tenant.entity.Tenant;
import com.sentinel.common.postgresql.tenant.entity.TenantStatus;
import com.sentinel.common.postgresql.tenant.repository.TenantRepository;
import com.sentinel.common.postgresql.user.entity.User;
import com.sentinel.common.postgresql.user.entity.UserStatus;
import com.sentinel.common.postgresql.user.repository.UserRepository;
import com.sentinel.loadEngine.loadTestData.dto.LoadTestDataWithLatestRun;
import com.sentinel.loadEngine.loadTestData.entity.LoadTestData;
import com.sentinel.loadEngine.loadTestData.entity.LoadTestDataDTO;
import com.sentinel.loadEngine.loadTestData.entity.LoadTestStatus;
import com.sentinel.loadEngine.loadTestData.repository.LoadTestDataRepository;
import com.sentinel.loadEngine.loadTestData.service.LoadTestDataService;
import com.sentinel.loadEngine.requestExecutor.dto.request.GenerateLoadTestDataRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@org.springframework.stereotype.Service
@RequiredArgsConstructor
public class LoadTestDataServiceImpl implements LoadTestDataService {
    private static final String LOAD_TEST = "_LOAD_TEST_SENTINEL_";

    @Value("${sentinel.admin.username}")
    private String adminUsername;

    private final LoadTestDataRepository loadTestDataRepository;
    private final UserRepository userRepository;
    private final TenantRepository tenantRepository;
    private final ProductRepository productRepository;
    private final ServiceRepository serviceRepository;
    private final EndpointRepository endpointRepository;
    private final ServiceApiKeyRepository serviceApiKeyRepository;
    private final AnalyticsService analyticsService;
    private final RequestLogCleanupService requestLogCleanupService;


    @Override
    @Transactional
    public LoadTestData create(GenerateLoadTestDataRequest request) {
        User admin = getAdminUser();
        String prefix = request.name().trim() + LOAD_TEST;

        List<Tenant> tenants = generateTenants(prefix, request.tenantCount(), admin);

        Map<UUID, List<Product>> tenantProducts = generateProducts(prefix, tenants, request.productsPerTenant(), admin);

        Map<UUID, List<Service>> productServices = generateServices(
            prefix, tenantProducts.values().stream().flatMap(List::stream).toList(), request.servicesPerProduct(), admin
        );

        Map<UUID, List<LoadTestDataDTO.EndpointInfo>> serviceEndpoints = this.generateEndpoints(
            productServices.values().stream().flatMap(List::stream).map(Service::getId).collect(Collectors.toSet()),
            request.endpointsPerService()
        );

        this.generateServiceApiKeys(
            productServices.values().stream().flatMap(List::stream).toList(),
            admin.getId()
        );

        LoadTestDataDTO dataDto = new LoadTestDataDTO(tenants, tenantProducts, productServices, serviceEndpoints);

        return loadTestDataRepository.save(LoadTestData.builder()
            .name(request.name()).status(LoadTestStatus.LOAD_IDLE).createdAt(Instant.now()).testData(dataDto)
            .build()
        );
    }

    @Override
    public LoadTestData getById(UUID id) {
        return loadTestDataRepository.findById(id).orElseThrow(() -> new RuntimeException("Load test data not available"));
    }

    @Override
    @Transactional
    public LoadTestData markRunning(UUID id) {
        LoadTestData loadTestData = this.getById(id);
        if (LoadTestStatus.DATA_DELETED.equals(loadTestData.getStatus())) {
            throw new IllegalStateException("Load test data deleted");
        }
        if (LoadTestStatus.LOAD_RUNNING.equals(loadTestData.getStatus())) {
            throw new IllegalStateException("Load test data already running");
        }
        loadTestData.setStatus(LoadTestStatus.LOAD_RUNNING);
        return loadTestDataRepository.save(loadTestData);
    }

    @Override
    @Transactional
    public LoadTestData markIdle(UUID id) {
        LoadTestData loadTestData = this.getById(id);
        if (LoadTestStatus.DATA_DELETED.equals(loadTestData.getStatus())) {
            throw new IllegalStateException("Load test data deleted");
        }
        if (LoadTestStatus.LOAD_IDLE.equals(loadTestData.getStatus())) {
            throw new IllegalStateException("Load test data already idle");
        }
        loadTestData.setStatus(LoadTestStatus.LOAD_IDLE);
        return loadTestDataRepository.save(loadTestData);
    }

    @Override
    @Transactional
    public void deleteDataById(UUID id) {
        LoadTestData loadTestData = this.getById(id);

        List<UUID> endpointIds = endpointRepository.findByServiceIdIn(loadTestData.getTestData().getServiceIds())
            .stream().map(Endpoint::getId).toList();

        analyticsService.deleteByEntityIds(endpointIds, AnalyticsScope.ENDPOINT, AnalyticsBucket.MINUTE);
        analyticsService.deleteByEntityIds(endpointIds, AnalyticsScope.ENDPOINT, AnalyticsBucket.HOUR);
        analyticsService.deleteByEntityIds(endpointIds, AnalyticsScope.ENDPOINT, AnalyticsBucket.DAY);

        analyticsService.deleteByEntityIds(loadTestData.getTestData().getServiceIds(), AnalyticsScope.SERVICE, AnalyticsBucket.MINUTE);
        analyticsService.deleteByEntityIds(loadTestData.getTestData().getServiceIds(), AnalyticsScope.SERVICE, AnalyticsBucket.HOUR);
        analyticsService.deleteByEntityIds(loadTestData.getTestData().getServiceIds(), AnalyticsScope.SERVICE, AnalyticsBucket.DAY);

        analyticsService.deleteByEntityIds(loadTestData.getTestData().getServiceIds(), AnalyticsScope.PRODUCT, AnalyticsBucket.MINUTE);
        analyticsService.deleteByEntityIds(loadTestData.getTestData().getServiceIds(), AnalyticsScope.PRODUCT, AnalyticsBucket.HOUR);
        analyticsService.deleteByEntityIds(loadTestData.getTestData().getServiceIds(), AnalyticsScope.PRODUCT, AnalyticsBucket.DAY);

        analyticsService.deleteByEntityIds(loadTestData.getTestData().getServiceIds(), AnalyticsScope.TENANT, AnalyticsBucket.MINUTE);
        analyticsService.deleteByEntityIds(loadTestData.getTestData().getServiceIds(), AnalyticsScope.TENANT, AnalyticsBucket.HOUR);
        analyticsService.deleteByEntityIds(loadTestData.getTestData().getServiceIds(), AnalyticsScope.TENANT, AnalyticsBucket.DAY);

        requestLogCleanupService.deleteRequestLogs(loadTestData.getTestData().getTenantIds(), loadTestData.getTestData().getServiceIds());

        endpointRepository.deleteAllByIdInBatch(endpointIds);
        serviceRepository.deleteAllByIdInBatch(loadTestData.getTestData().getServiceIds());
        productRepository.deleteAllByIdInBatch(loadTestData.getTestData().getProductIds());
        tenantRepository.deleteAllByIdInBatch(loadTestData.getTestData().getTenantIds());

        loadTestData.setStatus(LoadTestStatus.DATA_DELETED);
        loadTestDataRepository.save(loadTestData);
    }

    @Override
    public List<LoadTestDataWithLatestRun> findLoadTestDataWithLatestRuns() {
        return loadTestDataRepository.findLoadTestDataListWithLatestRuns();
    }


    private User getAdminUser() {
        return userRepository.findByEmailIgnoreCase(adminUsername).filter(User::isSentinelAdmin)
            .filter(user -> user.getStatus() == UserStatus.ACTIVE)
            .orElseThrow(() -> new IllegalStateException("Active Sentinel admin user not found: " + adminUsername));
    }

    private List<Tenant> generateTenants(String prefix, int count, User admin) {
        List<Tenant> tenants = new ArrayList<>(count);

        for (int i = 0; i < count; i++) {
            String suffix = randomSuffix();

            Tenant tenant = new Tenant();
            tenant.setName(prefix + suffix);
            tenant.setSlug(prefix + suffix);
            tenant.setStatus(TenantStatus.ACTIVE);
            tenant.setCreatedBy(admin);
            tenant.setUpdatedBy(admin);

            tenants.add(tenant);
        }

        return tenantRepository.saveAll(tenants);
    }

    private Map<UUID, List<Product>> generateProducts(String prefix, List<Tenant> tenants, int productsPerTenant, User admin) {
        int totalProducts = tenants.size() * productsPerTenant;
        List<Product> products = new ArrayList<>(totalProducts);

        for (Tenant tenant : tenants) {
            for (int i = 0; i < productsPerTenant; i++) {
                Product product = new Product();

                product.setTenant(tenant);
                product.setName(prefix + randomSuffix());
                product.setStatus(ProductStatus.ACTIVE);
                product.setCreatedBy(admin);
                product.setUpdatedBy(admin);

                products.add(product);
            }
        }

        products = productRepository.saveAll(products);
        Map<UUID, List<Product>> tenantProducts = new HashMap<>();

        for (Product product : products) {
            tenantProducts.putIfAbsent(product.getTenant().getId(), new ArrayList<>());
            tenantProducts.get(product.getTenant().getId()).add(product);
        }

        return tenantProducts;
    }

    private Map<UUID, List<Service>> generateServices(String prefix, List<Product> products, int servicesPerProduct, User admin) {
        int totalServices = products.size() * servicesPerProduct;
        List<Service> services = new ArrayList<>(totalServices);

        for (Product product : products) {
            for (int i = 0; i < servicesPerProduct; i++) {
                Service service = new Service();

                service.setProduct(product);
                service.setName(prefix + randomSuffix());
                service.setStatus(ServiceStatus.ACTIVE);
                service.setCreatedBy(admin);
                service.setUpdatedBy(admin);

                services.add(service);
            }
        }

        services = serviceRepository.saveAll(services);
        Map<UUID, List<Service>> productServices = new HashMap<>();

        for (Service service : services) {
            productServices.putIfAbsent(service.getProduct().getId(), new ArrayList<>());
            productServices.get(service.getProduct().getId()).add(service);
        }

        return productServices;
    }

    private Map<UUID, List<ServiceApiKey>> generateServiceApiKeys(
        List<Service> services,
        UUID adminId
    ) {
        List<ServiceApiKey> apiKeys = new ArrayList<>(services.size());

        for (Service service : services) {
            ServiceApiKey apiKey = new ServiceApiKey();

            apiKey.setServiceId(service.getId());
            apiKey.setName(service.getName() + "-Default-Key");
            // Simulate or hash a mock key string for load generation
            apiKey.setKeyHash("hash_" + UUID.randomUUID().toString().replace("-", ""));
            apiKey.setStatus(ServiceApiKeyStatus.ACTIVE); // Ensure this enum exists in your project
            apiKey.setCreatedById(adminId);
            apiKey.setUpdatedById(adminId);

            apiKeys.add(apiKey);
        }

        // Batch save to the database
        apiKeys = serviceApiKeyRepository.saveAll(apiKeys);

        // Map by serviceId for fast in-memory lookup during the load test loop
        Map<UUID, List<ServiceApiKey>> serviceApiKeyMap = new HashMap<>();
        for (ServiceApiKey apiKey : apiKeys) {
            serviceApiKeyMap.putIfAbsent(apiKey.getServiceId(), new ArrayList<>());
            serviceApiKeyMap.get(apiKey.getServiceId()).add(apiKey);
        }

        return serviceApiKeyMap;
    }

    private String randomSuffix() {
        return UUID.randomUUID().toString().replace("-", "").substring(0, 12);
    }

    private Map<UUID, List<LoadTestDataDTO.EndpointInfo>> generateEndpoints(Set<UUID> serviceIds, int endpointsPerService) {
        Map<UUID, List<LoadTestDataDTO.EndpointInfo>> result = new HashMap<>(serviceIds.size());

        for (UUID serviceId : serviceIds) {
            List<LoadTestDataDTO.EndpointInfo> endpoints = new ArrayList<>(endpointsPerService);

            for (int i = 0; i < endpointsPerService; i++) {
                endpoints.add(new LoadTestDataDTO.EndpointInfo("GET", "/load-test/e" + UUID.randomUUID() + "/resource"));
            }

            result.put(serviceId, endpoints);
        }

        return result;
    }
}
