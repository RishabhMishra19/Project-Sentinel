import * as React from "react";

import { Surface } from "@/components/layout/Surface";
import { Stack } from "@/components/layout/Stack";

export interface PageSectionProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
}

export function PageSection({ title, description, children }: PageSectionProps) {
  return (
    <Surface className="p-6">
      <Stack gap="md">
        {(title || description) && (
          <Stack gap="xs">
            {title && <h2 className="text-lg font-semibold">{title}</h2>}

            {description && <p className="text-sm text-muted-foreground">{description}</p>}
          </Stack>
        )}

        {children}
      </Stack>
    </Surface>
  );
}
