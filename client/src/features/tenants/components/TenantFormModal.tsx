import { useEffect, useId } from 'react'
import { FormField } from '../../../shared/forms/FormField'
import { getApiErrorMessage } from '../../../shared/forms/getApiErrorMessage'
import { useAppForm } from '../../../shared/forms/useAppForm'
import { toast } from '../../../shared/ui/toast'
import type { TenantResponse } from '../dto/response/tenant.response'
import { useCreateTenant, useUpdateTenant } from '../hooks/useTenants'
import {
  tenantFormSchema,
  type TenantFormValues,
} from '../schemas/tenant.schema'

type TenantFormModalProps = {
  open: boolean
  mode: 'create' | 'edit'
  tenant: TenantResponse | null
  onClose: () => void
}

export const TenantFormModal = ({
  open,
  mode,
  tenant,
  onClose,
}: TenantFormModalProps) => {
  const titleId = useId()
  const createMutation = useCreateTenant()
  const updateMutation = useUpdateTenant()
  const { reset: resetCreate } = createMutation
  const { reset: resetUpdate } = updateMutation
  const isPending = createMutation.isPending || updateMutation.isPending

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useAppForm<TenantFormValues>({
    schema: tenantFormSchema,
    defaultValues: {
      name: '',
      slug: '',
    },
  })

  useEffect(() => {
    if (!open) {
      return
    }
    resetCreate()
    resetUpdate()
    if (mode === 'edit' && tenant) {
      reset({ name: tenant.name, slug: tenant.slug })
    } else {
      reset({ name: '', slug: '' })
    }
  }, [open, mode, tenant, reset, resetCreate, resetUpdate])

  if (!open) {
    return null
  }

  const onSubmit = (data: TenantFormValues) => {
    if (mode === 'edit' && tenant) {
      toast.promise(
        updateMutation.mutateAsync({ id: tenant.id, payload: data }),
        {
          loading: 'Updating tenant…',
          success: () => {
            onClose()
            return 'Tenant updated successfully.'
          },
          error: (error) =>
            getApiErrorMessage(error, 'Could not update tenant. Please try again.'),
        },
      )
      return
    }

    toast.promise(createMutation.mutateAsync(data), {
      loading: 'Creating tenant…',
      success: () => {
        onClose()
        return 'Tenant created successfully.'
      },
      error: (error) =>
        getApiErrorMessage(error, 'Could not create tenant. Please try again.'),
    })
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
            {mode === 'edit' ? 'Edit tenant' : 'Create tenant'}
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
          <FormField
            label="Slug"
            type="text"
            autoComplete="off"
            error={errors.slug}
            registration={register('slug')}
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
              disabled={isPending}
              className="cursor-pointer rounded bg-accent px-4 py-2 text-sm text-accent-foreground hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending
                ? mode === 'edit'
                  ? 'Saving…'
                  : 'Creating…'
                : mode === 'edit'
                  ? 'Save changes'
                  : 'Create tenant'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
