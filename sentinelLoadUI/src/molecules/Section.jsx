export const Section = ({ title, children }) => {
    return (
        <section style={styles.card}>
            <div style={styles.cardHeader}>
                <h2 style={styles.cardTitle}>{title}</h2>
            </div>

            <div style={styles.cardContent}>{children}</div>
        </section>
    );
};

const styles = {
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
};
