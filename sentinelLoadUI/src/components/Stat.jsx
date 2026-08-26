export const Stat = ({ value, label }) => (
    <div style={styles.stat}>
        <div style={styles.statLabel}>{label}</div>
        <div style={styles.statValue}>{value}</div>
    </div>
);

const styles = {
    stat: {
        display: "flex",
        alignItems: "center",
        minWidth: "50px",
        padding: "2px 10px",
        border: "1px solid #e5e7eb",
        borderRadius: "9px",
        background: "#fff",
        textAlign: "center",
    },

    statValue: {
        marginLeft: "10px",
        fontSize: "18px",
        fontWeight: 700,
    },

    statLabel: {
        fontSize: "11px",
        color: "#6b7280",
    },
};
