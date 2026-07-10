import {Check, X} from "lucide-react";

interface PasswordRequirementsProps {
    password: string;
}

export default function PasswordRequirements({
                                                 password,
                                             }: PasswordRequirementsProps) {

    const requirements = [
        {
            label: "At least 8 characters",
            valid: password.length >= 8,
        },
        {
            label: "One uppercase letter",
            valid: /[A-Z]/.test(password),
        },
        {
            label: "One lowercase letter",
            valid: /[a-z]/.test(password),
        },
        {
            label: "One number",
            valid: /\d/.test(password),
        },
        {
            label: "One special character",
            valid: /[^A-Za-z0-9]/.test(password),
        },
    ];

    return (
        <div className="space-y-2 rounded-md border bg-slate-50 p-4">

            <p className="text-sm font-medium">
                Password Requirements
            </p>

            {requirements.map((requirement) => (

                <div
                    key={requirement.label}
                    className="flex items-center gap-2 text-sm"
                >

                    {requirement.valid ? (

                        <Check className="h-4 w-4 text-green-600"/>

                    ) : (

                        <X className="h-4 w-4 text-red-500"/>

                    )}

                    <span
                        className={
                            requirement.valid
                                ? "text-green-700"
                                : "text-slate-600"
                        }
                    >
                        {requirement.label}
                    </span>

                </div>

            ))}

        </div>
    );

}