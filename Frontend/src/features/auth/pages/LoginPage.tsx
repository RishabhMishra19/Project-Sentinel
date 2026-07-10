import {Navigate} from "react-router-dom";

import AuthCard from "@/layouts/AuthCard";
import AuthLayout from "@/layouts/AuthLayout";

import Loader from "@/common/components/loader/Loader";
import {useAppSelector} from "@/common/hooks/useAppSelector";

import {ROUTES} from "@/app/router/routes";

import LoginForm from "../components/LoginForm";

export default function LoginPage() {

    const {

        isAuthenticated,

        isLoading,

    } = useAppSelector(state => state.auth);

    if (isLoading) {

        return <Loader/>;

    }

    if (isAuthenticated) {

        return (
            <Navigate
                to={ROUTES.DASHBOARD}
                replace
            />
        );

    }

    return (

        <AuthLayout>

            <AuthCard
                title="Welcome Back"
                description="Sign in to your Sentinel account."
            >

                <LoginForm/>

            </AuthCard>

        </AuthLayout>

    );

}