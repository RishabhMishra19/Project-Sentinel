import { useEffect, useId } from 'react'
import { FormField } from '../../../shared/forms/FormField'
import { useAppForm } from '../../../shared/forms/useAppForm'
import type { UserResponse } from '../dto/response/user.response'
import { useUpdateUser } from '../hooks/useUsers'
import {
  updateUserFormSchema,
  type UpdateUserFormValues,
} from '../schemas/user.schema'

type UserEditModalProps = {
  open: boolean
  user: UserResponse | null
  onClose: () => void
}

export const UserEditModal = ({ open, user, onClose }: UserEditModalProps) => {
  const titleId = useId()
  const updateMutation = useUpdateUser()
  const { reset: resetMutation } = updateMutation

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useAppForm<UpdateUserFormValues>({
    schema: updateUserFormSchema,
    defaultValues: { displayName: '' },
  })

  useEffect(() => {
    if (!open || !user) {
      return
    }
    resetMutation()
    reset({ displayName: user.displayName })
  }, [open, user, reset, resetMutation])

  if (!open || !user) {
    return null
  }

  const onSubmit = (data: UpdateUserFormValues) => {
    updateMutation.mutate(
      { id: user.id, payload: data },
      {
        onSuccess: () => {
          onClose()
        },
      },
    )
  }

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
        className="relative z-10 w-full max-w-md rounded-xl bg-surface p-6 shadow-lg"
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <h2 id={titleId} className="text-xl font-semibold text-foreground">
            Edit user
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded border border-border px-2 py-1 text-sm text-foreground hover:bg-background"
          >
            Close
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <FormField
            label="Display name"
            type="text"
            autoComplete="off"
            error={errors.displayName}
            registration={register('displayName')}
          />

          <div className="mt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded border border-border px-4 py-2 text-sm text-foreground hover:bg-background"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="cursor-pointer rounded bg-accent px-4 py-2 text-sm text-accent-foreground hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {updateMutation.isPending ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
