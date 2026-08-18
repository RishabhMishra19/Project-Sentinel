type IconProps = {
  className?: string;
};

/** Linked modules — services / capabilities */
export const ServicesIcon = ({ className }: IconProps) => (
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
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" />
    <path d="M10 6.5h2.5a2 2 0 0 1 2 2V10" />
    <path d="M14 17.5h-2.5a2 2 0 0 1-2-2V14" />
  </svg>
);
