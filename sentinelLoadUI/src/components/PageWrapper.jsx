import { Outlet } from "react-router-dom";
import { LoadEngineHeader } from "./LoadEngineHeader";

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
                <LoadEngineHeader />
            </div>
            <div style={{ paddingTop: "20px" }}>
                <Outlet />
            </div>
        </div>
    );
};
