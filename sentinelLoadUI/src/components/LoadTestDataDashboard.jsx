export const LoadTestDataDashboard = ({ data }) => {
    if (!data) {
        return <EmptyState />;
    }

    const {
        name,
        id,
        status,
        createdAt,
        startedAt,
        completedAt,
        deletedAt,
        config,
        associatedLoadTestData,
    } = data;

    const tenants = associatedLoadTestData?.tenants || [];

    const productCount = associatedLoadTestData?.productIds?.length || 0;

    const serviceCount = Object.keys(
        associatedLoadTestData?.serviceIdToEndpointInfoMap || {},
    ).length;

    const endpointCount = Object.values(
        associatedLoadTestData?.serviceIdToEndpointInfoMap || {},
    ).reduce((total, endpoints) => total + endpoints.length, 0);

    const tenantCount =
        associatedLoadTestData?.tenantIds?.length || tenants.length;

    return (
        <div style={styles.container}>
            {/* Header */}

            <DashboardHeader name={name} id={id} status={status} />

            {/* Summary */}

            <div style={styles.summaryGrid}>
                <SummaryCard label="Tenants" value={tenantCount} icon="◉" />

                <SummaryCard label="Products" value={productCount} icon="◆" />

                <SummaryCard label="Services" value={serviceCount} icon="▣" />

                <SummaryCard label="Endpoints" value={endpointCount} icon="↗" />
            </div>

            {/* Main Grid */}

            <div style={styles.mainGrid}>
                <RunOverview
                    status={status}
                    createdAt={createdAt}
                    startedAt={startedAt}
                    completedAt={completedAt}
                    deletedAt={deletedAt}
                />

                <LoadConfiguration config={config} />
            </div>

            {/* Test Scope */}

            <TestScope tenants={tenants} />
        </div>
    );
};

/* -------------------------------------------------- */
/* Header */
/* -------------------------------------------------- */

const DashboardHeader = ({ name, id, status }) => {
    return (
        <div style={styles.header}>
            <div style={styles.headerInfo}>
                <div style={styles.titleRow}>
                    <h1 style={styles.title}>{name}</h1>

                    <StatusBadge status={status} />
                </div>

                <div style={styles.id}>{id}</div>
            </div>

            <div style={styles.headerActions}>
                <button style={styles.secondaryButton}>Run Again</button>
            </div>
        </div>
    );
};

/* -------------------------------------------------- */
/* Status */
/* -------------------------------------------------- */

const StatusBadge = ({ status }) => {
    const statusStyle = getStatusStyle(status);

    return (
        <span
            style={{
                ...styles.statusBadge,
                background: statusStyle.background,
                color: statusStyle.color,
            }}
        >
            <span
                style={{
                    ...styles.statusDot,
                    background: statusStyle.color,
                }}
            />

            {status || "NOT RUN"}
        </span>
    );
};

const getStatusStyle = (status) => {
    switch (status) {
        case "RUNNING":
            return {
                background: "#dbeafe",
                color: "#1d4ed8",
            };

        case "COMPLETED":
            return {
                background: "#dcfce7",
                color: "#166534",
            };

        case "FAILED":
            return {
                background: "#fee2e2",
                color: "#b91c1c",
            };

        default:
            return {
                background: "#f3f4f6",
                color: "#6b7280",
            };
    }
};

/* -------------------------------------------------- */
/* Summary Card */
/* -------------------------------------------------- */

const SummaryCard = ({ label, value, icon }) => {
    return (
        <div style={styles.summaryCard}>
            <div style={styles.summaryIcon}>{icon}</div>

            <div>
                <div style={styles.summaryValue}>{value}</div>

                <div style={styles.summaryLabel}>{label}</div>
            </div>
        </div>
    );
};

/* -------------------------------------------------- */
/* Run Overview */
/* -------------------------------------------------- */

const RunOverview = ({
    status,
    createdAt,
    startedAt,
    completedAt,
    deletedAt,
}) => {
    return (
        <DashboardCard title="Run Overview">
            <div style={styles.timeline}>
                <TimelineItem label="Created" value={createdAt} />

                <TimelineItem label="Started" value={startedAt} />

                <TimelineItem label="Completed" value={completedAt} />

                <TimelineItem label="Deleted" value={deletedAt} last />
            </div>

            <div style={styles.runStatus}>
                <span style={styles.detailLabel}>Current Status</span>

                <StatusBadge status={status} />
            </div>
        </DashboardCard>
    );
};

/* -------------------------------------------------- */
/* Timeline */
/* -------------------------------------------------- */

const TimelineItem = ({ label, value, last }) => {
    return (
        <div style={styles.timelineItem}>
            <div style={styles.timelineIndicator}>
                <div style={styles.timelineDot} />

                {!last && <div style={styles.timelineLine} />}
            </div>

            <div>
                <div style={styles.timelineLabel}>{label}</div>

                <div style={styles.timelineValue}>{formatDate(value)}</div>
            </div>
        </div>
    );
};

/* -------------------------------------------------- */
/* Load Configuration */
/* -------------------------------------------------- */

const LoadConfiguration = ({ config }) => {
    if (!config) {
        return (
            <DashboardCard title="Load Configuration">
                <div style={styles.noData}>No run configuration available.</div>
            </DashboardCard>
        );
    }

    return (
        <DashboardCard title="Load Configuration">
            <div style={styles.configGrid}>
                <ConfigItem label="Target RPS" value={config.targetRps} />

                <ConfigItem label="Concurrency" value={config.concurrency} />

                <ConfigItem
                    label="Duration"
                    value={`${config.durationSeconds}s`}
                />

                <ConfigItem
                    label="Failure Rate"
                    value={`${config.failureRatePercentage}%`}
                />

                <ConfigItem
                    label="Min Latency"
                    value={`${config.minLatencyMs} ms`}
                />

                <ConfigItem
                    label="Max Latency"
                    value={`${config.maxLatencyMs} ms`}
                />
            </div>
        </DashboardCard>
    );
};

/* -------------------------------------------------- */
/* Config Item */
/* -------------------------------------------------- */

const ConfigItem = ({ label, value }) => {
    return (
        <div style={styles.configItem}>
            <div style={styles.configLabel}>{label}</div>

            <div style={styles.configValue}>{value ?? "—"}</div>
        </div>
    );
};

/* -------------------------------------------------- */
/* Test Scope */
/* -------------------------------------------------- */

const TestScope = ({ tenants }) => {
    return (
        <DashboardCard title="Test Scope">
            {tenants.length === 0 ? (
                <div style={styles.noData}>
                    No tenant information available.
                </div>
            ) : (
                <div style={styles.tenantList}>
                    {tenants.map((tenant) => (
                        <Tenant key={tenant.tenantId} tenant={tenant} />
                    ))}
                </div>
            )}
        </DashboardCard>
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

/* -------------------------------------------------- */
/* Dashboard Card */
/* -------------------------------------------------- */

const DashboardCard = ({ title, children }) => {
    return (
        <section style={styles.card}>
            <div style={styles.cardHeader}>
                <h2 style={styles.cardTitle}>{title}</h2>
            </div>

            <div style={styles.cardContent}>{children}</div>
        </section>
    );
};

/* -------------------------------------------------- */
/* Empty */
/* -------------------------------------------------- */

const EmptyState = () => {
    return (
        <div style={styles.empty}>
            <div style={styles.emptyTitle}>No load test selected</div>

            <div style={styles.emptyText}>
                Select a load test to view its dashboard.
            </div>
        </div>
    );
};

/* -------------------------------------------------- */
/* Helpers */
/* -------------------------------------------------- */

const formatDate = (value) => {
    if (!value) {
        return "Not available";
    }

    return new Date(value).toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
    });
};

/* -------------------------------------------------- */
/* Styles */
/* -------------------------------------------------- */

const styles = {
    container: {
        width: "100%",
        color: "#111827",
    },

    header: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "20px",
        marginBottom: "24px",
    },

    headerInfo: {
        minWidth: 0,
    },

    titleRow: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
        flexWrap: "wrap",
    },

    title: {
        margin: 0,
        fontSize: "24px",
        fontWeight: 700,
    },

    id: {
        marginTop: "6px",
        fontFamily: "monospace",
        fontSize: "11px",
        color: "#9ca3af",
    },

    headerActions: {
        flexShrink: 0,
    },

    secondaryButton: {
        height: "40px",
        padding: "0 15px",
        border: "1px solid #d1d5db",
        borderRadius: "8px",
        background: "#fff",
        color: "#374151",
        fontSize: "13px",
        fontWeight: 600,
        cursor: "pointer",
    },

    statusBadge: {
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        padding: "5px 9px",
        borderRadius: "6px",
        fontSize: "10px",
        fontWeight: 700,
        letterSpacing: "0.3px",
    },

    statusDot: {
        width: "6px",
        height: "6px",
        borderRadius: "50%",
    },

    summaryGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
        gap: "12px",
        marginBottom: "16px",
    },

    summaryCard: {
        display: "flex",
        alignItems: "center",
        gap: "13px",
        padding: "16px",
        border: "1px solid #e5e7eb",
        borderRadius: "10px",
        background: "#fff",
    },

    summaryIcon: {
        width: "38px",
        height: "38px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "8px",
        background: "#eef2ff",
        color: "#4f46e5",
        fontSize: "16px",
    },

    summaryValue: {
        fontSize: "20px",
        fontWeight: 700,
    },

    summaryLabel: {
        marginTop: "2px",
        fontSize: "12px",
        color: "#6b7280",
    },

    mainGrid: {
        display: "grid",
        gridTemplateColumns: "minmax(0, 1.1fr) minmax(0, 0.9fr)",
        gap: "16px",
        marginBottom: "16px",
    },

    card: {
        overflow: "hidden",
        border: "1px solid #e5e7eb",
        borderRadius: "10px",
        background: "#fff",
        marginBottom: "16px",
    },

    cardHeader: {
        padding: "16px 18px",
        borderBottom: "1px solid #f0f0f0",
    },

    cardTitle: {
        margin: 0,
        fontSize: "15px",
        fontWeight: 600,
        color: "#374151",
    },

    cardContent: {
        padding: "18px",
    },

    timeline: {
        display: "flex",
        flexDirection: "column",
    },

    timelineItem: {
        display: "flex",
        gap: "12px",
        minHeight: "58px",
    },

    timelineIndicator: {
        position: "relative",
        width: "12px",
        flexShrink: 0,
    },

    timelineDot: {
        position: "absolute",
        top: "4px",
        left: "2px",
        width: "8px",
        height: "8px",
        borderRadius: "50%",
        background: "#6366f1",
    },

    timelineLine: {
        position: "absolute",
        top: "12px",
        left: "5px",
        width: "2px",
        height: "52px",
        background: "#e5e7eb",
    },

    timelineLabel: {
        fontSize: "12px",
        color: "#9ca3af",
    },

    timelineValue: {
        marginTop: "3px",
        fontSize: "13px",
        fontWeight: 500,
        color: "#374151",
    },

    runStatus: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: "8px",
        paddingTop: "15px",
        borderTop: "1px solid #f0f0f0",
    },

    detailLabel: {
        fontSize: "12px",
        color: "#6b7280",
    },

    configGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
        gap: "1px",
        overflow: "hidden",
        border: "1px solid #e5e7eb",
        borderRadius: "8px",
        background: "#e5e7eb",
    },

    configItem: {
        padding: "13px",
        background: "#fff",
    },

    configLabel: {
        fontSize: "11px",
        color: "#9ca3af",
    },

    configValue: {
        marginTop: "4px",
        fontSize: "14px",
        fontWeight: 600,
        color: "#374151",
    },

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

    noData: {
        padding: "20px",
        textAlign: "center",
        fontSize: "13px",
        color: "#9ca3af",
    },

    empty: {
        padding: "80px 20px",
        textAlign: "center",
    },

    emptyTitle: {
        fontSize: "18px",
        fontWeight: 600,
    },

    emptyText: {
        marginTop: "6px",
        fontSize: "13px",
        color: "#9ca3af",
    },
};
