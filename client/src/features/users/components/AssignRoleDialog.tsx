import { useEffect, useId } from 'react'
import { useAppForm } from '../../../shared/forms/useAppForm'
import type { UserResponse } from '../dto/response/user.response'
import { useAssignRole, useRolesQuery } from '../hooks/useUsers'
import {
  assignRoleFormSchema,
  type AssignRoleFormValues,
} from '../schemas/user.schema'

type AssignRoleDialogProps = {
  open: boolean
  user: UserResponse | null
  onClose: () => void
}

export const AssignRoleDialog = ({
  open,
  user,
  onClose,
}: AssignRoleDialogProps) => {
  const titleId = useId()
  const assignMutation = useAssignRole()
  const { reset: resetMutation } = assignMutation
  const { data: roles = [], isLoading: rolesLoading } = useRolesQuery(open)
  const activeRoles = roles.filter((role) => role.status === 'ACTIVE')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useAppForm<AssignRoleFormValues>({
    schema: assignRoleFormSchema,
    defaultValues: { roleId: '' },
  })

  useEffect(() => {
    if (!open) {
      return
    }
    resetMutation()
    reset({ roleId: '' })
  }, [open, reset, resetMutation])

  if (!open || !user) {
    return null
  }

  const onSubmit = (data: AssignRoleFormValues) => {
    assignMutation.mutate(
      {
        id: user.id,
        payload: { roleId: data.roleId },
      },
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
            Assign role
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded border border-border px-2 py-1 text-sm text-foreground hover:bg-background"
          >
            Close
          </button>
        </div>

        <p className="mb-4 text-sm text-muted">
          Assign a role to{' '}
          <span className="font-medium text-foreground">{user.displayName}</span>
          .
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1 text-sm text-foreground">
            Role
            <select
              className="rounded border border-border bg-surface px-3 py-2 text-foreground outline-none focus:border-ring"
              disabled={rolesLoading || activeRoles.length === 0}
              {...register('roleId')}
            >
              <option value="">
                {rolesLoading ? 'Loading roles…' : 'Select a role'}
              </option>
              {activeRoles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
            {errors.roleId?.message ? (
              <span className="text-sm text-danger">{errors.roleId.message}</span>
            ) : null}
            {!rolesLoading && activeRoles.length === 0 ? (
              <span className="text-sm text-muted">
                No active roles in this tenant. Create a tenant after Admin
                seeding is available, or seed roles manually.
              </span>
            ) : null}
          </label>

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
              disabled={assignMutation.isPending || activeRoles.length === 0}
              className="cursor-pointer rounded bg-accent px-4 py-2 text-sm text-accent-foreground hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {assignMutation.isPending ? 'Assigning…' : 'Assign role'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
