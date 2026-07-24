import type { ReactNode } from 'react'

type FormErrorProps = {
  children: ReactNode
}

export function FormError({ children }: FormErrorProps) {
  return <p className="text-sm text-red-600">{children}</p>
}
