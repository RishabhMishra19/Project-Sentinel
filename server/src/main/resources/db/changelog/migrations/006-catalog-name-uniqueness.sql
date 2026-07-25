-- liquibase formatted sql

-- changeset sentinel:006-product-name-unique
CREATE UNIQUE INDEX uk_products_tenant_id_lower_name ON products (tenant_id, lower(name));

-- changeset sentinel:006-service-name-unique
CREATE UNIQUE INDEX uk_services_product_id_lower_name ON services (product_id, lower(name));
