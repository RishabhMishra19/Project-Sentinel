import { Section } from "../molecules/Section";

export const LoadTestEntities = ({ tenants }) => {
    return (
        <Section title="Test Scope">
            <div style={styles.tenantList}>
                {tenants.map((tenant) => (
                    <Tenant key={tenant.tenantId} tenant={tenant} />
                ))}
            </div>
        </Section>
    );
};

/* -------------------------------------------------- */
/* Tenant */
/* -------------------------------------------------- */

const Tenant = ({ tenant }) => {
    return (
        <div style={styles.tenant}>
            <div style={styles.tenantHeader}>
                <div>
                    <div style={styles.tenantLabel}>TENANT</div>

                    <div style={styles.tenantName}>{tenant.tenantName}</div>
                </div>

                <div style={styles.tenantId}>{tenant.tenantId}</div>
            </div>

            <div style={styles.productList}>
                {(tenant.products || []).map((product) => (
                    <Product key={product.productId} product={product} />
                ))}
            </div>
        </div>
    );
};

/* -------------------------------------------------- */
/* Product */
/* -------------------------------------------------- */

const Product = ({ product }) => {
    const serviceCount = product.services?.length || 0;

    const endpointCount = (product.services || []).reduce(
        (total, service) => total + (service.endpoints?.length || 0),
        0,
    );

    return (
        <div style={styles.product}>
            <div style={styles.productHeader}>
                <div>
                    <div style={styles.productLabel}>PRODUCT</div>

                    <div style={styles.productName}>{product.productName}</div>
                </div>

                <div style={styles.productStats}>
                    <span>{serviceCount} services</span>

                    <span>{endpointCount} endpoints</span>
                </div>
            </div>

            <div style={styles.serviceList}>
                {(product.services || []).map((service) => (
                    <Service key={service.serviceId} service={service} />
                ))}
            </div>
        </div>
    );
};

/* -------------------------------------------------- */
/* Service */
/* -------------------------------------------------- */

const Service = ({ service }) => {
    return (
        <div style={styles.service}>
            <div style={styles.serviceName}>{service.serviceName}</div>

            <div style={styles.serviceEndpointCount}>
                {service.endpoints?.length || 0}
                {" endpoints"}
            </div>
        </div>
    );
};

const styles = {
    tenantList: {
        display: "flex",
        flexDirection: "column",
        gap: "12px",
    },

    tenant: {
        border: "1px solid #e5e7eb",
        borderRadius: "9px",
        overflow: "hidden",
    },

    tenantHeader: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "15px",
        padding: "14px 16px",
        background: "#fafafa",
    },

    tenantLabel: {
        fontSize: "9px",
        fontWeight: 700,
        letterSpacing: "0.5px",
        color: "#9ca3af",
    },

    tenantName: {
        marginTop: "3px",
        fontSize: "13px",
        fontWeight: 600,
        color: "#374151",
    },

    tenantId: {
        fontFamily: "monospace",
        fontSize: "10px",
        color: "#9ca3af",
    },

    productList: {
        padding: "10px",
    },

    product: {
        padding: "12px",
        borderBottom: "1px solid #f0f0f0",
    },

    productHeader: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "10px",
    },

    productLabel: {
        fontSize: "9px",
        fontWeight: 700,
        letterSpacing: "0.5px",
        color: "#9ca3af",
    },

    productName: {
        marginTop: "2px",
        fontSize: "13px",
        fontWeight: 500,
        color: "#374151",
    },

    productStats: {
        display: "flex",
        gap: "12px",
        fontSize: "11px",
        color: "#9ca3af",
    },

    serviceList: {
        marginTop: "9px",
        display: "flex",
        flexDirection: "column",
        gap: "5px",
    },

    service: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "8px 10px",
        borderRadius: "6px",
        background: "#f9fafb",
    },

    serviceName: {
        fontSize: "12px",
        color: "#4b5563",
    },

    serviceEndpointCount: {
        fontSize: "10px",
        color: "#9ca3af",
    },
};
