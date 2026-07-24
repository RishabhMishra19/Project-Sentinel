import { zodResolver } from '@hookform/resolvers/zod'
import {
  useForm,
  type DefaultValues,
  type FieldValues,
  type Resolver,
  type UseFormReturn,
} from 'react-hook-form'
import type { z } from 'zod'

type UseAppFormOptions<TFieldValues extends FieldValues> = {
  schema: z.ZodType<TFieldValues, TFieldValues>
  defaultValues: DefaultValues<TFieldValues>
  mode?: 'onSubmit' | 'onBlur' | 'onChange' | 'onTouched' | 'all'
}

export function useAppForm<TFieldValues extends FieldValues>({
  schema,
  defaultValues,
  mode = 'onSubmit',
}: UseAppFormOptions<TFieldValues>): UseFormReturn<TFieldValues> {
  return useForm<TFieldValues>({
    resolver: zodResolver(schema) as Resolver<TFieldValues>,
    defaultValues,
    mode,
    reValidateMode: 'onChange',
  })
}
