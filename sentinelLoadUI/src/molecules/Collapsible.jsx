import { useState } from "react";

export const Collapsible = ({ title, children, defaultOpen = false }) => {
    const [open, setOpen] = useState(defaultOpen);

    return (
        <div style={styles.container}>
            <button
                type="button"
                onClick={() => setOpen((value) => !value)}
                style={styles.header}
            >
                {typeof title === "string" ? (
                    <span style={styles.title}>{title}</span>
                ) : (
                    <div style={{ flex: 1, paddingRight: "10px" }}>{title}</div>
                )}

                <span
                    style={{
                        ...styles.arrow,
                        transform: open ? "rotate(90deg)" : "rotate(0deg)",
                    }}
                >
                    ›
                </span>
            </button>

            <div
                style={{
                    ...styles.contentWrapper,
                    maxHeight: open ? "2000px" : "0",
                    opacity: open ? 1 : 0,
                }}
            >
                <div style={styles.content}>{children}</div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        border: "1px solid #e5e7eb",
        borderRadius: "10px",
        background: "#ffffff",
        overflow: "hidden",
    },

    header: {
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "5px 16px",
        border: "none",
        background: "#ffffff",
        color: "#374151",
        cursor: "pointer",
        textAlign: "left",
    },

    title: {
        fontSize: "14px",
        fontWeight: 600,
    },

    arrow: {
        fontSize: "22px",
        color: "#9ca3af",
        transition: "transform 0.2s ease",
    },

    contentWrapper: {
        overflow: "hidden",
        transition: "max-height 0.25s ease, opacity 0.2s ease",
    },

    content: {
        padding: "0 16px 16px",
        borderTop: "1px solid #f0f0f0",
    },
};
