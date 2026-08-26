import { useState } from "react";
import { useLoadContext } from "../hooks/useLoadContext";
import { useLoadRunForm } from "../hooks/useLoadRunForm";
import { ApiManager } from "../services/ApiManager";

export const LoadRunForm = ({ loadTestRunId, onClose }) => {
    const { setLoadTestData } = useLoadContext();
    const [isLoading, setIsLoading] = useState(false);
    const { formData, errors, handleChange, validate, getRequest } =
        useLoadRunForm();

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!validate()) {
            return;
        }
        setIsLoading(true);
        ApiManager.startLoadTestById(loadTestRunId, getRequest())
            .then(() => {
                ApiManager.getAllTestData().then((data) => {
                    setLoadTestData(data);
                    onClose();
                });
            })
            .finally(() => setIsLoading(false));
    };

    return (
        <form onSubmit={handleSubmit}>
            <FormSection title="Load Configuration">
                <div style={styles.grid}>
                    <NumberInput
                        label="Target RPS"
                        name="targetRps"
                        value={formData.targetRps}
                        onChange={handleChange}
                        min={1}
                        error={errors.targetRps}
                    />

                    <NumberInput
                        label="Concurrency"
                        name="concurrency"
                        value={formData.concurrency}
                        onChange={handleChange}
                        min={1}
                        error={errors.concurrency}
                    />

                    <NumberInput
                        label="Duration"
                        name="durationSeconds"
                        value={formData.durationSeconds}
                        onChange={handleChange}
                        min={1}
                        suffix="seconds"
                        error={errors.durationSeconds}
                    />
                </div>
            </FormSection>

            <FormSection title="Request Characteristics">
                <div style={styles.grid}>
                    <NumberInput
                        label="Min Latency"
                        name="minLatencyMs"
                        value={formData.minLatencyMs}
                        onChange={handleChange}
                        min={0}
                        suffix="ms"
                        error={errors.minLatencyMs}
                    />

                    <NumberInput
                        label="Max Latency"
                        name="maxLatencyMs"
                        value={formData.maxLatencyMs}
                        onChange={handleChange}
                        min={0}
                        suffix="ms"
                        error={errors.maxLatencyMs}
                    />

                    <NumberInput
                        label="Failure Rate"
                        name="failureRatePercentage"
                        value={formData.failureRatePercentage}
                        onChange={handleChange}
                        min={0}
                        max={100}
                        step="0.1"
                        suffix="%"
                        error={errors.failureRatePercentage}
                    />
                </div>
            </FormSection>

            <FormSection title="Request Time Range">
                <div style={styles.grid}>
                    <DateInput
                        label="Min Request Date"
                        name="minRequestOccurredAtTime"
                        value={formData.minRequestOccurredAtTime}
                        onChange={handleChange}
                        error={errors.minRequestOccurredAtTime}
                    />

                    <DateInput
                        label="Max Request Date"
                        name="maxRequestOccurredAtTime"
                        value={formData.maxRequestOccurredAtTime}
                        onChange={handleChange}
                        error={errors.maxRequestOccurredAtTime}
                    />
                </div>

                <div style={styles.hint}>
                    Request timestamps will be generated within this range.
                </div>
            </FormSection>

            <div style={styles.actions}>
                <button
                    type="button"
                    onClick={onClose}
                    style={{
                        ...styles.button,
                        ...styles.cancelButton,
                    }}
                    disabled={isLoading}
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    style={{
                        ...styles.button,
                        ...styles.submitButton,
                    }}
                    disabled={isLoading}
                >
                    Start Load Test
                </button>
            </div>
        </form>
    );
};

/* -------------------------------------------------- */
/* Form Section */
/* -------------------------------------------------- */

const FormSection = ({ title, children }) => (
    <div style={styles.section}>
        <div style={styles.sectionTitle}>{title}</div>

        <div style={styles.sectionContent}>{children}</div>
    </div>
);

/* -------------------------------------------------- */
/* Number Input */
/* -------------------------------------------------- */

const NumberInput = ({
    label,
    name,
    value,
    onChange,
    min,
    max,
    step = 1,
    suffix,
    error,
}) => (
    <div style={styles.field}>
        <label style={styles.label}>{label}</label>

        <div style={styles.inputWrapper}>
            <input
                type="number"
                name={name}
                value={value}
                min={min}
                max={max}
                step={step}
                onChange={onChange}
                style={{
                    ...styles.input,
                    borderColor: error ? "#ef4444" : "#d1d5db",
                }}
            />

            {suffix && <span style={styles.suffix}>{suffix}</span>}
        </div>

        {error && <div style={styles.error}>{error}</div>}
    </div>
);

/* -------------------------------------------------- */
/* Date Input */
/* -------------------------------------------------- */

const DateInput = ({ label, name, value, onChange, error }) => (
    <div style={styles.field}>
        <label style={styles.label}>{label}</label>

        <input
            type="date"
            name={name}
            value={value}
            onChange={onChange}
            style={{
                ...styles.input,
                borderColor: error ? "#ef4444" : "#d1d5db",
            }}
        />

        {error && <div style={styles.error}>{error}</div>}
    </div>
);

/* -------------------------------------------------- */
/* Styles */
/* -------------------------------------------------- */

const styles = {
    section: {
        marginBottom: "24px",
    },

    sectionTitle: {
        marginBottom: "12px",
        fontSize: "13px",
        fontWeight: 700,
        color: "#374151",
    },

    sectionContent: {
        padding: "15px",
        border: "1px solid #e5e7eb",
        borderRadius: "9px",
        background: "#fafafa",
    },

    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
        gap: "15px",
    },

    field: {
        minWidth: 0,
    },

    label: {
        display: "block",
        marginBottom: "6px",
        fontSize: "12px",
        fontWeight: 600,
        color: "#4b5563",
    },

    inputWrapper: {
        position: "relative",
    },

    input: {
        width: "100%",
        height: "38px",
        padding: "0 11px",
        boxSizing: "border-box",
        border: "1px solid #d1d5db",
        borderRadius: "7px",
        outline: "none",
        background: "#ffffff",
        color: "#111827",
        fontSize: "13px",
    },

    suffix: {
        position: "absolute",
        right: "10px",
        top: "50%",
        transform: "translateY(-50%)",
        fontSize: "11px",
        color: "#9ca3af",
        pointerEvents: "none",
    },

    error: {
        marginTop: "4px",
        fontSize: "10px",
        color: "#dc2626",
    },

    hint: {
        marginTop: "10px",
        fontSize: "11px",
        color: "#9ca3af",
    },

    actions: {
        display: "flex",
        justifyContent: "flex-end",
        gap: "10px",
        paddingTop: "4px",
        borderTop: "1px solid #e5e7eb",
    },

    button: {
        height: "40px",
        padding: "0 16px",
        borderRadius: "7px",
        fontSize: "13px",
        fontWeight: 600,
        cursor: "pointer",
    },

    cancelButton: {
        border: "1px solid #d1d5db",
        background: "#ffffff",
        color: "#374151",
    },

    submitButton: {
        border: "1px solid #4f46e5",
        background: "#4f46e5",
        color: "#ffffff",
    },
};
