package com.sentinel.loadEngine.loadTestData.entity;

import com.sentinel.common.postgresql.product.entity.Product;
import com.sentinel.common.postgresql.service.entity.Service;
import com.sentinel.common.postgresql.tenant.entity.Tenant;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LoadTestDataDTO {

    public LoadTestDataDTO(List<Tenant> tenants, Map<UUID, List<Product>> tenantProducts,
        Map<UUID, List<Service>> productServices, Map<UUID, List<LoadTestDataDTO.EndpointInfo>> serviceEndpoints, Map<UUID, String> apiKeysMap) {
        this.tenants = tenants.stream().map(tenant -> new TenantInfo(
            tenant.getId(),
            tenant.getName(),
            tenantProducts.getOrDefault(tenant.getId(), new ArrayList<>()).stream().map(product -> new ProductInfo(
                product.getId(),
                product.getName(),
                productServices.getOrDefault(product.getId(), new ArrayList<>()).stream().map(service -> new ServiceInfo(
                    service.getId(),
                    service.getName(),
                    serviceEndpoints.getOrDefault(service.getId(), new ArrayList<>())
                )).toList()
            )).toList()
        )).toList();
        this.apiKeysMap = apiKeysMap;
    }

    private List<TenantInfo> tenants;
    private Map<UUID, String> apiKeysMap;

    public record EndpointInfo(String method, String path) {
    }

    public record ServiceInfo(UUID serviceId, String serviceName, List<EndpointInfo> endpoints) {
    }

    public record ProductInfo(UUID productId, String productName, List<ServiceInfo> services) {
    }

    public record TenantInfo(UUID tenantId, String tenantName, List<ProductInfo> products) {
    }

    public List<UUID> getTenantIds() {
        List<UUID> tenantIds = new ArrayList<>();
        if (this.tenants != null) {
            for (TenantInfo tenant : this.tenants) {
                tenantIds.add(tenant.tenantId);
            }
        }
        return tenantIds;
    }

    public List<UUID> getProductIds() {
        List<UUID> productIds = new ArrayList<>();
        if (this.tenants != null) {
            for (TenantInfo tenant : this.tenants) {
                if (tenant.products != null) {
                    for (ProductInfo product : tenant.products) {
                        productIds.add(product.productId);
                    }
                }
            }
        }
        return productIds;
    }

    public List<UUID> getServiceIds() {
        List<UUID> serviceIds = new ArrayList<>();
        if (this.tenants != null) {
            for (TenantInfo tenant : this.tenants) {
                if (tenant.products != null) {
                    for (ProductInfo product : tenant.products) {
                        if (product.services != null) {
                            for (ServiceInfo service : product.services) {
                                serviceIds.add(service.serviceId);
                            }
                        }
                    }
                }
            }
        }
        return serviceIds;
    }

    public Map<UUID, List<EndpointInfo>> getServiceIdToEndpointInfoMap() {
        Map<UUID, List<EndpointInfo>> serviceIdToEndpointInfoMap = new HashMap<>();
        if (this.tenants != null) {
            for (TenantInfo tenant : this.tenants) {
                if (tenant.products != null) {
                    for (ProductInfo product : tenant.products) {
                        if (product.services != null) {
                            for (ServiceInfo service : product.services) {
                                serviceIdToEndpointInfoMap.putIfAbsent(service.serviceId, new ArrayList<>());
                                serviceIdToEndpointInfoMap.get(service.serviceId).addAll(service.endpoints);
                            }
                        }
                    }
                }
            }
        }
        return serviceIdToEndpointInfoMap;
    }


}
