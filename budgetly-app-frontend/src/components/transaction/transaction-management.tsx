'use client'

import { useTransactionDeletionMutation } from '@/hooks/useTransactionDeleteMutation'
import { useTransactionUpdateMutation } from '@/hooks/useTransactionUpdateMutation'
import { useModalStore } from '@/store/useModalStore.ts'
import {
  currencyToNumber,
  formatCurrencyString,
  handleAmountKeyDown,
} from '@/utils/format'
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

  const { isDirty } = form.formState

  function onSubmit(data: CreateNewTransactionFormData) {
    if (element?.type === 'transaction' && isDirty) {
      updateT.mutate(
        {
          id: element.data.id,
          body: {
            ...data,
            date: data.date.toISOString(),
            amount: currencyToNumber(data.amount),
          },
        },
        { onSuccess: () => toggleIsOpen() },
      )
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6"
      >
        <div className="space-y-4">
          <div>
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-medium">Valor</FormLabel>
                  <FormControl>
                    <div className="relative">
                      {isExpense && (
                        <span className="absolute top-1/2 left-2 -translate-y-1/2">
                          -
                        </span>
                      )}
                      <Input
                        className={isExpense ? 'pl-4' : ''}
                        type="text"
                        placeholder="R$ 1.000,00"
                        value={field.value ?? ''}
                        onChange={() => {}}
                        onKeyDown={(e) =>
                          handleAmountKeyDown(
                            e,
                            field.value ?? '',
                            field.onChange,
                          )
                        }
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
                  <FormLabel className="text-xs font-medium">Data</FormLabel>
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
                  <FormLabel className="text-xs font-medium">
                    Descrição
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
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

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => toggleIsOpen()}
          >
            Cancelar
          </Button>

          {element?.type === 'transaction' && (
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => {
                deleteT.mutate(element.data.id, {
                  onSuccess: () => toggleIsOpen(),
                })
              }}
              disabled={deleteT.isPending || deleteT.isSuccess}
            >
              Deletar Transação
            </Button>
          )}

          <Button
            type="submit"
            size="sm"
            disabled={
              deleteT.isPending ||
              deleteT.isSuccess ||
              updateT.isPending ||
              updateT.isSuccess
            }
          >
            Salvar
          </Button>
        </div>
      </form>
    </Form>
  )
}
