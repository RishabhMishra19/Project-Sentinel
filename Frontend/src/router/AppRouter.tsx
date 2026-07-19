import { Navigate, Route, Routes } from "react-router-dom";

import { ROUTES } from "./routes";

import { AuthenticatedRoute } from "./AuthenticatedRoute";
import { UnauthenticatedRoute } from "./UnauthenticatedRoute";

import LoginPage from "@/features/auth/pages/LoginPage";
import SetPasswordPage from "@/features/auth/pages/SetPasswordPage";

import DashboardPage from "@/features/dashboard/pages/DashboardPage";
import AuthenticatedLayout from "@/layouts/AuthenticatedLayout";
import UnauthenticatedLayout from "@/layouts/UnauthenticatedLayout";
import ProfileDetailsPage from "@/features/profile/pages/ProfileDetailsPage";
import OrganizationsPage from "@/features/orgs/pages/OrganizationsPage";
import ProjectsPage from "@/features/projects/pages/ProjectsPage";
import EnvironmentsPage from "@/features/environments/pages/EnvironmentsPage";
import ApiKeysPage from "@/features/apiKeys/pages/ApiKeysPage";
import UsersPage from "@/features/users/pages/UsersPage";
import SettingsPage from "@/features/settings/pages/SettingsPage";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to={ROUTES.DASHBOARD} replace />} />

      <Route element={<UnauthenticatedRoute />}>
        <Route element={<UnauthenticatedLayout />}>
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          <Route path={ROUTES.SET_PASSWORD} element={<SetPasswordPage />} />
        </Route>
      </Route>

      <Route element={<AuthenticatedRoute />}>
        <Route element={<AuthenticatedLayout />}>
          <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
          <Route path={ROUTES.PROFILE} element={<ProfileDetailsPage />} />
          <Route path={ROUTES.ORGS} element={<OrganizationsPage />} />
          <Route path={ROUTES.PROJECTS} element={<ProjectsPage />} />
          <Route path={ROUTES.ENVS} element={<EnvironmentsPage />} />
          <Route path={ROUTES.API_KEYS} element={<ApiKeysPage />} />
          <Route path={ROUTES.USERS} element={<UsersPage />} />
          <Route path={ROUTES.PROFILE} element={<ProfileDetailsPage />} />
          <Route path={ROUTES.SETTINGS} element={<SettingsPage />} />
        </Route>
      </Route>
    </Routes>
  );
}
