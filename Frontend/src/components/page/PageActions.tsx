import * as React from "react";

import { Inline } from "@/components/layout/Inline";

export type PageActionsProps = React.HTMLAttributes<HTMLDivElement>;

export function PageActions({ className, children, ...props }: PageActionsProps) {
  return (
    <Inline gap="sm" justify="end" className={className} {...props}>
      {children}
    </Inline>
  );
}
