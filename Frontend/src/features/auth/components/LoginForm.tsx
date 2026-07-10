import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";

import {Input} from "@/common/components/ui/input";
import {Button} from "@/common/components/ui/button";
import {Label} from "@/common/components/ui/label";

import PasswordField from "@/common/components/forms/PasswordField";

import {type LoginFormData, loginSchema,} from "../validation/loginSchema";


import useLogin from "../hooks/useLogin";

export default function LoginForm() {

    const {

        register,

        handleSubmit,

        formState: {

            errors,

            isValid,

        },

    } = useForm<LoginFormData>({

        resolver: zodResolver(loginSchema),

        mode: "onChange",

        defaultValues: {

            email: "",

            password: "",

        },

    });

    const {

        mutate,

        isPending,

    } = useLogin();

    function onSubmit(data: LoginFormData) {

        mutate(data);

    }

    return (

        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
        >

            <div className="space-y-2">

                <Label htmlFor="email">

                    Email

                </Label>

                <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    {...register("email")}
                />

                {
                    errors.email && (

                        <p className="text-sm text-red-500">

                            {errors.email.message}

                        </p>

                    )
                }

            </div>

            <PasswordField
                id="password"
                label="Password"
                placeholder="Enter your password"
                registration={register("password")}
                error={errors.password?.message}
            />

            <Button
                type="submit"
                className="w-full"
                disabled={!isValid || isPending}
            >

                {
                    isPending
                        ? "Signing In..."
                        : "Sign In"
                }

            </Button>

        </form>

    );

}