import React, { useState } from "react";
import { startLoadTestById, stopLoadTestById } from "../services/api";

export default function LoadTestConfigPage({
    loadTestDataId = "bd61fa13-07ee-462e-8839-7136a03699c9",
}) {
    const now = new Date();

    const threeMonthsAgo = new Date(now);
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    };
    const [formData, setFormData] = useState({
        targetRps: 100,
        concurrency: 10,
        durationSeconds: 60,
        minLatencyMs: 50,
        maxLatencyMs: 300,
        failureRatePercentage: 2.0,
        minRequestOccurredAtTime: formatDate(threeMonthsAgo),
        maxRequestOccurredAtTime: formatDate(now),
    });

    const [loading, setLoading] = useState(false);
    const [stopping, setStopping] = useState(false);
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: parseFloat(value) || 0,
        }));
    };

    const handleStart = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setResponse(null);

        try {
            const res = await startLoadTestById(loadTestDataId, {
                ...formData,
                minRequestOccurredAtTime: new Date(
                    formData.minRequestOccurredAtTime,
                ).toISOString(),
                maxRequestOccurredAtTime: new Date(
                    formData.maxRequestOccurredAtTime,
                ).toISOString(),
            });

            if (!res.ok) {
                throw new Error(
                    "Failed to start load test. Check parameters or server status.",
                );
            }

            const data = await res.json();
            setResponse(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleStop = async () => {
        const testIdToStop = response?.id || loadTestDataId;
        setStopping(true);
        setError(null);

        try {
            const res = await stopLoadTestById(testIdToStop);

            if (!res.ok) {
                throw new Error("Failed to stop load test.");
            }

            // Update status locally to reflect it has stopped
            setResponse((prev) =>
                prev ? { ...prev, status: "STOPPED" } : null,
            );
        } catch (err) {
            setError(err.message);
        } finally {
            setStopping(false);
        }
    };

    // Check if the test is currently running based on response status
    const isTestRunning = response && response.status === "RUNNING";

    return (
        <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
                Configure Load Test
            </h2>

            <form onSubmit={handleStart} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Target RPS
                        </label>
                        <input
                            type="number"
                            name="targetRps"
                            min="1"
                            value={formData.targetRps}
                            onChange={handleChange}
                            disabled={isTestRunning}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md disabled:bg-gray-100"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Concurrency
                        </label>
                        <input
                            type="number"
                            name="concurrency"
                            min="1"
                            value={formData.concurrency}
                            onChange={handleChange}
                            disabled={isTestRunning}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md disabled:bg-gray-100"
                            required
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Duration (Seconds)
                        </label>
                        <input
                            type="number"
                            name="durationSeconds"
                            min="1"
                            value={formData.durationSeconds}
                            onChange={handleChange}
                            disabled={isTestRunning}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md disabled:bg-gray-100"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Failure Rate (%)
                        </label>
                        <input
                            type="number"
                            name="failureRatePercentage"
                            min="0"
                            max="100"
                            step="0.1"
                            value={formData.failureRatePercentage}
                            onChange={handleChange}
                            disabled={isTestRunning}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md disabled:bg-gray-100"
                            required
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Min Latency (ms)
                        </label>
                        <input
                            type="number"
                            name="minLatencyMs"
                            min="0"
                            value={formData.minLatencyMs}
                            onChange={handleChange}
                            disabled={isTestRunning}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md disabled:bg-gray-100"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Max Latency (ms)
                        </label>
                        <input
                            type="number"
                            name="maxLatencyMs"
                            min="0"
                            value={formData.maxLatencyMs}
                            onChange={handleChange}
                            disabled={isTestRunning}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md disabled:bg-gray-100"
                            required
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Min Request Date (ms)
                        </label>
                        <input
                            type="date"
                            name="minRequestOccurredAtTime"
                            value={formData.minRequestOccurredAtTime}
                            onChange={handleChange}
                            disabled={isTestRunning}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md disabled:bg-gray-100"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Max Request Date
                        </label>
                        <input
                            type="date"
                            name="maxRequestOccurredAtTime"
                            value={formData.maxRequestOccurredAtTime}
                            onChange={handleChange}
                            disabled={isTestRunning}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md disabled:bg-gray-100"
                            required
                        />
                    </div>
                </div>

                {/* Conditional Action Buttons */}
                {!isTestRunning ? (
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
                    >
                        {loading ? "Starting Load Test..." : "Start Load Test"}
                    </button>
                ) : (
                    <button
                        type="button"
                        onClick={handleStop}
                        disabled={stopping}
                        className="w-full bg-red-600 text-white p-2 rounded-md hover:bg-red-700 disabled:bg-gray-400"
                    >
                        {stopping ? "Stopping Test..." : "Stop Load Test"}
                    </button>
                )}
            </form>

            {error && (
                <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
                    {error}
                </div>
            )}

            {response && (
                <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-md">
                    <h3 className="font-semibold text-gray-800">
                        Test Status Information
                    </h3>
                    <p className="text-sm text-gray-600">
                        Status:{" "}
                        <span
                            className={`font-bold ${response.status === "RUNNING" ? "text-blue-600" : "text-gray-700"}`}
                        >
                            {response.status}
                        </span>
                    </p>
                    {response.startedAt && (
                        <p className="text-sm text-gray-600">
                            Started At:{" "}
                            {new Date(response.startedAt).toLocaleTimeString()}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}
