import { useEffect, useId } from 'react'
import { FormField } from '../../../shared/forms/FormField'
import { useAppForm } from '../../../shared/forms/useAppForm'
import type { CreateTenantResponse } from '../dto/response/tenant.response'
import type { TenantResponse } from '../dto/response/tenant.response'
import { useCreateTenant, useUpdateTenant } from '../hooks/useTenants'
import {
  createTenantFormSchema,
  updateTenantFormSchema,
  type CreateTenantFormValues,
  type UpdateTenantFormValues,
} from '../schemas/tenant.schema'

type TenantFormModalProps = {
  open: boolean
  mode: 'create' | 'edit'
  tenant: TenantResponse | null
  onClose: () => void
  onCreated?: (created: CreateTenantResponse) => void
}

export const TenantFormModal = ({
  open,
  mode,
  tenant,
  onClose,
  onCreated,
}: TenantFormModalProps) => {
  const titleId = useId()
  const createMutation = useCreateTenant()
  const updateMutation = useUpdateTenant()
  const { reset: resetCreate } = createMutation
  const { reset: resetUpdate } = updateMutation
  const isPending = createMutation.isPending || updateMutation.isPending

  const {
    register: registerCreate,
    handleSubmit: handleSubmitCreate,
    reset: resetCreateForm,
    formState: { errors: createErrors },
  } = useAppForm<CreateTenantFormValues>({
    schema: createTenantFormSchema,
    defaultValues: {
      name: '',
      slug: '',
      adminEmail: '',
      adminDisplayName: '',
    },
  })

  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    reset: resetEditForm,
    formState: { errors: editErrors },
  } = useAppForm<UpdateTenantFormValues>({
    schema: updateTenantFormSchema,
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
      resetEditForm({ name: tenant.name, slug: tenant.slug })
    } else {
      resetCreateForm({
        name: '',
        slug: '',
        adminEmail: '',
        adminDisplayName: '',
      })
    }
  }, [
    open,
    mode,
    tenant,
    resetCreate,
    resetUpdate,
    resetCreateForm,
    resetEditForm,
  ])

  if (!open) {
    return null
  }

  const onCreateSubmit = (data: CreateTenantFormValues) => {
    createMutation.mutate(data, {
      onSuccess: (created) => {
        onClose()
        onCreated?.(created)
      },
    })
  }

  const onEditSubmit = (data: UpdateTenantFormValues) => {
    if (!tenant) {
      return
    }
    updateMutation.mutate(
      { id: tenant.id, payload: data },
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

        {mode === 'edit' ? (
          <form
            onSubmit={handleSubmitEdit(onEditSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              label="Name"
              type="text"
              autoComplete="off"
              error={editErrors.name}
              registration={registerEdit('name')}
            />
            <FormField
              label="Slug"
              type="text"
              autoComplete="off"
              error={editErrors.slug}
              registration={registerEdit('slug')}
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
                {isPending ? 'Saving…' : 'Save changes'}
              </button>
            </div>
          </form>
        ) : (
          <form
            onSubmit={handleSubmitCreate(onCreateSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              label="Name"
              type="text"
              autoComplete="off"
              error={createErrors.name}
              registration={registerCreate('name')}
            />
            <FormField
              label="Slug"
              type="text"
              autoComplete="off"
              error={createErrors.slug}
              registration={registerCreate('slug')}
            />
            <FormField
              label="Admin email"
              type="email"
              autoComplete="off"
              error={createErrors.adminEmail}
              registration={registerCreate('adminEmail')}
            />
            <FormField
              label="Admin display name"
              type="text"
              autoComplete="off"
              error={createErrors.adminDisplayName}
              registration={registerCreate('adminDisplayName')}
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
                {isPending ? 'Creating…' : 'Create tenant'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
