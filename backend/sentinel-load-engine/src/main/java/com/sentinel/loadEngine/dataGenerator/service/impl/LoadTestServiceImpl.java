package com.sentinel.loadEngine.dataGenerator.service.impl;

import com.datastax.oss.driver.api.core.cql.ResultSet;
import com.datastax.oss.driver.api.core.cql.Row;
import com.datastax.oss.driver.api.core.cql.SimpleStatement;
import com.sentinel.common.cassandra.analytics.service.AnalyticsService;
import com.sentinel.common.cassandra.analytics.utils.AnalyticsBucket;
import com.sentinel.common.cassandra.analytics.utils.AnalyticsScope;
import com.sentinel.common.cassandra.requestlog.repository.RequestLogRepository;
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
import com.sentinel.loadEngine.dataGenerator.dto.request.LoadTestDataGenerateRequest;
import com.sentinel.loadEngine.dataGenerator.dto.response.LoadTestDataGenerationResponse;
import com.sentinel.loadEngine.dataGenerator.dto.response.LoadTestRelatedEntities;
import com.sentinel.loadEngine.dataGenerator.dto.response.LoadTestResponse;
import com.sentinel.loadEngine.dataGenerator.entity.LoadTest;
import com.sentinel.loadEngine.dataGenerator.repository.LoadTestRepository;
import com.sentinel.loadEngine.dataGenerator.service.LoadTestService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.cassandra.core.CassandraTemplate;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.UUID;
import java.util.stream.Collectors;

@org.springframework.stereotype.Service
@RequiredArgsConstructor
public class LoadTestServiceImpl implements LoadTestService {
    private static final int DELETE_LOG_BATCH_SIZE = 50;
    private static final String LOAD_TEST_STATUS_CREATED = "CREATED";
    private static final String LOAD_TEST = "_LOAD_TEST_SENTINEL_";

    private final TenantRepository tenantRepository;
    private final ProductRepository productRepository;
    private final ServiceRepository serviceRepository;
    private final UserRepository userRepository;
    private final LoadTestRepository loadTestRepository;
    private final EndpointRepository endpointRepository;
    private final RequestLogRepository requestLogRepository;
    private final CassandraTemplate cassandraTemplate;
    private final AnalyticsService analyticsService;

    @Value("${sentinel.admin.username}")
    private String adminUsername;

    @Override
    @Transactional
    public LoadTestDataGenerationResponse generate(LoadTestDataGenerateRequest request) {
        validate(request);

        User admin = getAdminUser();

        String prefix = request.prefix().trim();

        List<Tenant> tenants = generateTenants(
            prefix,
            request.tenantCount(),
            admin
        );

        tenantRepository.saveAll(tenants);

        List<Product> products = generateProducts(
            prefix,
            tenants,
            request.productsPerTenant(),
            admin
        );

        productRepository.saveAll(products);

        List<Service> services = generateServices(
            prefix,
            products,
            request.servicesPerProduct(),
            admin
        );

        serviceRepository.saveAll(services);

        UUID loadTestId = createLoadTest(
            prefix,
            tenants.size(),
            products.size(),
            services.size()
        );

        return new LoadTestDataGenerationResponse(
            loadTestId,
            prefix,
            tenants.size(),
            products.size(),
            services.size()
        );
    }

    @Override
    public LoadTestRelatedEntities getRelatedEntitiesByLoadTestId(UUID testDataId) {
        LoadTest loadTest = loadTestRepository.findById(testDataId)
            .orElseThrow(() -> new RuntimeException(
                "Load test not found: " + testDataId
            ));

        String tenantPrefix = this.getTenantPrefixFromLoadTestName(loadTest.getName());

        List<Tenant> tenants =
            tenantRepository.findByNameStartingWith(tenantPrefix);

        List<Product> products =
            productRepository.findByTenantIdIn(tenants.stream().map(Tenant::getId).toList());

        List<Service> services =
            serviceRepository.findByProductIdIn(products.stream().map(Product::getId).toList());

        List<Endpoint> endpoints =
            endpointRepository.findByServiceIdIn(services.stream().map(Service::getId).toList());

        long requestLogCount =
            requestLogRepository.countByTenantIdsAndServiceIds(
                tenants.stream().map(Tenant::getId).toList(),
                services.stream().map(Service::getId).toList()
            );

        long endpointMinuteAnalyticsCount = analyticsService.getCount(
            endpoints.stream().map(Endpoint::getId).toList(),
            AnalyticsScope.ENDPOINT,
            AnalyticsBucket.MINUTE
        );

        long endpointHourAnalyticsCount = analyticsService.getCount(
            endpoints.stream().map(Endpoint::getId).toList(),
            AnalyticsScope.ENDPOINT,
            AnalyticsBucket.HOUR
        );

        long endpointDayAnalyticsCount = analyticsService.getCount(
            endpoints.stream().map(Endpoint::getId).toList(),
            AnalyticsScope.ENDPOINT,
            AnalyticsBucket.DAY
        );

        long serviceMinuteAnalyticsCount = analyticsService.getCount(
            services.stream().map(Service::getId).toList(),
            AnalyticsScope.SERVICE,
            AnalyticsBucket.MINUTE
        );

        long serviceHourAnalyticsCount = analyticsService.getCount(
            services.stream().map(Service::getId).toList(),
            AnalyticsScope.SERVICE,
            AnalyticsBucket.HOUR
        );

        long serviceDayAnalyticsCount = analyticsService.getCount(
            services.stream().map(Service::getId).toList(),
            AnalyticsScope.SERVICE,
            AnalyticsBucket.DAY
        );

        long productMinuteAnalyticsCount = analyticsService.getCount(
            products.stream().map(Product::getId).toList(),
            AnalyticsScope.PRODUCT,
            AnalyticsBucket.MINUTE
        );

        long productHourAnalyticsCount = analyticsService.getCount(
            products.stream().map(Product::getId).toList(),
            AnalyticsScope.PRODUCT,
            AnalyticsBucket.HOUR
        );

        long productDayAnalyticsCount = analyticsService.getCount(
            products.stream().map(Product::getId).toList(),
            AnalyticsScope.PRODUCT,
            AnalyticsBucket.DAY
        );

        long tenantMinuteAnalyticsCount = analyticsService.getCount(
            tenants.stream().map(Tenant::getId).toList(),
            AnalyticsScope.TENANT,
            AnalyticsBucket.MINUTE
        );

        long tenantHourAnalyticsCount = analyticsService.getCount(
            tenants.stream().map(Tenant::getId).toList(),
            AnalyticsScope.TENANT,
            AnalyticsBucket.HOUR
        );

        long tenantDayAnalyticsCount = analyticsService.getCount(
            tenants.stream().map(Tenant::getId).toList(),
            AnalyticsScope.TENANT,
            AnalyticsBucket.DAY
        );

        return new LoadTestRelatedEntities(
            loadTest.getId(),
            tenants.stream().map(v -> new LoadTestRelatedEntities.IdName(v.getId(), v.getName())).toList(),
            products.stream().map(v -> new LoadTestRelatedEntities.IdName(v.getId(), v.getName())).toList(),
            services.stream().map(v -> new LoadTestRelatedEntities.IdName(v.getId(), v.getName())).toList(),
            endpoints.stream().map(v -> new LoadTestRelatedEntities.IdName(v.getId(), v.getMethod() + " : " + v.getPathTemplate()))
                .toList(),
            requestLogCount,
            LoadTestRelatedEntities.AnalyticsCount.builder()
                .endpointMinuteAnalyticsCount(endpointMinuteAnalyticsCount)
                .endpointHourAnalyticsCount(endpointHourAnalyticsCount)
                .endpointDayAnalyticsCount(endpointDayAnalyticsCount)
                .serviceMinuteAnalyticsCount(serviceMinuteAnalyticsCount)
                .serviceHourAnalyticsCount(serviceHourAnalyticsCount)
                .serviceDayAnalyticsCount(serviceDayAnalyticsCount)
                .productMinuteAnalyticsCount(productMinuteAnalyticsCount)
                .productHourAnalyticsCount(productHourAnalyticsCount)
                .productDayAnalyticsCount(productDayAnalyticsCount)
                .tenantMinuteAnalyticsCount(tenantMinuteAnalyticsCount)
                .tenantHourAnalyticsCount(tenantHourAnalyticsCount)
                .tenantDayAnalyticsCount(tenantDayAnalyticsCount)
                .build()
        );
    }

    @Override
    public LoadTestResponse getById(UUID loadTestId) {
        LoadTest loadTest = loadTestRepository.findById(loadTestId).orElse(null);
        return loadTest == null ? null : new LoadTestResponse(loadTest);
    }

    @Override
    @Transactional
    public boolean deleteById(UUID loadTestId) {
        LoadTestRelatedEntities relatedEntities = this.getRelatedEntitiesByLoadTestId(loadTestId);
        if (relatedEntities == null)
            return false;
        loadTestRepository.deleteById(relatedEntities.loadTestId());
        analyticsService.deleteByEntityIds(
            relatedEntities.endpoints().stream().map(LoadTestRelatedEntities.IdName::id).toList(),
            AnalyticsScope.ENDPOINT,
            AnalyticsBucket.MINUTE
        );
        analyticsService.deleteByEntityIds(
            relatedEntities.endpoints().stream().map(LoadTestRelatedEntities.IdName::id).toList(),
            AnalyticsScope.ENDPOINT,
            AnalyticsBucket.HOUR
        );

        analyticsService.deleteByEntityIds(
            relatedEntities.endpoints().stream().map(LoadTestRelatedEntities.IdName::id).toList(),
            AnalyticsScope.ENDPOINT,
            AnalyticsBucket.DAY
        );

        analyticsService.deleteByEntityIds(
            relatedEntities.services().stream().map(LoadTestRelatedEntities.IdName::id).toList(),
            AnalyticsScope.SERVICE,
            AnalyticsBucket.MINUTE
        );

        analyticsService.deleteByEntityIds(
            relatedEntities.services().stream().map(LoadTestRelatedEntities.IdName::id).toList(),
            AnalyticsScope.SERVICE,
            AnalyticsBucket.HOUR
        );

        analyticsService.deleteByEntityIds(
            relatedEntities.services().stream().map(LoadTestRelatedEntities.IdName::id).toList(),
            AnalyticsScope.SERVICE,
            AnalyticsBucket.DAY
        );

        analyticsService.deleteByEntityIds(
            relatedEntities.products().stream().map(LoadTestRelatedEntities.IdName::id).toList(),
            AnalyticsScope.PRODUCT,
            AnalyticsBucket.MINUTE
        );

        analyticsService.deleteByEntityIds(
            relatedEntities.products().stream().map(LoadTestRelatedEntities.IdName::id).toList(),
            AnalyticsScope.PRODUCT,
            AnalyticsBucket.HOUR
        );

        analyticsService.deleteByEntityIds(
            relatedEntities.products().stream().map(LoadTestRelatedEntities.IdName::id).toList(),
            AnalyticsScope.PRODUCT,
            AnalyticsBucket.DAY
        );

        analyticsService.deleteByEntityIds(
            relatedEntities.tenants().stream().map(LoadTestRelatedEntities.IdName::id).toList(),
            AnalyticsScope.TENANT,
            AnalyticsBucket.MINUTE
        );

        analyticsService.deleteByEntityIds(
            relatedEntities.tenants().stream().map(LoadTestRelatedEntities.IdName::id).toList(),
            AnalyticsScope.TENANT,
            AnalyticsBucket.HOUR
        );

        analyticsService.deleteByEntityIds(
            relatedEntities.tenants().stream().map(LoadTestRelatedEntities.IdName::id).toList(),
            AnalyticsScope.TENANT,
            AnalyticsBucket.DAY
        );
        this.deleteRequestLogs(
            relatedEntities.tenants().stream().map(LoadTestRelatedEntities.IdName::id).toList(),
            relatedEntities.services().stream().map(LoadTestRelatedEntities.IdName::id).toList()
        );
        endpointRepository.deleteAllByIdInBatch(relatedEntities.endpoints().stream().map(LoadTestRelatedEntities.IdName::id).toList());
        serviceRepository.deleteAllByIdInBatch(relatedEntities.services().stream().map(LoadTestRelatedEntities.IdName::id).toList());
        productRepository.deleteAllByIdInBatch(relatedEntities.products().stream().map(LoadTestRelatedEntities.IdName::id).toList());
        tenantRepository.deleteAllByIdInBatch(relatedEntities.tenants().stream().map(LoadTestRelatedEntities.IdName::id).toList());

        return true;
    }

    private User getAdminUser() {
        return userRepository
            .findByEmailIgnoreCase(adminUsername)
            .filter(User::isSentinelAdmin)
            .filter(user -> user.getStatus() == UserStatus.ACTIVE)
            .orElseThrow(() -> new IllegalStateException(
                "Active Sentinel admin user not found: " + adminUsername
            ));
    }

    private List<Tenant> generateTenants(
        String prefix,
        int count,
        User admin
    ) {
        List<Tenant> tenants = new ArrayList<>(count);

        for (int i = 0; i < count; i++) {
            String suffix = randomSuffix();

            Tenant tenant = new Tenant();
            tenant.setName(this.getTenantPrefix(prefix) + randomSuffix());
            tenant.setSlug(this.getTenantPrefix(prefix) + randomSuffix());
            tenant.setStatus(TenantStatus.ACTIVE);
            tenant.setCreatedBy(admin);
            tenant.setUpdatedBy(admin);

            tenants.add(tenant);
        }

        return tenants;
    }

    private List<Product> generateProducts(
        String prefix,
        List<Tenant> tenants,
        int productsPerTenant,
        User admin
    ) {
        int totalProducts = tenants.size() * productsPerTenant;
        List<Product> products = new ArrayList<>(totalProducts);

        for (Tenant tenant : tenants) {
            for (int i = 0; i < productsPerTenant; i++) {
                Product product = new Product();

                product.setTenant(tenant);
                product.setName(this.getProductPrefix(prefix) + randomSuffix());
                product.setStatus(ProductStatus.ACTIVE);
                product.setCreatedBy(admin);
                product.setUpdatedBy(admin);

                products.add(product);
            }
        }

        return products;
    }

    private List<Service> generateServices(
        String prefix,
        List<Product> products,
        int servicesPerProduct,
        User admin
    ) {
        int totalServices = products.size() * servicesPerProduct;
        List<Service> services = new ArrayList<>(totalServices);

        for (Product product : products) {
            for (int i = 0; i < servicesPerProduct; i++) {
                Service service = new Service();

                service.setProduct(product);
                service.setName(this.getServicePrefix(prefix) + randomSuffix());
                service.setStatus(ServiceStatus.ACTIVE);
                service.setCreatedBy(admin);
                service.setUpdatedBy(admin);

                services.add(service);
            }
        }

        return services;
    }

    private UUID createLoadTest(
        String prefix,
        int tenantCount,
        int productCount,
        int serviceCount
    ) {
        LoadTest loadTest = LoadTest.builder()
            .name(this.getLoadTestNamePrefix(prefix) + randomSuffix())
            .status(LOAD_TEST_STATUS_CREATED)
            .tenantCount(tenantCount)
            .productCount(productCount)
            .serviceCount(serviceCount)
            .createdAt(java.time.LocalDateTime.now())
            .updatedAt(java.time.LocalDateTime.now())
            .build();

        return loadTestRepository.save(loadTest).getId();
    }

    private void validate(LoadTestDataGenerateRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Request must not be null");
        }

        if (request.prefix() == null || request.prefix().isBlank()) {
            throw new IllegalArgumentException("Prefix must not be blank");
        }

        if (request.tenantCount() <= 0) {
            throw new IllegalArgumentException("tenantCount must be greater than 0");
        }

        if (request.productsPerTenant() <= 0) {
            throw new IllegalArgumentException(
                "productsPerTenant must be greater than 0"
            );
        }

        if (request.servicesPerProduct() <= 0) {
            throw new IllegalArgumentException(
                "servicesPerProduct must be greater than 0"
            );
        }
    }

    private String randomSuffix() {
        return UUID.randomUUID()
            .toString()
            .replace("-", "")
            .substring(0, 12);
    }

    private String normalize(String value) {
        return value
            .trim()
            .toLowerCase(Locale.ROOT)
            .replaceAll("[^a-z0-9]+", "-")
            .replaceAll("^-|-$", "");
    }

    private void deleteRequestLogs(List<UUID> tenantIds, List<UUID> serviceIds) {
        if (tenantIds == null || tenantIds.isEmpty() || serviceIds == null || serviceIds.isEmpty()) {
            return;
        }

        String tenantIdValues = tenantIds.stream().map(UUID::toString).collect(Collectors.joining(", "));

        String serviceIdValues = serviceIds.stream().map(UUID::toString).collect(Collectors.joining(", "));

        String selectCql = """
            SELECT id
            FROM request_logs
            WHERE tenant_id IN (%s)
              AND service_id IN (%s)
            """.formatted(tenantIdValues, serviceIdValues);

        SimpleStatement statement = SimpleStatement.builder(selectCql).setPageSize(DELETE_LOG_BATCH_SIZE).build();

        ResultSet resultSet = cassandraTemplate.getCqlOperations().queryForResultSet(statement);

        List<UUID> requestLogIds = new ArrayList<>(DELETE_LOG_BATCH_SIZE);

        for (Row row : resultSet) {
            requestLogIds.add(row.get("id", UUID.class));

            if (requestLogIds.size() == DELETE_LOG_BATCH_SIZE) {
                String ids = requestLogIds.stream().map(UUID::toString).collect(Collectors.joining(", "));

                cassandraTemplate.getCqlOperations().execute("DELETE FROM request_logs_lookup_by_id WHERE id IN (" + ids + ")");

                requestLogIds.clear();
            }
        }

        if (!requestLogIds.isEmpty()) {
            String ids = requestLogIds.stream().map(UUID::toString).collect(Collectors.joining(", "));

            cassandraTemplate.getCqlOperations().execute("DELETE FROM request_logs_lookup_by_id WHERE id IN (" + ids + ")");
        }

        String deleteLogsCql = """
            DELETE FROM request_logs
            WHERE tenant_id IN (%s)
              AND service_id IN (%s)
            """.formatted(tenantIdValues, serviceIdValues);

        cassandraTemplate.getCqlOperations().execute(deleteLogsCql);
    }

    private String getTenantPrefixFromLoadTestName(String loadTestName) {
        return loadTestName.split(LOAD_TEST)[0]+LOAD_TEST;
    }

    private String getLoadTestNamePrefix(String loadTestPrefix) {
        return loadTestPrefix + LOAD_TEST;
    }

    private String getTenantPrefix(String loadTestPrefix) {
        return this.getLoadTestNamePrefix(loadTestPrefix) + "tenant_";
    }

    private String getProductPrefix(String loadTestPrefix) {
        return this.getLoadTestNamePrefix(loadTestPrefix) + "service_";
    }

    private String getServicePrefix(String loadTestPrefix) {
        return this.getLoadTestNamePrefix(loadTestPrefix) + "product_";
    }
}
