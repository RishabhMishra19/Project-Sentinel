import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Provider } from 'react-redux'
import { Toaster } from 'sonner'
import { store } from './store'
import type { ReactNode } from 'react'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
})

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        {children}
        <Toaster
          theme="light"
          richColors
          closeButton
          position="top-right"
          toastOptions={{
            classNames: {
              toast: 'sentinel-toast',
              success: 'sentinel-toast-success',
              error: 'sentinel-toast-error',
              loading: 'sentinel-toast-loading',
              info: 'sentinel-toast-info',
              warning: 'sentinel-toast-warning',
              actionButton: 'sentinel-toast-action',
              cancelButton: 'sentinel-toast-cancel',
            },
          }}
        />
      </QueryClientProvider>
    </Provider>
  )
}
