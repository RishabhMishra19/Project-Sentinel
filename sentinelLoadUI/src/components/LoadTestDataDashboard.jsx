import { SummaryCard } from "../molecules/SummaryBadge";
import { RunOverview } from "./RunOverview";
import { LoadRunConfig } from "./LoadRunConfig";
import { LoadTestEntities } from "./LoadTestEntities";

export const LoadTestDataDashboard = ({ data }) => {
    const {
        status,
        createdAt,
        startedAt,
        completedAt,
        deletedAt,
        config,
        associatedLoadTestData,
        failedRequests,
        totalRequests,
    } = data ?? {};

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
                <LoadRunConfig
                    config={config}
                    totalRequests={totalRequests}
                    failedRequests={failedRequests}
                />
            </div>

            {/* Load Test Entities */}
            <LoadTestEntities tenants={tenants} />
        </div>
    );
};

/* -------------------------------------------------- */
/* Styles */
/* -------------------------------------------------- */

const styles = {
    container: {
        width: "100%",
        color: "#111827",
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

    mainGrid: {
        display: "grid",
        gridTemplateColumns: "minmax(0, 1.1fr) minmax(0, 0.9fr)",
        gap: "16px",
        marginBottom: "16px",
    },
};
