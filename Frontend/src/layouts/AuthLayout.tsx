import {ReactNode} from "react";

interface AuthLayoutProps {
    children: ReactNode;
}

export default function AuthLayout({
                                       children,
                                   }: AuthLayoutProps) {

    return (

        <div className="flex min-h-screen items-center justify-center bg-slate-100 p-6">

            {children}

        </div>

    );

}