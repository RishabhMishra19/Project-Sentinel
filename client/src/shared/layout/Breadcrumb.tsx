import { Link } from "react-router-dom";
import { ChevronRightIcon } from "../../assets/icons";
import type { Crumb } from "./pageHeader";

type BreadcrumbProps = {
  items: Crumb[];
};

export const Breadcrumb = ({ items }: BreadcrumbProps) => {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm">
        {items.map((item, index) => {
          const isFirst = index === 0;
          const isLast = index === items.length - 1;

          return (
            <li key={`${item.label}-${index}`} className="inline-flex items-center gap-1.5">
              {item.to && !isLast ? (
                <Link
                  to={item.to}
                  className={
                    isFirst
                      ? "font-semibold text-foreground hover:opacity-80"
                      : "text-muted hover:text-foreground"
                  }
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={
                    isFirst
                      ? "font-semibold text-foreground"
                      : isLast
                        ? "font-medium text-foreground"
                        : "text-muted"
                  }
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.label}
                </span>
              )}

              {!isLast ? <ChevronRightIcon className="size-3.5 shrink-0 text-muted" /> : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
