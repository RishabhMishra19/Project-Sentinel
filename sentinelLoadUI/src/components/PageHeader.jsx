import { useState } from "react";
import { Link } from "react-router-dom";
import { RouteManager } from "../services/RouteManager";
import { useTestDataList } from "../hooks/useTestDataList";
import GenerateDataForm from "../components/GenerateDataForm";
import Drawer from "../atoms/Drawer";
import { Stat } from "../atoms/Stat";

export const PageHeader = () => {
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const { loadDataList } = useTestDataList();

    const runningCount = (loadDataList ?? []).filter(
        (v) => v.status === "LOAD_RUNNING",
    ).length;

    const idleCount = (loadDataList ?? []).filter(
        (v) => v.status === "LOAD_IDLE",
    ).length;

    const deletedCount = (loadDataList ?? []).filter(
        (v) => v.status === "DATA_DELETED",
    ).length;

    return (
        <div
            style={{
                background: "#261cea",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "7px 30px",
            }}
        >
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    color: "white",
                }}
            >
                <Link
                    to={RouteManager.getLoadDataListPage()}
                    style={{
                        display: "block",
                        textDecoration: "none",
                        color: "inherit",
                        height: "auto",
                        background: "#1004e9",
                        padding: "10px 15px",
                        borderRadius: "10px",
                    }}
                >
                    <span>Load Engine</span>
                </Link>
                <span style={{ fontSize: "12px", marginLeft: "10px" }}>
                    Manage and run your load test configurations
                </span>
            </div>
            <div style={styles.headerRight}>
                <div style={styles.stats}>
                    <Stat value={(loadDataList ?? []).length} label="Total" />
                    <Stat value={runningCount} label="Running" />
                    <Stat value={idleCount} label="Idle" />
                    <Stat value={deletedCount} label="Deleted" />
                </div>

                <button
                    type="button"
                    onClick={() => setCreateModalOpen(true)}
                    style={styles.createButton}
                >
                    + New Load Test
                </button>
                <Drawer
                    open={createModalOpen}
                    onClose={() => setCreateModalOpen(false)}
                    title={"Test Data Generation"}
                >
                    <GenerateDataForm />
                </Drawer>
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

    createButton: {
        height: "42px",
        padding: "0 16px",
        border: "none",
        borderRadius: "8px",
        background: "#1004e9",
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
        minHeight: "105px",
        padding: "18px 52px 18px 18px",
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

    cardArrow: {
        position: "absolute",
        right: "18px",
        top: "50%",
        transform: "translateY(-50%)",
        fontSize: "25px",
        color: "#9ca3af",
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
};
