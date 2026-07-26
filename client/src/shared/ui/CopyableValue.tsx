import { useState } from "react";
import { toast } from "./toast";

type CopyableValueProps = {
  value: string;
  copySuccessMessage?: string;
  copyErrorMessage?: string;
  /** `inline` for dense panels; `block` for secret reveal dialogs. */
  variant?: "inline" | "block";
};

export const CopyableValue = ({
  value,
  copySuccessMessage = "Copied to clipboard.",
  copyErrorMessage = "Could not copy.",
  variant = "inline",
}: CopyableValueProps) => {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast.success(copySuccessMessage);
      window.setTimeout(() => setCopied(false), variant === "block" ? 2000 : 1600);
    } catch {
      toast.error(copyErrorMessage);
    }
  };

  if (variant === "block") {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-border bg-background p-3">
        <code className="min-w-0 flex-1 break-all font-mono text-sm text-foreground">{value}</code>
        <button
          type="button"
          onClick={() => void onCopy()}
          className="shrink-0 cursor-pointer rounded border border-border px-3 py-1.5 text-sm text-foreground hover:bg-surface"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-2">
      <code className="min-w-0 flex-1 font-mono text-xs leading-5 text-foreground">{value}</code>
      <button
        type="button"
        onClick={() => void onCopy()}
        className="shrink-0 rounded border border-border px-2 py-0.5 text-[11px] text-muted hover:bg-chrome hover:text-foreground"
      >
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
};
