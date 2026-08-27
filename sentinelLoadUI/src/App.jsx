import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LoadTestDataListPage } from "./pages/LoadTestDataListPage";
import { PageWrapper } from "./molecules/PageWrapper";
import { RouteManager } from "./services/RouteManager";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<PageWrapper />}>
                    <Route
                        index={true}
                        path={RouteManager.getLoadDataListPage()}
                        element={<LoadTestDataListPage />}
                    />
                    <Route
                        path="*"
                        element={
                            <Navigate
                                to={RouteManager.getLoadDataListPage()}
                                replace
                            />
                        }
                    />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
