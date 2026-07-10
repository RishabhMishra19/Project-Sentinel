import {Navigate, Route, Routes,} from "react-router-dom";

import {ROUTES} from "./routes";

import ProtectedRoute from "./ProtectedRoute";

import LoginPage from "@/features/auth/pages/LoginPage";
import SetPasswordPage from "@/features/auth/pages/SetPasswordPage";

import DashboardPage from "@/features/dashboard/pages/DashboardPage";
import AuthenticatedLayout from "@/layouts/AuthenticatedLayout"

export default function AppRouter() {

    return (
        <Routes>

            <Route
                path="/"
                element={
                    <Navigate
                        to={ROUTES.DASHBOARD}
                        replace
                    />
                }
            />

            <Route
                path={ROUTES.LOGIN}
                element={<LoginPage/>}
            />

            <Route
                path={ROUTES.SET_PASSWORD}
                element={<SetPasswordPage/>}
            />

            <Route element={<ProtectedRoute/>}>

                <Route element={<AuthenticatedLayout/>}>

                    <Route
                        path={ROUTES.DASHBOARD}
                        element={<DashboardPage/>}
                    />

                </Route>

            </Route>

        </Routes>

    );

}