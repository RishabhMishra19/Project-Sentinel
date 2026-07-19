export const UI = {
  radius: {
    sm: "rounded-md",
    md: "rounded-lg",
    lg: "rounded-xl",
    xl: "rounded-2xl",
  },

  transition: {
    default: "transition-all duration-200 ease-out",
  },

  zIndex: {
    navbar: "z-30",
    sidebar: "z-40",
    overlay: "z-50",
    modal: "z-50",
    toast: "z-50",
  },
} as const;
