import { toast as sonnerToast, type ExternalToast } from 'sonner'

type ToastAction = {
  label: string
  onClick: () => void
}

type PromiseMessages<T> = {
  loading: string
  success: string | ((data: T) => string)
  error: string | ((error: unknown) => string)
}

/**
 * App toast helpers on top of sonner.
 * Prefer mutation `meta.toast` / QueryCache error toasts for API work.
 * Use `toast.promise` only for non-React-Query async work.
 */
export const toast = {
  success(message: string, options?: ExternalToast) {
    return sonnerToast.success(message, options)
  },

  error(message: string, options?: ExternalToast) {
    return sonnerToast.error(message, options)
  },

  loading(message: string, options?: ExternalToast) {
    return sonnerToast.loading(message, options)
  },

  info(message: string, options?: ExternalToast) {
    return sonnerToast.info(message, options)
  },

  warning(message: string, options?: ExternalToast) {
    return sonnerToast.warning(message, options)
  },

  /** Loading → success or error when the promise settles. */
  promise<T>(promise: Promise<T>, messages: PromiseMessages<T>) {
    return sonnerToast.promise(promise, messages)
  },

  /** Toast with a primary action button. */
  action(message: string, action: ToastAction, options?: ExternalToast) {
    return sonnerToast(message, {
      ...options,
      action: {
        label: action.label,
        onClick: action.onClick,
      },
    })
  },

  /** Toast with a dismiss/cancel control (and optional primary action). */
  cancellable(
    message: string,
    options: {
      cancelLabel?: string
      onCancel?: () => void
      action?: ToastAction
    } & ExternalToast = {},
  ) {
    const { cancelLabel = 'Dismiss', onCancel, action, ...rest } = options
    return sonnerToast(message, {
      ...rest,
      cancel: {
        label: cancelLabel,
        onClick: () => onCancel?.(),
      },
      ...(action
        ? {
            action: {
              label: action.label,
              onClick: action.onClick,
            },
          }
        : {}),
    })
  },

  dismiss(id?: string | number) {
    sonnerToast.dismiss(id)
  },
}
