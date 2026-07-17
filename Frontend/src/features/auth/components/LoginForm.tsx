import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";

import { type LoginFormData, loginSchema } from "../validation/loginSchema";

import useLogin from "../hooks/useLogin";
import FormField from "@/components/ui/FormField";
import PasswordField from "@/components/ui/PasswordField";

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutate, isPending } = useLogin();
  function onSubmit(data: LoginFormData) {
    mutate(data);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <FormField
        id="email"
        label="Email"
        type="email"
        placeholder="john@example.com"
        registration={register("email")}
        error={errors.email?.message}
      />

      <PasswordField
        id="password"
        label="Password"
        placeholder="Enter your password"
        registration={register("password")}
        error={errors.password?.message}
      />

      <Button
        type="submit"
        className="w-full h-12 rounded-xl bg-blue-600 font-semibold hover:bg-blue-700 cursor-pointer"
        disabled={!isValid || isPending}
      >
        {isPending ? "Signing In..." : "Sign In"}
      </Button>
    </form>
  );
}
