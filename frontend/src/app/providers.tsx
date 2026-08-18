import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider as ReduxProvider } from "react-redux";
import { Toaster } from "sonner";
import { ThemeProvider, useTheme } from "../shared/theme";
import { store } from "../redux/store";
import { createMutationToastCache } from "../shared/api/mutationToastCache";
import { createQueryToastCache } from "../shared/api/queryToastCache";
import type { ReactNode } from "react";

const queryClient = new QueryClient({
  queryCache: createQueryToastCache(),
  mutationCache: createMutationToastCache(),
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

const ThemedToaster = () => {
  const { theme } = useTheme();

  return (
    <Toaster
      theme={theme}
      richColors
      closeButton
      position="bottom-right"
      toastOptions={{
        classNames: {
          toast: "sentinel-toast",
          success: "sentinel-toast-success",
          error: "sentinel-toast-error",
          loading: "sentinel-toast-loading",
          info: "sentinel-toast-info",
          warning: "sentinel-toast-warning",
          actionButton: "sentinel-toast-action",
          cancelButton: "sentinel-toast-cancel",
        },
      }}
    />
  );
};

export const AppProviders = ({ children }: { children: ReactNode }) => {
  return (
    <ReduxProvider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          {children}
          <ThemedToaster />
        </ThemeProvider>
      </QueryClientProvider>
    </ReduxProvider>
  );
};
