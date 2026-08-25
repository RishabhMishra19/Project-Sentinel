import React, { useState } from "react";
import {
    getLoadTestById,
    getRelatedEntities,
    deleteLoadTestOrData,
} from "../services/api";

export default function CleanupPage() {
    const [loadTestId, setLoadTestId] = useState("");
    const [loadTest, setLoadTest] = useState(null);
    const [entities, setEntities] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handlePreview = async (e) => {
        e.preventDefault();
        if (!loadTestId) return;
        setLoading(true);
        setMessage("");
        try {
            const [testData, entityData] = await Promise.all([
                getLoadTestById(loadTestId).catch(() => null),
                getRelatedEntities(loadTestId).catch(() => null),
            ]);
            setLoadTest(testData);
            setEntities(entityData);
        } catch (err) {
            setMessage(`Error: ${err.message}`);
            setLoadTest(null);
            setEntities(null);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (
            !window.confirm(
                "Are you sure you want to delete this test and its related records?",
            )
        )
            return;
        setLoading(true);
        try {
            const success = await deleteLoadTestOrData(loadTestId);
            if (success) {
                setMessage("Successfully deleted test and related entities.");
                setLoadTest(null);
                setEntities(null);
                setLoadTestId("");
            } else {
                setMessage("Deletion failed on the backend.");
            }
        } catch (err) {
            setMessage(`Error: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    // Helper to safely render lists of IdName objects
    const renderIdNameList = (title, items) => {
        if (!items || items.length === 0) return null;
        return (
            <div style={{ marginBottom: "15px" }}>
                <h4 style={{ margin: "10px 0 5px 0", color: "#333" }}>
                    {title} ({items.length})
                </h4>
                <ol
                    style={{
                        paddingLeft: "20px",
                        lineHeight: "1.5",
                        margin: 0,
                    }}
                >
                    {items.map((item, idx) => (
                        <li
                            key={item.id || idx}
                            style={{ marginBottom: "4px", color: "#2c3e50" }}
                        >
                            <span>{item.name}</span>
                        </li>
                    ))}
                </ol>
            </div>
        );
    };

    const analytics = entities?.analyticsCount;

    return (
        <div
            style={{
                padding: "20px",
                fontFamily: "sans-serif",
                maxWidth: "750px",
                margin: "0 auto",
            }}
        >
            <h2>Test Data & Load Test Cleanup</h2>
            <p
                style={{
                    color: "#666",
                    fontSize: "14px",
                    marginBottom: "20px",
                }}
            >
                Preview related entities before permanent deletion to ensure
                safe removal.
            </p>

            <form
                onSubmit={handlePreview}
                style={{ display: "flex", gap: "10px", marginBottom: "20px" }}
            >
                <input
                    type="text"
                    placeholder="Enter Load Test ID (UUID)"
                    value={loadTestId}
                    onChange={(e) => setLoadTestId(e.target.value)}
                    style={{
                        flex: 1,
                        padding: "10px",
                        fontSize: "14px",
                        borderRadius: "4px",
                        border: "1px solid #ccc",
                    }}
                />
                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        padding: "10px 20px",
                        background: "#dc3545",
                        color: "white",
                        border: "none",
                        cursor: "pointer",
                        borderRadius: "4px",
                        fontWeight: "bold",
                    }}
                >
                    {loading ? "Searching..." : "Preview Deletion"}
                </button>
            </form>

            {message && (
                <p
                    style={{
                        padding: "10px",
                        background: "#f8d7da",
                        color: "#721c24",
                        border: "1px solid #f5c6cb",
                        borderRadius: "4px",
                    }}
                >
                    {message}
                </p>
            )}

            {(loadTest || entities) && (
                <div
                    style={{
                        padding: "20px",
                        background: "#f8f9fa",
                        border: "1px solid #ddd",
                        borderRadius: "6px",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                    }}
                >
                    <h3
                        style={{
                            marginTop: 0,
                            borderBottom: "1px solid #ddd",
                            paddingBottom: "10px",
                        }}
                    >
                        Associated Entities Preview
                    </h3>

                    {/* Header Info */}
                    <div
                        style={{
                            background: "#e9ecef",
                            padding: "12px",
                            borderRadius: "4px",
                            marginBottom: "15px",
                            textAlign: "left",
                        }}
                    >
                        <p style={{ margin: "4px 0" }}>
                            <strong>Load Test Name:</strong>{" "}
                            {loadTest?.name || loadTest?.loadTestName || "N/A"}
                        </p>
                        <p style={{ margin: "4px 0" }}>
                            <strong>Test Data ID:</strong>{" "}
                            {loadTest?.testDataId ||
                                entities?.loadTestId ||
                                loadTestId}
                        </p>
                        <p style={{ margin: "4px 0" }}>
                            <strong>Status:</strong>{" "}
                            {loadTest?.status || loadTest?.testStatus || "N/A"}
                        </p>
                    </div>

                    {/* Render Entity Lists */}
                    <div
                        style={{
                            margin: "15px 0",
                            maxHeight: "350px",
                            overflowY: "auto",
                            textAlign: "left",
                        }}
                    >
                        {renderIdNameList("Tenants", entities?.tenants)}
                        {renderIdNameList("Products", entities?.products)}
                        {renderIdNameList("Services", entities?.services)}
                        {renderIdNameList("Endpoints", entities?.endpoints)}

                        {!entities?.tenants?.length &&
                            !entities?.products?.length &&
                            !entities?.services?.length &&
                            !entities?.endpoints?.length && (
                                <p
                                    style={{
                                        color: "#666",
                                        fontStyle: "italic",
                                    }}
                                >
                                    No related entities found for this load test
                                    ID.
                                </p>
                            )}
                    </div>

                    {/* Log Count and Detailed Analytics Count Breakdown */}
                    <div
                        style={{
                            marginTop: "20px",
                            borderTop: "1px solid #ddd",
                            paddingTop: "15px",
                            textAlign: "left",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                gap: "15px",
                                marginBottom: "15px",
                            }}
                        >
                            <div
                                style={{
                                    flex: 1,
                                    background: "#fff",
                                    padding: "10px",
                                    border: "1px solid #ccc",
                                    borderRadius: "4px",
                                    textAlign: "center",
                                }}
                            >
                                <strong>Request Log Count:</strong>{" "}
                                {entities?.requestLogCount ?? 0}
                            </div>
                        </div>

                        {analytics && (
                            <div
                                style={{
                                    background: "#fff",
                                    padding: "12px",
                                    border: "1px solid #ccc",
                                    borderRadius: "4px",
                                }}
                            >
                                <strong
                                    style={{
                                        display: "block",
                                        marginBottom: "8px",
                                    }}
                                >
                                    Analytics Counts Summary:
                                </strong>
                                <div
                                    style={{
                                        display: "grid",
                                        gridTemplateColumns: "1fr 1fr 1fr",
                                        gap: "8px",
                                        fontSize: "13px",
                                    }}
                                >
                                    <div>
                                        Tenant (D/H/M):{" "}
                                        {analytics.tenantDayAnalyticsCount} /{" "}
                                        {analytics.tenantHourAnalyticsCount} /{" "}
                                        {analytics.tenantMinuteAnalyticsCount}
                                    </div>
                                    <div>
                                        Product (D/H/M):{" "}
                                        {analytics.productDayAnalyticsCount} /{" "}
                                        {analytics.productHourAnalyticsCount} /{" "}
                                        {analytics.productMinuteAnalyticsCount}
                                    </div>
                                    <div>
                                        Service (D/H/M):{" "}
                                        {analytics.serviceDayAnalyticsCount} /{" "}
                                        {analytics.serviceHourAnalyticsCount} /{" "}
                                        {analytics.serviceMinuteAnalyticsCount}
                                    </div>
                                    <div style={{ gridColumn: "span 3" }}>
                                        Endpoint (D/H/M):{" "}
                                        {analytics.endpointDayAnalyticsCount} /{" "}
                                        {analytics.endpointHourAnalyticsCount} /{" "}
                                        {analytics.endpointMinuteAnalyticsCount}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={handleDelete}
                        disabled={loading}
                        style={{
                            width: "100%",
                            marginTop: "20px",
                            padding: "12px",
                            background: "#c82333",
                            color: "white",
                            border: "none",
                            cursor: "pointer",
                            fontWeight: "bold",
                            borderRadius: "4px",
                            fontSize: "15px",
                        }}
                    >
                        {loading ? "Deleting..." : "Confirm & Delete"}
                    </button>
                </div>
            )}
        </div>
    );
}
