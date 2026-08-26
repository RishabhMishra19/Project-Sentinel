import { useMemo, useState } from "react";

const LoadTestDataViewer = ({ data }) => {
    const loadTestData = data?.associatedLoadTestData;

    const [search, setSearch] = useState("");
    const [expandedServices, setExpandedServices] = useState(new Set());

    const tenants = loadTestData?.tenants || [];

    const services = useMemo(() => {
        const query = search.trim().toLowerCase();

        return tenants.flatMap((tenant) =>
            (tenant.products || []).flatMap((product) =>
                (product.services || [])
                    .map((service) => ({
                        tenantName: tenant.tenantName,
                        productName: product.productName,
                        serviceId: service.serviceId,
                        serviceName: service.serviceName,
                        endpoints: service.endpoints || [],
                    }))
                    .filter((service) => {
                        if (!query) {
                            return true;
                        }

                        return (
                            service.serviceName.toLowerCase().includes(query) ||
                            service.serviceId.toLowerCase().includes(query) ||
                            service.endpoints.some(
                                (endpoint) =>
                                    endpoint.method
                                        .toLowerCase()
                                        .includes(query) ||
                                    endpoint.path.toLowerCase().includes(query),
                            )
                        );
                    }),
            ),
        );
    }, [tenants, search]);

    const toggleService = (serviceId) => {
        setExpandedServices((previous) => {
            const next = new Set(previous);

            if (next.has(serviceId)) {
                next.delete(serviceId);
            } else {
                next.add(serviceId);
            }

            return next;
        });
    };

    const expandAll = () => {
        setExpandedServices(
            new Set(services.map((service) => service.serviceId)),
        );
    };

    const collapseAll = () => {
        setExpandedServices(new Set());
    };

    return (
        <div style={styles.container}>
            <Toolbar
                search={search}
                setSearch={setSearch}
                onExpandAll={expandAll}
                onCollapseAll={collapseAll}
            />

            {services.length === 0 ? (
                <EmptyState search={search} />
            ) : (
                <div style={styles.serviceList}>
                    {services.map((service) => (
                        <ServiceCard
                            key={service.serviceId}
                            service={service}
                            expanded={expandedServices.has(service.serviceId)}
                            onToggle={() => toggleService(service.serviceId)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

/* ---------------- Toolbar ---------------- */

const Toolbar = ({ search, setSearch, onExpandAll, onCollapseAll }) => {
    return (
        <div style={styles.toolbar}>
            <div style={styles.searchWrapper}>
                <span style={styles.searchIcon}>⌕</span>

                <input
                    type="text"
                    placeholder="Search service or endpoint..."
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    style={styles.searchInput}
                />

                {search && (
                    <button
                        type="button"
                        onClick={() => setSearch("")}
                        style={styles.clearButton}
                    >
                        ×
                    </button>
                )}
            </div>

            <div style={styles.toolbarActions}>
                <button
                    type="button"
                    onClick={onExpandAll}
                    style={styles.toolbarButton}
                >
                    Expand all
                </button>

                <button
                    type="button"
                    onClick={onCollapseAll}
                    style={styles.toolbarButton}
                >
                    Collapse all
                </button>
            </div>
        </div>
    );
};

/* ---------------- Service Card ---------------- */

const ServiceCard = ({ service, expanded, onToggle }) => {
    return (
        <div
            style={{
                ...styles.serviceCard,
                borderColor: expanded ? "#c7c9d1" : "#e5e7eb",
            }}
        >
            <button
                type="button"
                onClick={onToggle}
                style={styles.serviceHeader}
            >
                <div style={styles.serviceInfo}>
                    <span
                        style={{
                            ...styles.chevron,
                            transform: expanded
                                ? "rotate(90deg)"
                                : "rotate(0deg)",
                            color: expanded ? "#4f46e5" : "#9ca3af",
                        }}
                    >
                        ›
                    </span>

                    <div style={{ minWidth: 0 }}>
                        <div style={styles.serviceTitle}>
                            {service.serviceName}
                        </div>

                        <div style={styles.serviceBreadcrumb}>
                            <span style={styles.breadcrumbLabel}>Tenant:</span>{" "}
                            {service.tenantName}
                            <span style={styles.breadcrumbSeparator}>›</span>
                            <span style={styles.breadcrumbLabel}>
                                Product:
                            </span>{" "}
                            {service.productName}
                        </div>
                    </div>
                </div>

                <EndpointCount count={service.endpoints.length} />
            </button>

            {expanded && (
                <div style={styles.endpointList}>
                    {service.endpoints.map((endpoint, index) => (
                        <EndpointRow
                            key={`${endpoint.method}-${endpoint.path}-${index}`}
                            endpoint={endpoint}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

/* ---------------- Endpoint Count ---------------- */

const EndpointCount = ({ count }) => {
    return (
        <div style={styles.endpointCount}>
            <strong>{count}</strong>

            <span style={styles.endpointCountText}>
                {count === 1 ? " endpoint" : " endpoints"}
            </span>
        </div>
    );
};

/* ---------------- Endpoint Row ---------------- */

const EndpointRow = ({ endpoint }) => {
    return (
        <div style={styles.endpointRow}>
            <MethodBadge method={endpoint.method} />

            <code style={styles.endpointPath}>{endpoint.path}</code>
        </div>
    );
};

/* ---------------- HTTP Method ---------------- */

const MethodBadge = ({ method }) => {
    const methodStyles = {
        GET: {
            background: "#dcfce7",
            color: "#166534",
        },

        POST: {
            background: "#dbeafe",
            color: "#1d4ed8",
        },

        PUT: {
            background: "#fef3c7",
            color: "#92400e",
        },

        PATCH: {
            background: "#f3e8ff",
            color: "#7e22ce",
        },

        DELETE: {
            background: "#fee2e2",
            color: "#b91c1c",
        },
    };

    const colors = methodStyles[method?.toUpperCase()] || {
        background: "#f3f4f6",
        color: "#374151",
    };

    return (
        <span
            style={{
                ...styles.method,
                background: colors.background,
                color: colors.color,
            }}
        >
            {method}
        </span>
    );
};

/* ---------------- Empty State ---------------- */

const EmptyState = ({ search }) => {
    return (
        <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>⌕</div>

            <h3 style={styles.emptyTitle}>
                {search ? "No endpoints found" : "No load test data found"}
            </h3>

            <p style={styles.emptyText}>
                {search
                    ? "Try searching with a different service, method, or path."
                    : "There are no services or endpoints configured for this load test."}
            </p>
        </div>
    );
};

/* ---------------- Styles ---------------- */

const styles = {
    container: {
        width: "100%",
        color: "#111827",
    },

    header: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "24px",
        marginBottom: "24px",
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: "red",
        margin: "10px 0px",
    },

    title: {
        margin: 0,
        fontSize: "22px",
        fontWeight: 700,
    },

    subtitle: {
        margin: "5px 0 0",
        color: "#6b7280",
        fontSize: "14px",
    },

    stats: {
        display: "flex",
        gap: "10px",
    },

    stat: {
        minWidth: "85px",
        padding: "10px 15px",
        border: "1px solid #e5e7eb",
        borderRadius: "10px",
        background: "#fff",
        textAlign: "center",
    },

    statValue: {
        fontSize: "20px",
        fontWeight: 700,
    },

    statLabel: {
        marginTop: "2px",
        fontSize: "12px",
        color: "#6b7280",
    },

    toolbar: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "16px",
        marginBottom: "16px",
    },

    searchWrapper: {
        position: "relative",
        width: "100%",
        maxWidth: "500px",
    },

    searchIcon: {
        position: "absolute",
        left: "13px",
        top: "50%",
        transform: "translateY(-50%)",
        color: "#9ca3af",
        fontSize: "20px",
        pointerEvents: "none",
    },

    searchInput: {
        width: "100%",
        height: "42px",
        boxSizing: "border-box",
        padding: "0 40px 0 38px",
        border: "1px solid #d1d5db",
        borderRadius: "8px",
        outline: "none",
        fontSize: "14px",
    },

    clearButton: {
        position: "absolute",
        right: "8px",
        top: "50%",
        transform: "translateY(-50%)",
        border: "none",
        background: "transparent",
        color: "#6b7280",
        cursor: "pointer",
        fontSize: "20px",
    },

    toolbarActions: {
        display: "flex",
        gap: "8px",
    },

    toolbarButton: {
        height: "42px",
        padding: "0 14px",
        border: "1px solid #d1d5db",
        borderRadius: "8px",
        background: "#fff",
        color: "#374151",
        cursor: "pointer",
        fontSize: "13px",
        fontWeight: 500,
    },

    serviceList: {
        display: "flex",
        flexDirection: "column",
        gap: "10px",
    },

    serviceCard: {
        overflow: "hidden",
        border: "1px solid",
        borderRadius: "10px",
        background: "#fff",
    },

    serviceHeader: {
        width: "100%",
        minHeight: "70px",
        padding: "14px 18px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "20px",
        border: "none",
        background: "#fff",
        cursor: "pointer",
        textAlign: "left",
    },

    serviceInfo: {
        display: "flex",
        alignItems: "center",
        minWidth: 0,
    },

    chevron: {
        width: "26px",
        flexShrink: 0,
        fontSize: "26px",
        transition: "transform 0.15s ease",
    },

    serviceTitle: {
        fontSize: "14px",
        fontWeight: 600,
        color: "#374151",
    },

    serviceBreadcrumb: {
        marginTop: "3px",
        fontSize: "12px",
        color: "#6b7280",
    },

    serviceId: {
        marginTop: "3px",
        fontFamily: "monospace",
        fontSize: "11px",
        color: "#9ca3af",
        overflow: "hidden",
        textOverflow: "ellipsis",
    },

    endpointCount: {
        flexShrink: 0,
        padding: "5px 10px",
        borderRadius: "20px",
        background: "#f3f4f6",
        fontSize: "13px",
    },

    endpointCountText: {
        color: "#6b7280",
        fontWeight: 400,
    },

    endpointList: {
        borderTop: "1px solid #e5e7eb",
        background: "#fafafa",
    },

    endpointRow: {
        minHeight: "52px",
        padding: "10px 20px 10px 62px",
        display: "flex",
        alignItems: "center",
        gap: "14px",
        borderBottom: "1px solid #f0f0f0",
        boxSizing: "border-box",
    },

    method: {
        minWidth: "52px",
        padding: "4px 7px",
        borderRadius: "5px",
        textAlign: "center",
        fontFamily: "monospace",
        fontSize: "11px",
        fontWeight: 700,
    },

    endpointPath: {
        minWidth: 0,
        overflowWrap: "anywhere",
        fontFamily: "SFMono-Regular, Consolas, monospace",
        fontSize: "13px",
        color: "#374151",
    },

    emptyState: {
        padding: "60px 20px",
        border: "1px dashed #d1d5db",
        borderRadius: "10px",
        textAlign: "center",
        background: "#fafafa",
    },

    emptyIcon: {
        fontSize: "30px",
        color: "#9ca3af",
        marginBottom: "10px",
    },

    emptyTitle: {
        margin: 0,
        fontSize: "16px",
        color: "#374151",
    },

    emptyText: {
        margin: "6px 0 0",
        fontSize: "13px",
        color: "#9ca3af",
    },

    breadcrumbLabel: {
        fontWeight: 600,
        color: "#6b7280",
    },

    breadcrumbSeparator: {
        margin: "0 8px",
        color: "#9ca3af",
    },
};

export default LoadTestDataViewer;
