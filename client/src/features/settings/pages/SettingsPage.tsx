import { useNavigate } from 'react-router-dom'
import { TENANT_CONTEXT_ROUTES } from '../../../routes/paths'
import { primaryButtonClassName } from '../../../shared/ui/data-table/styles'

export const SettingsPage = () => {
  const navigate = useNavigate()

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <div>
        <button
          type="button"
          className={primaryButtonClassName}
          onClick={() => navigate(TENANT_CONTEXT_ROUTES.SETTINGS_ROLES)}
        >
          Manage Roles
        </button>
      </div>
    </div>
  )
}
