import type { ReactNode } from 'react'

type FormErrorProps = {
  children: ReactNode
}

export const FormError = ({ children }: FormErrorProps) => (
  <p className="text-sm text-danger">{children}</p>
)
