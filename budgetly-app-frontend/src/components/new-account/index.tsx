'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useAccountInsertionMutation } from '@/hooks/useAccountInsertionMutation'
import { getAccountTypes } from '@/http/api'
import { useModalStore } from '@/store/useModalStore.ts'
import { useQuery } from '@tanstack/react-query'

const createAccountSchema = z.object({
  name: z.string().min(1, 'Informe o nome da conta'),
  type: z.enum(['CHECKING', 'CREDIT', 'CASH']),
})

type CreateAccountFormData = z.infer<typeof createAccountSchema>

export function NewAccount() {
  const { toggleIsOpen } = useModalStore()

  const response = useQuery({
    queryKey: ['accountTypes'],
    queryFn: () => getAccountTypes(),
  })

  const accountTypes = response.data || []

  const { mutate, isPending, error, isSuccess } = useAccountInsertionMutation()
  const form = useForm<CreateAccountFormData>({
    resolver: zodResolver(createAccountSchema),
    defaultValues: {
      name: '',
      type: 'CHECKING',
    },
  })

  function onSubmit(data: CreateAccountFormData) {
    mutate(data)

    toggleIsOpen()
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 rounded-xl border p-4"
      >
        {/* Nome */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm md:text-base">
                Nome da conta
              </FormLabel>
              <FormControl>
                <Input
                  className="text-xs md:text-base"
                  placeholder="Ex: Nubank"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Tipo */}
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm md:text-base">
                Tipo da conta
              </FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className="text-xs md:text-base">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {accountTypes.map((accountType) => (
                    <SelectItem
                      className="text-xs md:text-base"
                      key={accountType.value}
                      value={accountType.value}
                    >
                      {accountType.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2">
          <Button
            type="button"
            className="text-xs md:text-sm"
            variant="outline"
            onClick={() => {
              toggleIsOpen()
            }}
          >
            Cancelar
          </Button>

          <Button
            type="submit"
            className="text-xs md:text-sm"
            disabled={isPending || isSuccess}
          >
            Salvar conta
          </Button>
        </div>
      </form>
    </Form>
  )
}
