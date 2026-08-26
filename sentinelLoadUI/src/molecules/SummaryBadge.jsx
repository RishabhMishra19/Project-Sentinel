export const SummaryCard = ({ label, value, icon }) => {
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

const styles = {
    summaryCard: {
        display: "flex",
        alignItems: "center",
        gap: "13px",
        padding: "10px 20px",
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
};
