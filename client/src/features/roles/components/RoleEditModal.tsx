import { useEffect, useId } from 'react'
import { FormField } from '../../../shared/forms/FormField'
import { useAppForm } from '../../../shared/forms/useAppForm'
import type { RoleResponse } from '../dto/response/role.response'
import { useUpdateRole } from '../hooks/useRoles'
import {
  updateRoleFormSchema,
  type UpdateRoleFormValues,
} from '../schemas/role.schema'

type RoleEditModalProps = {
  open: boolean
  role: RoleResponse | null
  onClose: () => void
}

export const RoleEditModal = ({ open, role, onClose }: RoleEditModalProps) => {
  const titleId = useId()
  const updateMutation = useUpdateRole()
  const { reset: resetMutation } = updateMutation

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useAppForm<UpdateRoleFormValues>({
    schema: updateRoleFormSchema,
    defaultValues: { name: '' },
  })

  useEffect(() => {
    if (!open || !role) {
      return
    }
    resetMutation()
    reset({ name: role.name })
  }, [open, role, reset, resetMutation])

  if (!open || !role) {
    return null
  }

  const onSubmit = (data: UpdateRoleFormValues) => {
    updateMutation.mutate(
      { id: role.id, payload: data },
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
            Edit role
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
            label="Name"
            type="text"
            autoComplete="off"
            error={errors.name}
            registration={register('name')}
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
