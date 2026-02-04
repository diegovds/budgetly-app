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
import { GetAccountTypes200Item } from '@/http/api'
import Link from 'next/link'

const createAccountSchema = z.object({
  name: z.string().min(1, 'Informe o nome da conta'),
  type: z.enum(['CHECKING', 'CREDIT', 'CASH']),
})

type CreateAccountFormData = z.infer<typeof createAccountSchema>

type NewAccountProps = {
  accountTypes: GetAccountTypes200Item[]
}

export function NewAccount({ accountTypes }: NewAccountProps) {
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
  }

  return (
    <>
      <section className="w-full max-w-xl space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Nova Conta</h1>
          <p className="text-muted-foreground">
            Crie uma nova conta para organizar suas finanças.
          </p>
        </div>

        {/* Form */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 rounded-xl border p-6 shadow-sm"
          >
            {/* Nome */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da conta</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Nubank" {...field} />
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
                  <FormLabel>Tipo da conta</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {accountTypes.map((accountType) => (
                        <SelectItem
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
            <div className="flex justify-end gap-3 pt-4">
              <Link href="/account">
                <Button type="button" variant="ghost">
                  Cancelar
                </Button>
              </Link>
              <Button type="submit" disabled={isPending || isSuccess}>
                Criar conta
              </Button>
            </div>
          </form>
        </Form>
      </section>
    </>
  )
}
