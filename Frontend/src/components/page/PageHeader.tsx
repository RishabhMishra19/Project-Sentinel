import * as React from "react";

import { Inline } from "@/components/layout/Inline";
import { Stack } from "@/components/layout/Stack";

export interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <Inline justify="between" align="start">
      <Stack gap="xs">
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>

        {description && <p className="text-muted-foreground">{description}</p>}
      </Stack>

      {actions && <Inline gap="sm">{actions}</Inline>}
    </Inline>
  );
}
