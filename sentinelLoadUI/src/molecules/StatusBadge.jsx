export const StatusBadge = ({ status, color }) => {
    const statusStyle = getStatusStyle(color);

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
            {status}
        </span>
    );
};

const getStatusStyle = (color) => {
    switch (color) {
        case "BLUE":
            return {
                background: "#dbeafe",
                color: "#1d4ed8",
            };

        case "GREEN":
            return {
                background: "#dcfce7",
                color: "#166534",
            };

        case "RED":
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

const styles = {
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
};
