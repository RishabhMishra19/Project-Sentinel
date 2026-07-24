type IconProps = {
  className?: string
}

export const TenantsIcon = ({ className }: IconProps) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <path d="M3 21h18" />
    <path d="M5 21V7l7-4 7 4v14" />
    <path d="M9 21v-6h6v6" />
    <path d="M9 10h.01" />
    <path d="M15 10h.01" />
    <path d="M12 10h.01" />
    <path d="M12 14h.01" />
  </svg>
)
