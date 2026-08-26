import { useState } from "react";
import { statusToColorMap } from "../constants/constants";
import { Button } from "../molecules/Button";
import { StatusBadge } from "../molecules/StatusBadge";
import { ApiManager } from "../services/ApiManager";
import { useLoadContext } from "../hooks/useLoadContext";
import { LoadRunFormDrawer } from "../drawers/LoadRunFormDrawer";

export const LoadTestDataHeader = ({ name, id, status }) => {
    const { setLoadTestData } = useLoadContext();
    const [isLoading, setIsLoading] = useState(false);
    const [isRunDrawerOpen, setIsRunDrawerOpen] = useState(false);

    const handleDelete = (e) => {
        e.preventDefault();
        if (
            !window.confirm(
                "Are you sure you want to delete this test and its related records?",
            )
        ) {
            return;
        }

        setIsLoading(true);
        ApiManager.deleteLoadTestById(id)
            .then(() => {
                ApiManager.getAllTestData().then(setLoadTestData);
            })
            .finally(() => setIsLoading(false));
    };

    const handleStart = (e) => {
        e.preventDefault();
        setIsRunDrawerOpen(true);
    };

    const handleStop = (e) => {
        e.preventDefault();
        if (!window.confirm("Are you sure you want to stop this load test?")) {
            return;
        }

        setIsLoading(true);
        ApiManager.stopLoadTestById(id)
            .then(() => {
                ApiManager.getAllTestData().then(setLoadTestData);
            })
            .finally(() => setIsLoading(false));
    };

    return (
        <div style={styles.header}>
            <div style={styles.headerInfo}>
                <div style={styles.titleRow}>
                    <h1 style={styles.title}>{name}</h1>
                    <StatusBadge
                        status={status}
                        color={statusToColorMap[status]}
                    />
                </div>
                <div style={styles.id}>{id}</div>
            </div>
            <div style={styles.headerActions}>
                {status !== "DATA_DELETED" && (
                    <Button
                        variant="danger"
                        onClick={handleDelete}
                        disabled={isLoading}
                    >
                        Delete Data
                    </Button>
                )}
                {status === "LOAD_IDLE" && (
                    <Button onClick={handleStart} disabled={isLoading}>
                        Start
                    </Button>
                )}
                {status === "LOAD_RUNNING" && (
                    <Button onClick={handleStop} disabled={isLoading}>
                        Stop
                    </Button>
                )}
            </div>
            <LoadRunFormDrawer
                open={isRunDrawerOpen}
                onClose={() => setIsRunDrawerOpen(false)}
                loadTestRunId={id}
            />
        </div>
    );
};

/* -------------------------------------------------- */
/* Status */
/* -------------------------------------------------- */

const styles = {
    header: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "20px",
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
        display: "flex",
        gap: "10px",
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
};
