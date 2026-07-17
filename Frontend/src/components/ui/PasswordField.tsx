import { useState } from "react";
import { Check, Eye, EyeOff, X } from "lucide-react";
import type { UseFormRegisterReturn } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const requirements = [
  {
    label: "At least 8 characters",
    valid: (value: string) => value.length >= 8,
  },
  {
    label: "One uppercase letter",
    valid: (value: string) => /[A-Z]/.test(value),
  },
  {
    label: "One lowercase letter",
    valid: (value: string) => /[a-z]/.test(value),
  },
  {
    label: "One number",
    valid: (value: string) => /\d/.test(value),
  },
  {
    label: "One special character",
    valid: (value: string) => /[^A-Za-z0-9]/.test(value),
  },
];

function Requirement({ valid, label }: { valid: boolean; label: string }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      {valid ? (
        <Check className="h-4 w-4 text-green-600" />
      ) : (
        <X className="h-4 w-4 text-red-500" />
      )}

      <span className={valid ? "text-green-700" : "text-slate-600"}>{label}</span>
    </div>
  );
}

interface PasswordFieldProps {
  id: string;
  label: string;
  registration: UseFormRegisterReturn;
  error?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  showRequirements?: boolean;
  password?: string;
}

export default function PasswordField({
  id,
  label,
  registration,
  error,
  placeholder = "Enter password",
  disabled = false,
  required = false,
  showRequirements = false,
  password = "",
}: PasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>
        {label}
        {required && <span className="ml-1 text-destructive">*</span>}
      </Label>

      <div className="relative">
        <Input
          id={id}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          disabled={disabled}
          aria-invalid={!!error}
          {...registration}
        />

        {showRequirements && password?.length ? (
          <div className="mt-3 space-y-2 rounded-md border bg-slate-50 p-4">
            {requirements.map((requirement) => (
              <Requirement
                key={requirement.label}
                valid={requirement.valid(password)}
                label={requirement.label}
              />
            ))}
          </div>
        ) : null}

        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
          onClick={() => setShowPassword((prev) => !prev)}
        >
          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </Button>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
