import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

import { Inline } from "@/components/layout/Inline";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface NavbarBreadcrumbProps {
  items: BreadcrumbItem[];
}

export function NavbarBreadcrumb({ items }: NavbarBreadcrumbProps) {
  return (
    <Inline gap="sm">
      {items.map((item, index) => (
        <Inline key={item.label} gap="sm">
          {item.href ? (
            <Link to={item.href} className="text-sm text-muted-foreground hover:text-foreground">
              {item.label}
            </Link>
          ) : (
            <span className="text-sm font-medium">{item.label}</span>
          )}

          {index < items.length - 1 && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
        </Inline>
      ))}
    </Inline>
  );
}
