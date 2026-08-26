import { useState } from "react";

export const Button = ({
    children,
    onClick,
    variant = "primary",
    disabled = false,
    type = "button",
    width,
}) => {
    const [hovered, setHovered] = useState(false);
    const [pressed, setPressed] = useState(false);

    const colors = getColors(variant);

    return (
        <button
            type={type}
            disabled={disabled}
            onClick={onClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => {
                setHovered(false);
                setPressed(false);
            }}
            onMouseDown={() => setPressed(true)}
            onMouseUp={() => setPressed(false)}
            style={{
                ...styles.button,
                width,
                background: disabled
                    ? "#e5e7eb"
                    : hovered
                      ? colors.hoverBackground
                      : colors.background,
                color: disabled ? "#9ca3af" : colors.color,
                border: `1px solid ${
                    disabled
                        ? "#e5e7eb"
                        : hovered
                          ? colors.hoverBorder
                          : colors.border
                }`,
                boxShadow:
                    disabled || !hovered
                        ? "none"
                        : "0 3px 8px rgba(0, 0, 0, 0.12)",
                transform: pressed
                    ? "translateY(1px)"
                    : hovered
                      ? "translateY(-1px)"
                      : "translateY(0)",
                cursor: disabled ? "not-allowed" : "pointer",
                opacity: disabled ? 0.7 : 1,
            }}
        >
            {children}
        </button>
    );
};

const getColors = (variant) => {
    switch (variant) {
        case "secondary":
            return {
                background: "#ffffff",
                hoverBackground: "#f9fafb",
                color: "#374151",
                border: "#d1d5db",
                hoverBorder: "#9ca3af",
            };

        case "danger":
            return {
                background: "#dc2626",
                hoverBackground: "#b91c1c",
                color: "#ffffff",
                border: "#dc2626",
                hoverBorder: "#b91c1c",
            };

        case "success":
            return {
                background: "#16a34a",
                hoverBackground: "#15803d",
                color: "#ffffff",
                border: "#16a34a",
                hoverBorder: "#15803d",
            };

        case "ghost":
            return {
                background: "transparent",
                hoverBackground: "#f3f4f6",
                color: "#374151",
                border: "transparent",
                hoverBorder: "#e5e7eb",
            };

        default:
            return {
                background: "#4f46e5",
                hoverBackground: "#4338ca",
                color: "#ffffff",
                border: "#4f46e5",
                hoverBorder: "#4338ca",
            };
    }
};

const styles = {
    button: {
        minWidth: "100px",
        height: "40px",
        padding: "0 16px",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "7px",
        boxSizing: "border-box",
        borderRadius: "8px",
        fontSize: "13px",
        fontWeight: 600,
        lineHeight: 1,
        outline: "none",
        transition:
            "background 0.15s ease, " +
            "border 0.15s ease, " +
            "box-shadow 0.15s ease, " +
            "transform 0.1s ease, " +
            "opacity 0.15s ease",
    },
};
