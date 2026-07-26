import { CopyableValue } from "./CopyableValue";
import { ModalLayout } from "./ModalLayout";

type SecretRevealDialogProps = {
  open: boolean;
  value: string | null;
  onClose: () => void;
  title: string;
  description: string;
  copySuccessMessage?: string;
  copyErrorMessage?: string;
  doneLabel?: string;
};

/**
 * One-time secret display (API key, temporary password): mono value + copy + Done.
 */
export const SecretRevealDialog = ({
  open,
  value,
  onClose,
  title,
  description,
  copySuccessMessage,
  copyErrorMessage,
  doneLabel = "Done",
}: SecretRevealDialogProps) => {
  if (!open || !value) {
    return null;
  }

  return (
    <ModalLayout open={open} onClose={onClose} title={title} description={description} size="lg">
      <CopyableValue
        value={value}
        variant="block"
        copySuccessMessage={copySuccessMessage}
        copyErrorMessage={copyErrorMessage}
      />
      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={onClose}
          className="cursor-pointer rounded bg-accent px-4 py-2 text-sm text-accent-foreground hover:opacity-90"
        >
          {doneLabel}
        </button>
      </div>
    </ModalLayout>
  );
};
