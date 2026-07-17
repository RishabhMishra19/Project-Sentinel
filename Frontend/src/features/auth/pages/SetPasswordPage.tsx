import { Navigate, useSearchParams } from "react-router-dom";
import AuthCard from "@/features/auth/components/AuthCard";
import SetPasswordForm from "../components/SetPasswordForm";

export default function SetPasswordPage() {
  const [searchParams] = useSearchParams();

  const invitationToken = searchParams.get("token");

  if (!invitationToken) {
    return <Navigate to="/login" replace />;
  }

  return (
    <AuthCard title="Welcome to Sentinel" description="Set your password to activate your account.">
      <SetPasswordForm invitationToken={invitationToken} />
    </AuthCard>
  );
}
