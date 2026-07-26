import { useId, useState } from "react";
import { toast } from "../../../shared/ui/toast";

type TempPasswordRevealDialogProps = {
  open: boolean;
  temporaryPassword: string | null;
  onClose: () => void;
  title?: string;
  description?: string;
};

export const TempPasswordRevealDialog = ({
  open,
  temporaryPassword,
  onClose,
  title = "Temporary password",
  description = "Copy this password now and share it securely with the user. It will not be shown again.",
}: TempPasswordRevealDialogProps) => {
  const titleId = useId();
  const [copied, setCopied] = useState(false);

  if (!open || !temporaryPassword) {
    return null;
  }

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(temporaryPassword);
      setCopied(true);
      toast.success("Temporary password copied to clipboard.");
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy temporary password.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 px-4">
      <button
        type="button"
        aria-label="Close dialog backdrop"
        className="absolute inset-0 cursor-default"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 w-full max-w-lg rounded-xl bg-surface p-6 shadow-lg"
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <h2 id={titleId} className="text-xl font-semibold text-foreground">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded border border-border px-2 py-1 text-sm text-foreground hover:bg-background"
          >
            Close
          </button>
        </div>

        <p className="mb-3 text-sm text-muted">{description}</p>

        <div className="flex items-center gap-2 rounded-lg border border-border bg-background p-3">
          <code className="min-w-0 flex-1 break-all font-mono text-sm text-foreground">
            {temporaryPassword}
          </code>
          <button
            type="button"
            onClick={() => void onCopy()}
            className="shrink-0 cursor-pointer rounded border border-border px-3 py-1.5 text-sm text-foreground hover:bg-surface"
          >
            {copied ? "Copied" : "Copy"}
          </button>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded bg-accent px-4 py-2 text-sm text-accent-foreground hover:opacity-90"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
