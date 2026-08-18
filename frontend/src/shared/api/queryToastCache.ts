import { QueryCache } from "@tanstack/react-query";
import { getApiErrorMessage } from "../forms/getApiErrorMessage";
import { toast } from "../ui/toast";
import type { AppQueryMeta } from "./mutationMeta";

const resolveMessage = <T>(message: string | ((value: T) => string), value: T): string =>
  typeof message === "function" ? message(value) : message;

/**
 * Default error toasts for failed queries (no loading/success).
 * Opt out with `meta: { silent: true }`.
 */
export const createQueryToastCache = () =>
  new QueryCache({
    onError: (error, query) => {
      const meta = query.meta as AppQueryMeta | undefined;
      if (meta?.silent) {
        return;
      }
      const fallback = "Something went wrong. Please try again.";
      const message =
        meta?.errorMessage != null
          ? resolveMessage(meta.errorMessage, error)
          : getApiErrorMessage(error, fallback);
      toast.error(message);
    },
  });
