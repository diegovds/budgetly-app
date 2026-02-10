'use client'

import { GetAccount200Item, GetCategory200CategoriesItem } from '@/http/api'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
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

type TransactionFiltersProps = {
  accounts: GetAccount200Item[]
  categories: GetCategory200CategoriesItem[]
  page: number
}

const createTransactionSchema = z.object({
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  accountId: z.uuid().optional(),
  categoryId: z.uuid().optional(),
  search: z.string().optional(),
})

type CreateNewTransactionFormData = z.infer<typeof createTransactionSchema>

export function TransactionFilters({
  accounts,
  categories,
  page,
}: TransactionFiltersProps) {
  const router = useRouter()
  const form = useForm<CreateNewTransactionFormData>({
    resolver: zodResolver(createTransactionSchema),
    defaultValues: {
      startDate: undefined,
      endDate: undefined,
      search: undefined,
      accountId: undefined,
      categoryId: undefined,
    },
  })

  function onSubmit(data: CreateNewTransactionFormData) {
    router.push(
      `/transaction?page=${page}${
        data.startDate ? `&startDate=${data.startDate.toISOString()}` : ''
      }${data.endDate ? `&endDate=${data.endDate.toISOString()}` : ''}${
        data.accountId ? `&accountId=${data.accountId}` : ''
      }${data.categoryId ? `&categoryId=${data.categoryId}` : ''}${
        data.search ? `&search=${data.search}` : ''
      }`,
    )
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="bg-card flex items-end justify-between gap-4 rounded-md border p-4"
      >
        <div className="flex gap-4">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="flex flex-col items-center">
                <FormLabel>Data inicial</FormLabel>
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
            name="endDate"
            render={({ field }) => (
              <FormItem className="flex flex-col items-center">
                <FormLabel>Data final</FormLabel>
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
            name="accountId"
            render={({ field }) => (
              <FormItem className="flex flex-col items-center">
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
              <FormItem className="flex flex-col items-center">
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
            name="search"
            render={({ field }) => (
              <FormItem className="flex flex-col items-center">
                <FormLabel>Buscar por transação</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="Conta da luz" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit">Filtrar</Button>
      </form>
    </Form>
  )
}
