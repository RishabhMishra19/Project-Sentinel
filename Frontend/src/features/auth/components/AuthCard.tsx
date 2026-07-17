import React from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface AuthCardProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

export default function AuthCard({ title, description, children }: AuthCardProps) {
  return (
    <Card className="rounded-3xl border border-white/40 bg-white/80 shadow-2xl backdrop-blur-xl">
      <CardHeader className="pb-3 text-center">
        <CardTitle className="text-3xl font-bold tracking-tight">{title}</CardTitle>
        <CardDescription className="mx-auto max-w-sm text-base leading-7 text-md">
          {description}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">{children}</CardContent>
    </Card>
  );
}
