import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import TestDataPage from "./pages/TestDataPage";
import CleanupPage from "./pages/CleanupPage";

// Placeholder pages for next steps
const LoadTestConfigPage = () => (
    <div style={{ padding: "20px" }}>
        <h2>Load Test Config (Coming Next)</h2>
    </div>
);
const LiveDashboardPage = () => (
    <div style={{ padding: "20px" }}>
        <h2>Live Dashboard (Coming Next)</h2>
    </div>
);

export default function App() {
    return (
        <BrowserRouter>
            <div style={{ fontFamily: "sans-serif" }}>
                {/* Simple Navigation Bar */}
                <nav
                    style={{
                        display: "flex",
                        gap: "20px",
                        padding: "15px 20px",
                        background: "#343a40",
                        color: "white",
                    }}
                >
                    <Link
                        to="/"
                        style={{ color: "white", textDecoration: "none" }}
                    >
                        Test Data Generation
                    </Link>
                    <Link
                        to="/cleanup"
                        style={{ color: "white", textDecoration: "none" }}
                    >
                        Cleanup & Preview
                    </Link>
                    <Link
                        to="/load-test"
                        style={{ color: "white", textDecoration: "none" }}
                    >
                        Configure Load Test
                    </Link>
                    <Link
                        to="/dashboard"
                        style={{ color: "white", textDecoration: "none" }}
                    >
                        Live Dashboard
                    </Link>
                </nav>

                {/* Route Definitions */}
                <Routes>
                    <Route path="/" element={<TestDataPage />} />
                    <Route path="/cleanup" element={<CleanupPage />} />
                    <Route path="/load-test" element={<LoadTestConfigPage />} />
                    <Route path="/dashboard" element={<LiveDashboardPage />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}
