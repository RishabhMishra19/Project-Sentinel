import AuthCard from "@/features/auth/components/AuthCard";
import LoginForm from "../components/LoginForm";

export default function LoginPage() {
  return (
    <AuthCard title="Welcome Back" description="Sign in to your Sentinel account.">
      <LoginForm />
    </AuthCard>
  );
}
