'use client'

import { useTransactionInsertionMutation } from '@/hooks/useTransactionInsertionMutation'
import { getAccount, getCategory } from '@/http/api'
import { useModalStore } from '@/store/useModalStore.ts'
import { currencyToNumber, formatCurrencyString } from '@/utils/format'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueries } from '@tanstack/react-query'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import z from 'zod'
import { Button } from '../ui/button'
import { Calendar } from '../ui/calendar'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form'
import { Input } from '../ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'

const createTransactionSchema = z.object({
  amount: z.string().refine(
    (val) => {
      const number = currencyToNumber(val)
      return !isNaN(number) && number > 0
    },
    {
      message: 'Valor inválido',
    },
  ),
  description: z.string().min(1, 'Descrição é obrigatória'),
  date: z.date(),
  accountId: z.uuid(),
  categoryId: z.uuid(),
})

type CreateNewTransactionFormData = z.infer<typeof createTransactionSchema>

export function NewTransaction() {
  const { toggleIsOpen, toggleWhoOpened } = useModalStore()

  const results = useQueries({
    queries: [
      {
        queryKey: ['accounts', 50],
        queryFn: () => getAccount({ limit: 50 }),
      },
      {
        queryKey: ['categories', 50],
        queryFn: () => getCategory({ limit: 50 }),
      },
    ],
  })

  const accounts = results[0].data?.accounts ?? []
  const categories = results[1].data?.categories ?? []

  const { mutate, isPending, error, isSuccess } =
    useTransactionInsertionMutation()
  const form = useForm<CreateNewTransactionFormData>({
    resolver: zodResolver(createTransactionSchema),
    defaultValues: {
      amount: '',
      date: new Date(),
      accountId: accounts[0]?.id || '',
      categoryId: categories[0]?.id || '',
      description: '',
    },
  })

  function onSubmit(data: CreateNewTransactionFormData) {
    const category = categories.find((c) => c.id === data.categoryId)

    if (!category) return

    mutate({
      ...data,
      date: data.date.toISOString(),
      type: category.type,
      amount: currencyToNumber(data.amount),
    })

    toggleIsOpen()
    toggleWhoOpened()
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 rounded-xl border p-6 shadow-sm"
      >
        <div className="space-y-4">
          <div>
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="R$ 1.000,00"
                      value={field.value ?? ''}
                      onChange={(e) => {
                        const formatted = formatCurrencyString(e.target.value)
                        field.onChange(formatted)
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            <FormField
              control={form.control}
              name="accountId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Conta</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione a Conta" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {accounts.map((account) => (
                        <SelectItem key={account.id} value={account.id}>
                          {account.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoria</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione a Categoria" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Data</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={`w-full justify-start text-left font-normal ${
                            !field.value && 'text-muted-foreground'
                          }`}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? (
                            format(field.value, 'dd/MM/yyyy', {
                              locale: ptBR,
                            })
                          ) : (
                            <span>Data</span>
                          )}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        locale={ptBR}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Conta da luz" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Link href="/transaction">
            <Button
              variant="outline"
              onClick={() => {
                toggleIsOpen()
                toggleWhoOpened()
              }}
            >
              Cancelar
            </Button>
          </Link>
          <Button type="submit" disabled={isPending || isSuccess}>
            Salvar Transação
          </Button>
        </div>
      </form>
    </Form>
  )
}
