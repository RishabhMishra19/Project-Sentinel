import * as React from "react";

import { Container } from "@/components/layout/Container";
import { Stack } from "@/components/layout/Stack";

export interface PageProps {
  children: React.ReactNode;
}

export function Page({ children }: PageProps) {
  return (
    <Container className="py-6">
      <Stack gap="lg">{children}</Stack>
    </Container>
  );
}
