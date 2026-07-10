import {Navigate, useSearchParams} from "react-router-dom";

import AuthLayout from "@/layouts/AuthLayout";
import AuthCard from "@/layouts/AuthCard";

import SetPasswordForm from "../components/SetPasswordForm";

export default function SetPasswordPage() {

    const [searchParams] = useSearchParams();

    const invitationToken = searchParams.get("token");

    if (!invitationToken) {

        return <Navigate to="/login" replace/>;

    }

    return (

        <AuthLayout>

            <AuthCard
                title="Welcome to Sentinel"
                description="Create your account to continue."
            >

                <SetPasswordForm
                    invitationToken={invitationToken}
                />

            </AuthCard>

        </AuthLayout>

    );

}