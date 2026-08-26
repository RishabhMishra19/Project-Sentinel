import { Outlet } from "react-router-dom";
import { PageHeader } from "./PageHeader";
import { LoadTestDataProvider } from "../context/LoadContextProvider";

export const PageWrapper = () => {
    return (
        <LoadTestDataProvider>
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "80%",
                    marginInline: "auto",
                }}
            >
                <div
                    style={{
                        position: "sticky",
                        top: 0,
                        zIndex: 100,
                    }}
                >
                    <PageHeader />
                </div>
                <div style={{ paddingTop: "20px" }}>
                    <Outlet />
                </div>
            </div>
        </LoadTestDataProvider>
    );
};
