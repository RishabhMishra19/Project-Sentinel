import {ReactNode} from "react";

import {Card, CardContent, CardDescription, CardHeader, CardTitle,} from "@/common/components/ui/card";

interface AuthCardProps {

    title: string;

    description: string;

    children: ReactNode;

}

export default function AuthCard({

                                     title,

                                     description,

                                     children,

                                 }: AuthCardProps) {

    return (

        <Card className="w-full max-w-md shadow-lg">

            <CardHeader className="space-y-2">

                <CardTitle className="text-2xl">

                    {title}

                </CardTitle>

                <CardDescription>

                    {description}

                </CardDescription>

            </CardHeader>

            <CardContent>

                {children}

            </CardContent>

        </Card>

    );

}