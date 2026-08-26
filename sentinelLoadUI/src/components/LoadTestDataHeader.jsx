import { statusToColorMap } from "../constants/constants";
import { useTestDataDelete } from "../hooks/useTestDataDelete";
import { Button } from "../molecules/Button";
import { StatusBadge } from "../molecules/StatusBadge";

export const LoadTestDataHeader = ({ name, id, status }) => {
    const { handleDelete, result } = useTestDataDelete(id);

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
                        disabled={result.isLoading}
                    >
                        Delete Data
                    </Button>
                )}
                {status === "LOAD_IDLE" && <Button>Start</Button>}
                {status === "LOAD_RUNNING" && <Button>Stop</Button>}
            </div>
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
