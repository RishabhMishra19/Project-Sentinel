import Drawer from "../molecules/Drawer";
import { Stat } from "../molecules/Stat";
import { useTestDataDelete } from "../hooks/useTestDataDelete";
import LoadTestDataDetails from "../components/LoadTestDataDetails";

export default function LoadTestDataDetailsDrawer({ open, onClose, data }) {
    const tenantCount = (data?.associatedLoadTestData?.tenantIds ?? []).length;
    const productCount = (data?.associatedLoadTestData?.productIds ?? [])
        .length;
    const serviceCount = (data?.associatedLoadTestData?.serviceIds ?? [])
        .length;
    const endpointCount = Object.values(
        data?.associatedLoadTestData?.serviceIdToEndpointInfoMap ?? {},
    ).reduce((total, cur) => total + cur.length, 0);

    return (
        <Drawer
            title={
                <Header
                    id={data?.id}
                    name={data?.name}
                    status={data?.status}
                    closeModal={onClose}
                    tenantCount={tenantCount}
                    productCount={productCount}
                    serviceCount={serviceCount}
                    endpointCount={endpointCount}
                />
            }
            open={open}
            onClose={onClose}
            width="800px"
        >
            <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-lg">
                <LoadTestDataDetails data={data} />
            </div>
        </Drawer>
    );
}

const Header = ({
    id,
    name,
    status,
    closeModal,
    tenantCount,
    productCount,
    serviceCount,
    endpointCount,
}) => {
    const { result, handleDelete } = useTestDataDelete(id, closeModal);

    return (
        <div style={styles.header}>
            <h2 style={styles.title}>{name}</h2>
            {status !== "DATA_DELETED" && (
                <button onClick={handleDelete} disabled={result.isLoading}>
                    delete data
                </button>
            )}
            <div style={styles.stats}>
                <Stat value={tenantCount} label="Tenants" />
                <Stat value={productCount} label="Products" />
                <Stat value={serviceCount} label="Services" />
                <Stat value={endpointCount} label="Endpoints" />
            </div>
        </div>
    );
};

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
