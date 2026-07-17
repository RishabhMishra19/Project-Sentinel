import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";

import { type SetPasswordFormData, setPasswordSchema } from "../validation/setPasswordSchema";

import useSetPassword from "../hooks/useSetPassword";
import PasswordField from "@/components/ui/PasswordField";

interface SetPasswordFormProps {
  invitationToken: string;
}

export default function SetPasswordForm({ invitationToken }: SetPasswordFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = useForm<SetPasswordFormData>({
    resolver: zodResolver(setPasswordSchema),
    mode: "onChange",
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const password = useWatch({ control, name: "password" });

  const { mutate, isPending } = useSetPassword();

  const onSubmit = (data: SetPasswordFormData) => {
    mutate({ invitationToken, password: data.password });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <PasswordField
        id="password"
        label="Password"
        placeholder="Enter password"
        registration={register("password")}
        error={errors.password?.message}
        showRequirements={true}
        password={password}
      />

      <PasswordField
        id="confirmPassword"
        label="Confirm Password"
        placeholder="Confirm password"
        registration={register("confirmPassword")}
        error={errors.confirmPassword?.message}
      />

      <Button
        type="submit"
        className="w-full h-12 rounded-xl bg-blue-600 font-semibold hover:bg-blue-700 cursor-pointer"
        disabled={!isValid || isPending}
      >
        {isPending ? "Activating Account..." : "Activate Account"}
      </Button>
    </form>
  );
}
