import {useState} from "react";
import type {UseFormRegisterReturn} from "react-hook-form";
import {Eye, EyeOff} from "lucide-react";

import {Input} from "@/common/components/ui/input.tsx";
import {Label} from "@/common/components/ui/label.tsx";

interface PasswordFieldProps {

    id: string;

    label: string;

    placeholder?: string;

    registration: UseFormRegisterReturn;

    error?: string;

}

export default function PasswordField({

                                          id,

                                          label,

                                          placeholder,

                                          registration,

                                          error,

                                      }: PasswordFieldProps) {

    const [showPassword, setShowPassword] = useState(false);

    return (

        <div className="space-y-2">

            <Label htmlFor={id}>

                {label}

            </Label>

            <div className="relative">

                <Input
                    id={id}
                    type={showPassword ? "text" : "password"}
                    placeholder={placeholder}
                    {...registration}
                />

                <button
                    type="button"
                    onClick={() => setShowPassword(previous => !previous)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                >

                    {
                        showPassword
                            ? <EyeOff className="h-4 w-4"/>
                            : <Eye className="h-4 w-4"/>
                    }

                </button>

            </div>

            {
                error && (

                    <p className="text-sm text-red-500">

                        {error}

                    </p>

                )
            }

        </div>

    );

}