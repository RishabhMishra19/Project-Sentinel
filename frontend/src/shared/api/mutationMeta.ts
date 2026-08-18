export type MutationToastMessages = {
  loading: string;
  success: string | ((data: unknown) => string);
  error?: string | ((error: unknown) => string);
};

export type AppMutationMeta = {
  toast?: MutationToastMessages;
  /** Skip all mutation toasts (e.g. logout). */
  silent?: boolean;
};

export type AppQueryMeta = {
  /** Skip the default query error toast. */
  silent?: boolean;
  /** Override error toast copy (defaults to API message). */
  errorMessage?: string | ((error: unknown) => string);
};

declare module "@tanstack/react-query" {
  interface Register {
    mutationMeta: AppMutationMeta;
    queryMeta: AppQueryMeta;
  }
}
