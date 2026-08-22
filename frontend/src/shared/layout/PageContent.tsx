import type { ReactNode } from "react";

type PageContentProps = {
  children: ReactNode;
  className?: string;
};

export const PageContent = ({ children, className }: PageContentProps) => {
  return (
    <div
      className={["mx-auto flex w-full max-w-6xl flex-col gap-3", className]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  );
};
