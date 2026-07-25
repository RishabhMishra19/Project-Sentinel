import { useEffect, useId } from 'react'
import { useAppForm } from '../../../shared/forms/useAppForm'
import type { RoleScopeResponse } from '../dto/response/role.response'
import { useUpdateRoleScope } from '../hooks/useRoles'
import {
  updateRoleScopeFormSchema,
  type UpdateRoleScopeFormValues,
} from '../schemas/role.schema'

const selectClassName =
  'rounded border border-border bg-surface px-3 py-2 text-foreground outline-none focus:border-ring'

type RoleScopeEditModalProps = {
  open: boolean
  roleId: string | null
  scope: RoleScopeResponse | null
  onClose: () => void
}

export const RoleScopeEditModal = ({
  open,
  roleId,
  scope,
  onClose,
}: RoleScopeEditModalProps) => {
  const titleId = useId()
  const updateMutation = useUpdateRoleScope(roleId)
  const { reset: resetMutation } = updateMutation

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useAppForm<UpdateRoleScopeFormValues>({
    schema: updateRoleScopeFormSchema,
    defaultValues: { permission: 'READ' },
  })

  useEffect(() => {
    if (!open || !scope) {
      return
    }
    resetMutation()
    reset({ permission: scope.permission })
  }, [open, scope, reset, resetMutation])

  if (!open || !roleId || !scope) {
    return null
  }

  const onSubmit = (data: UpdateRoleScopeFormValues) => {
    updateMutation.mutate(
      { scopeId: scope.id, payload: data },
      {
        onSuccess: () => {
          onClose()
        },
      },
    )
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-foreground/40 px-4">
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
          <div>
            <h2 id={titleId} className="text-xl font-semibold text-foreground">
              Edit permission
            </h2>
            <p className="mt-1 text-sm text-muted">
              {scope.scopeType}: {scope.scopeName}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded border border-border px-2 py-1 text-sm text-foreground hover:bg-background"
          >
            Close
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1 text-sm text-foreground">
            Permission
            <select className={selectClassName} {...register('permission')}>
              <option value="READ">READ</option>
              <option value="READ_AND_WRITE">READ_AND_WRITE</option>
              <option value="ALL">ALL</option>
            </select>
            {errors.permission?.message ? (
              <span className="text-sm text-danger">
                {errors.permission.message}
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
