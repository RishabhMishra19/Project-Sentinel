import { Outlet } from "react-router-dom";
import { PageHeader } from "./PageHeader";

export const PageWrapper = () => {
    return (
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
    );
};
