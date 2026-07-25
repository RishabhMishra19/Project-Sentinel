import { MutationCache, type Mutation } from '@tanstack/react-query'
import { getApiErrorMessage } from '../forms/getApiErrorMessage'
import { toast } from '../ui/toast'
import type { AppMutationMeta } from './mutationMeta'

const toastIds = new WeakMap<
  Mutation<unknown, unknown, unknown, unknown>,
  string | number
>()

const resolveMessage = <T>(
  message: string | ((value: T) => string),
  value: T,
): string => (typeof message === 'function' ? message(value) : message)

export const createMutationToastCache = () =>
  new MutationCache({
    onMutate: (_variables, mutation) => {
      const meta = mutation.meta as AppMutationMeta | undefined
      if (meta?.silent || meta?.toast == null) {
        return
      }
      // MutationCache onMutate return value is not passed to onSuccess/onError —
      // track the toast id on the mutation instance instead.
      toastIds.set(mutation, toast.loading(meta.toast.loading))
    },
    onSuccess: (data, _variables, _onMutateResult, mutation) => {
      const meta = mutation.meta as AppMutationMeta | undefined
      const toastId = toastIds.get(mutation)
      toastIds.delete(mutation)
      if (meta?.silent || meta?.toast == null || toastId == null) {
        return
      }
      toast.success(resolveMessage(meta.toast.success, data), { id: toastId })
    },
    onError: (error, _variables, _onMutateResult, mutation) => {
      const meta = mutation.meta as AppMutationMeta | undefined
      const toastId = toastIds.get(mutation)
      toastIds.delete(mutation)
      if (meta?.silent || meta?.toast == null) {
        return
      }
      const fallback = 'Something went wrong. Please try again.'
      const message =
        meta.toast.error != null
          ? resolveMessage(meta.toast.error, error)
          : getApiErrorMessage(error, fallback)
      if (toastId != null) {
        toast.error(message, { id: toastId })
        return
      }
      toast.error(message)
    },
  })
