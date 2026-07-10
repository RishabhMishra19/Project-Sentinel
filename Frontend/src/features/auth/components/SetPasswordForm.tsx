import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";

import {Button} from "@/common/components/ui/button";
import {Input} from "@/common/components/ui/input";
import {Label} from "@/common/components/ui/label";

import PasswordField from "@/common/components/forms/PasswordField";
import PasswordRequirements from "@/common/components/forms/PasswordRequirements";

import {type SetPasswordFormData, setPasswordSchema,} from "../validation/setPasswordSchema";

import useSetPassword from "../hooks/useSetPassword";

interface SetPasswordFormProps {

    invitationToken: string;

}

export default function SetPasswordForm({

                                            invitationToken,

                                        }: SetPasswordFormProps) {

    const {

        register,

        handleSubmit,

        watch,

        formState: {

            errors,

            isValid,

        },

    } = useForm<SetPasswordFormData>({

        resolver: zodResolver(setPasswordSchema),

        mode: "onChange",

        defaultValues: {

            name: "",

            password: "",

            confirmPassword: "",

        },

    });

    const password = watch("password");

    const {

        mutate,

        isPending,

    } = useSetPassword();

    function onSubmit(data: SetPasswordFormData) {

        mutate({

            invitationToken,

            name: data.name,

            password: data.password,

        });

    }

    return (

        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
        >

            <div className="space-y-2">

                <Label htmlFor="name">

                    Full Name

                </Label>

                <Input
                    id="name"
                    placeholder="John Doe"
                    {...register("name")}
                />

                {
                    errors.name && (

                        <p className="text-sm text-red-500">

                            {errors.name.message}

                        </p>

                    )
                }

            </div>

            <PasswordField
                id="password"
                label="Password"
                placeholder="Enter password"
                registration={register("password")}
                error={errors.password?.message}
            />

            <PasswordRequirements
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
                className="w-full"
                disabled={!isValid || isPending}
            >

                {
                    isPending
                        ? "Creating Account..."
                        : "Create Account"
                }

            </Button>

        </form>

    );

}