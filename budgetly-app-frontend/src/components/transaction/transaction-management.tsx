'use client'

import { useTransactionDeletionMutation } from '@/hooks/useTransactionDeleteMutation'
import { useTransactionUpdateMutation } from '@/hooks/useTransactionUpdateMutation'
import { useModalStore } from '@/store/useModalStore.ts'
import { currencyToNumber, formatCurrencyString } from '@/utils/format'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'
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
})

type CreateNewTransactionFormData = z.infer<typeof createTransactionSchema>

export function TransactionManagement() {
  const deleteT = useTransactionDeletionMutation()
  const updateT = useTransactionUpdateMutation()
  const { element, toggleIsOpen } = useModalStore()
  const isExpense = element?.data.type === 'EXPENSE'

  const form = useForm<CreateNewTransactionFormData>({
    resolver: zodResolver(createTransactionSchema),
    defaultValues: {
      amount:
        element?.type === 'transaction'
          ? formatCurrencyString(Math.abs(element.data.amount))
          : '',
      date:
        element?.type === 'transaction'
          ? new Date(element.data.date)
          : new Date(),
      description:
        element?.type === 'transaction' && element.data.description
          ? element.data.description
          : '',
    },
  })

  function onSubmit(data: CreateNewTransactionFormData) {
    if (element?.type === 'transaction') {
      updateT.mutate({
        id: element.data.id,
        body: {
          ...data,
          date: data.date.toISOString(),
          amount: currencyToNumber(data.amount),
        },
      })

      toggleIsOpen()
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 rounded border p-4"
      >
        <div className="space-y-4">
          <div>
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm md:text-base">Valor</FormLabel>
                  <FormControl>
                    <div className="relative">
                      {isExpense && (
                        <span className="absolute top-1/2 left-2 -translate-y-1/2">
                          -
                        </span>
                      )}
                      <Input
                        className={`text-xs md:text-base ${isExpense ? 'pl-4' : ''}`}
                        type="text"
                        placeholder="R$ 1.000,00"
                        value={field.value ?? ''}
                        onChange={(e) => {
                          const formatted = formatCurrencyString(e.target.value)
                          field.onChange(formatted)
                        }}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid items-start gap-4 lg:grid-cols-2">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-sm md:text-base">Data</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={`w-full justify-start text-left text-xs font-normal md:text-base ${
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
                        disabled={(day) =>
                          day > new Date(new Date().setHours(0, 0, 0, 0))
                        }
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
                  <FormLabel className="text-sm md:text-base">
                    Descrição
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      className="text-xs md:text-base"
                      placeholder="Conta da luz"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex flex-col justify-between gap-4 lg:flex-row">
          <Button
            type="button"
            variant="outline"
            className="text-xs md:text-sm"
            onClick={() => {
              toggleIsOpen()
            }}
          >
            Cancelar
          </Button>

          {element?.type === 'transaction' && (
            <Button
              type="button"
              variant="destructive"
              className="text-xs md:text-sm"
              onClick={() => {
                deleteT.mutate(element.data.id)
                toggleIsOpen()
              }}
              disabled={deleteT.isPending || deleteT.isSuccess}
            >
              Deletar Transação
            </Button>
          )}

          <Button
            type="submit"
            className="text-xs md:text-sm"
            disabled={deleteT.isPending || deleteT.isSuccess}
          >
            Editar Transação
          </Button>
        </div>
      </form>
    </Form>
  )
}
