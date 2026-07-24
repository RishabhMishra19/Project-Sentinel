import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Provider } from 'react-redux'
import { Toaster } from 'sonner'
import { ThemeProvider, useTheme } from '../shared/theme'
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

const ThemedToaster = () => {
  const { theme } = useTheme()

  return (
    <Toaster
      theme={theme}
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
  )
}

export const AppProviders = ({ children }: { children: ReactNode }) => {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          {children}
          <ThemedToaster />
        </ThemeProvider>
      </QueryClientProvider>
    </Provider>
  )
}
