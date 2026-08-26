import { useEffect } from "react";

const Drawer = ({ open, onClose, title, children, width = "500px" }) => {
    useEffect(() => {
        const handleEscape = (event) => {
            if (event.key === "Escape" && open) {
                onClose();
            }
        };

        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener("keydown", handleEscape);
        };
    }, [open, onClose]);

    const handleBackdropClick = (event) => {
        if (event.target === event.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            style={{
                ...styles.overlay,
                opacity: open ? 1 : 0,
                pointerEvents: open ? "auto" : "none",
            }}
            onMouseDown={handleBackdropClick}
        >
            <div
                style={{
                    ...styles.drawer,
                    width,
                    transform: open ? "translateX(0)" : "translateX(100%)",
                }}
                onMouseDown={(event) => event.stopPropagation()}
            >
                <div style={styles.header}>
                    <div style={{ flex: 1, paddingRight: "10px" }}>
                        {typeof title === "string" ? (
                            <h2 style={styles.title}>{title}</h2>
                        ) : (
                            <div>{title}</div>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        style={styles.closeButton}
                        aria-label="Close"
                    >
                        ×
                    </button>
                </div>

                <div style={styles.content}>{children}</div>
            </div>
        </div>
    );
};

const styles = {
    overlay: {
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        background: "rgba(17, 24, 39, 0.45)",
        transition: "opacity 0.2s ease",
    },

    drawer: {
        position: "absolute",
        top: 0,
        right: 0,
        height: "100%",
        maxWidth: "95vw",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        background: "#ffffff",
        boxShadow: "-8px 0 30px rgba(0, 0, 0, 0.15)",
        transition: "transform 0.25s ease",
    },

    header: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexShrink: 0,
        padding: "18px 22px",
        borderBottom: "1px solid #e5e7eb",
    },

    title: {
        margin: 0,
        fontSize: "18px",
        fontWeight: 600,
        color: "#111827",
    },

    closeButton: {
        width: "32px",
        height: "32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "none",
        borderRadius: "6px",
        background: "transparent",
        color: "#6b7280",
        fontSize: "25px",
        lineHeight: 1,
        cursor: "pointer",
    },

    content: {
        flex: 1,
        overflowY: "auto",
        padding: "22px",
    },
};

export default Drawer;
