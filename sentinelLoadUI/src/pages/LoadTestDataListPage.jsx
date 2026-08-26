import { useEffect, useMemo, useState } from "react";
import LoadTestDataDashboardDrawer from "../drawers/LoadTestDataDashboardDrawer";
import { StatusBadge } from "../molecules/StatusBadge";
import { statusToColorMap } from "../constants/constants";
import { useLoadContext } from "../hooks/useLoadContext";
import { ApiManager } from "../services/ApiManager";

export const LoadTestDataListPage = () => {
    const {
        setLoadTestData,
        loadTests,
        isLoading,
        setSelectedLoadTestId,
        selectedLoadTestId,
    } = useLoadContext();

    useEffect(() => {
        ApiManager.getAllTestData().then((data) => {
            setLoadTestData(data);
        });
    }, []);

    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("ALL");

    const filteredloadDataList = useMemo(() => {
        const query = search.trim().toLowerCase();

        return loadTests.filter((item) => {
            const matchesSearch =
                !query ||
                item.name?.toLowerCase().includes(query) ||
                item.id?.toLowerCase().includes(query);

            const matchesStatus = status === "ALL" || item?.status === status;

            return matchesSearch && matchesStatus;
        });
    }, [loadTests, search, status]);

    return (
        <div style={styles.container}>
            <Toolbar
                search={search}
                setSearch={setSearch}
                status={status}
                setStatus={setStatus}
            />
            <LoadTestDataDashboardDrawer
                loadTestDataId={selectedLoadTestId}
                open={!!selectedLoadTestId}
                onClose={() => setSelectedLoadTestId(null)}
            />

            {isLoading ? (
                <span>loading...</span>
            ) : filteredloadDataList.length === 0 ? (
                <EmptyState search={search} />
            ) : (
                <div style={styles.list}>
                    {filteredloadDataList.map((item) => (
                        <LoadTestCard
                            key={item.id}
                            item={item}
                            onClick={() => setSelectedLoadTestId(item.id)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

/* ---------------- Toolbar ---------------- */

const Toolbar = ({ search, setSearch, status, setStatus }) => (
    <div style={styles.toolbar}>
        <div style={styles.searchWrapper}>
            <span style={styles.searchIcon}>⌕</span>

            <input
                type="text"
                placeholder="Search load tests..."
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

        <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            style={styles.statusSelect}
        >
            <option value="ALL">All statuses</option>

            <option value="LOAD_RUNNING">Running</option>

            <option value="LOAD_IDLE">Idle</option>

            <option value="DATA_DELETED">Deleted</option>
        </select>
    </div>
);

/* ---------------- Load Test Card ---------------- */

const LoadTestCard = ({ item, onClick }) => {
    const tenantCount = item?.associatedLoadTestData?.tenants?.length || 0;

    const productCount = item?.associatedLoadTestData?.productIds?.length || 0;

    const serviceCount = item?.associatedLoadTestData
        ?.serviceIdToEndpointInfoMap
        ? Object.keys(item.associatedLoadTestData.serviceIdToEndpointInfoMap)
              .length
        : 0;

    const endpointCount = item?.associatedLoadTestData
        ?.serviceIdToEndpointInfoMap
        ? Object.values(
              item.associatedLoadTestData.serviceIdToEndpointInfoMap,
          ).reduce((total, endpoints) => total + endpoints.length, 0)
        : 0;

    return (
        <div style={styles.card} onClick={onClick}>
            <div style={styles.cardMain}>
                <div style={styles.cardIcon}>⚡</div>

                <div style={styles.cardInfo}>
                    <div style={styles.cardTitleRow}>
                        <h3 style={styles.cardTitle}>{item.name}</h3>

                        <StatusBadge
                            status={item.status}
                            color={statusToColorMap[item.status]}
                        />
                    </div>

                    <div style={styles.cardId}>{item.id}</div>

                    <div style={styles.cardDate}>
                        Created {formatDate(item.createdAt)}
                    </div>
                </div>
            </div>

            <div style={styles.cardStats}>
                <MiniStat value={tenantCount} label="Tenants" />

                <MiniStat value={productCount} label="Products" />

                <MiniStat value={serviceCount} label="Services" />

                <MiniStat value={endpointCount} label="Endpoints" />
            </div>

            <div style={styles.summaryArrow}>→</div>
        </div>
    );
};

/* ---------------- Mini Stat ---------------- */

const MiniStat = ({ value, label }) => (
    <div style={styles.miniStat}>
        <strong style={styles.miniStatValue}>{value}</strong>

        <span style={styles.miniStatLabel}>{label}</span>
    </div>
);

/* ---------------- Empty State ---------------- */

const EmptyState = ({ search }) => (
    <div style={styles.emptyState}>
        <div style={styles.emptyIcon}>⚡</div>

        <h3 style={styles.emptyTitle}>
            {search ? "No load tests found" : "No load tests yet"}
        </h3>

        <p style={styles.emptyText}>
            {search
                ? "Try a different search term."
                : "Create your first load test to get started."}
        </p>
    </div>
);

/* ---------------- Date ---------------- */

const formatDate = (value) => {
    if (!value) {
        return "—";
    }

    return new Date(value).toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
    });
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
    },

    headerRight: {
        display: "flex",
        alignItems: "center",
        gap: "14px",
    },

    title: {
        margin: 0,
        fontSize: "22px",
        fontWeight: 700,
    },

    subtitle: {
        margin: "5px 0 0",
        fontSize: "14px",
        color: "#6b7280",
    },

    stats: {
        display: "flex",
        gap: "8px",
    },

    stat: {
        minWidth: "70px",
        padding: "9px 13px",
        border: "1px solid #e5e7eb",
        borderRadius: "9px",
        background: "#fff",
        textAlign: "center",
    },

    statValue: {
        fontSize: "18px",
        fontWeight: 700,
    },

    statLabel: {
        marginTop: "2px",
        fontSize: "11px",
        color: "#6b7280",
    },

    createButton: {
        height: "42px",
        padding: "0 16px",
        border: "none",
        borderRadius: "8px",
        background: "#4f46e5",
        color: "#fff",
        fontSize: "13px",
        fontWeight: 600,
        cursor: "pointer",
    },

    toolbar: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "14px",
        marginBottom: "16px",
    },

    searchWrapper: {
        position: "relative",
        width: "100%",
        maxWidth: "520px",
    },

    searchIcon: {
        position: "absolute",
        left: "13px",
        top: "50%",
        transform: "translateY(-50%)",
        color: "#9ca3af",
        fontSize: "20px",
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
        fontSize: "20px",
        cursor: "pointer",
    },

    statusSelect: {
        height: "42px",
        padding: "0 12px",
        border: "1px solid #d1d5db",
        borderRadius: "8px",
        background: "#fff",
        color: "#374151",
        fontSize: "13px",
        outline: "none",
        cursor: "pointer",
    },

    list: {
        display: "flex",
        flexDirection: "column",
        gap: "10px",
    },

    card: {
        position: "relative",
        width: "100%",
        minHeight: "80px",
        padding: "0px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "20px",
        boxSizing: "border-box",
        border: "1px solid #e5e7eb",
        borderRadius: "11px",
        background: "#fff",
        textAlign: "left",
        cursor: "pointer",
    },

    cardMain: {
        display: "flex",
        alignItems: "center",
        gap: "14px",
        minWidth: 0,
        flex: 1,
    },

    cardIcon: {
        width: "42px",
        height: "42px",
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "9px",
        background: "#eef2ff",
        color: "#4f46e5",
        fontSize: "19px",
    },

    cardInfo: {
        minWidth: 0,
    },

    cardTitleRow: {
        display: "flex",
        alignItems: "center",
        gap: "9px",
        flexWrap: "wrap",
    },

    cardTitle: {
        margin: 0,
        fontSize: "15px",
        fontWeight: 600,
        color: "#111827",
    },

    cardId: {
        marginTop: "4px",
        fontFamily: "monospace",
        fontSize: "11px",
        color: "#9ca3af",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
    },

    cardDate: {
        marginTop: "5px",
        fontSize: "11px",
        color: "#6b7280",
    },

    cardStats: {
        display: "flex",
        alignItems: "center",
        gap: "18px",
        flexShrink: 0,
    },

    miniStat: {
        minWidth: "55px",
        textAlign: "center",
    },

    miniStatValue: {
        display: "block",
        fontSize: "15px",
        color: "#374151",
    },

    miniStatLabel: {
        display: "block",
        marginTop: "2px",
        fontSize: "10px",
        color: "#9ca3af",
    },

    statusBadge: {
        padding: "4px 8px",
        borderRadius: "5px",
        fontSize: "10px",
        fontWeight: 700,
        letterSpacing: "0.3px",
    },

    emptyState: {
        padding: "65px 20px",
        border: "1px dashed #d1d5db",
        borderRadius: "11px",
        textAlign: "center",
        background: "#fafafa",
    },

    emptyIcon: {
        marginBottom: "10px",
        fontSize: "28px",
        color: "#9ca3af",
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
    summaryArrow: {
        flexShrink: 0,
        marginLeft: "16px",
        fontSize: "22px",
        fontWeight: 400,
        color: "#9ca3af",
    },
};
