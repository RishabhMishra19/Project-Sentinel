import { Section } from "../molecules/Section";

export const LoadRunConfig = ({ config }) => {
    if (!config) {
        return (
            <Section title="Load Configuration">
                <div style={styles.noData}>No run configuration available.</div>
            </Section>
        );
    }

    return (
        <Section title="Load Configuration">
            <div style={styles.configGrid}>
                <ConfigItem label="Target RPS" value={config.targetRps} />

                <ConfigItem label="Concurrency" value={config.concurrency} />

                <ConfigItem
                    label="Duration"
                    value={`${config.durationSeconds}s`}
                />

                <ConfigItem
                    label="Failure Rate"
                    value={`${config.failureRatePercentage}%`}
                />

                <ConfigItem
                    label="Min Latency"
                    value={`${config.minLatencyMs} ms`}
                />

                <ConfigItem
                    label="Max Latency"
                    value={`${config.maxLatencyMs} ms`}
                />
            </div>
        </Section>
    );
};

/* -------------------------------------------------- */
/* Config Item */
/* -------------------------------------------------- */

const ConfigItem = ({ label, value }) => {
    return (
        <div style={styles.configItem}>
            <div style={styles.configLabel}>{label}</div>

            <div style={styles.configValue}>{value ?? "—"}</div>
        </div>
    );
};

const styles = {
    noData: {
        padding: "20px",
        textAlign: "center",
        fontSize: "13px",
        color: "#9ca3af",
    },
    configGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
        gap: "1px",
        overflow: "hidden",
        border: "1px solid #e5e7eb",
        borderRadius: "8px",
        background: "#e5e7eb",
    },
    configItem: {
        padding: "13px",
        background: "#fff",
    },

    configLabel: {
        fontSize: "11px",
        color: "#9ca3af",
    },

    configValue: {
        marginTop: "4px",
        fontSize: "14px",
        fontWeight: 600,
        color: "#374151",
    },
};
