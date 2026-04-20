'use client'

import { useAccountsStore } from '@/store/account'
import { useCategoriesStore } from '@/store/categories'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CalendarIcon, Loader2, RotateCcw, SlidersHorizontal } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { useForm } from 'react-hook-form'
import z from 'zod'

import { SearchParams } from '@/app/transaction/page'
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
  params: SearchParams
}

const ALL_VALUE = '__all__'

const createTransactionSchema = z.object({
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  accountId: z.uuid().optional(),
  categoryId: z.uuid().optional(),
  search: z.string().optional(),
})

type CreateNewTransactionFormData = z.infer<typeof createTransactionSchema>

export function TransactionFilters({ params }: TransactionFiltersProps) {
  const { accounts } = useAccountsStore()
  const { categories } = useCategoriesStore()
  const router = useRouter()
  const [isFiltering, startFilterTransition] = useTransition()
  const [isResetting, startResetTransition] = useTransition()

  const form = useForm<CreateNewTransactionFormData>({
    resolver: zodResolver(createTransactionSchema),
    defaultValues: {
      startDate: params.startDate ? new Date(params.startDate) : undefined,
      endDate: params.endDate ? new Date(params.endDate) : undefined,
      accountId: params.accountId ?? undefined,
      categoryId: params.categoryId ?? undefined,
      search: params.search ?? undefined,
    },
  })

  function onSubmit(data: CreateNewTransactionFormData) {
    startFilterTransition(() => {
      router.push(
        `/transaction?page=${1}${
          data.startDate ? `&startDate=${data.startDate.toISOString()}` : ''
        }${data.endDate ? `&endDate=${data.endDate.toISOString()}` : ''}${
          data.accountId ? `&accountId=${data.accountId}` : ''
        }${
          data.categoryId ? `&categoryId=${data.categoryId}` : ''
        }${data.search ? `&search=${data.search}` : ''}`,
      )
    })
  }

  function handleReset() {
    startResetTransition(() => {
      router.push('/transaction')
    })
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="bg-card flex flex-col justify-between gap-5 rounded-xl border p-5 lg:flex-row"
      >
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="text-muted-foreground size-3.5" />
            <span className="text-muted-foreground text-xs font-medium uppercase tracking-wider">
              Filtros
            </span>
          </div>
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
            {/* DATA INICIAL */}
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-1.5">
                  <FormLabel className="text-xs font-medium">
                    Data inicial
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={`w-full justify-start text-left text-sm font-normal ${
                            !field.value && 'text-muted-foreground'
                          }`}
                        >
                          <CalendarIcon className="size-3.5" />
                          {field.value ? (
                            format(field.value, 'dd/MM/yyyy', { locale: ptBR })
                          ) : (
                            <span>Data</span>
                          )}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto rounded-xl p-0">
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

            {/* DATA FINAL */}
            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-1.5">
                  <FormLabel className="text-xs font-medium">
                    Data final
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={`w-full justify-start text-left text-sm font-normal ${
                            !field.value && 'text-muted-foreground'
                          }`}
                        >
                          <CalendarIcon className="size-3.5" />
                          {field.value ? (
                            format(field.value, 'dd/MM/yyyy', { locale: ptBR })
                          ) : (
                            <span>Data</span>
                          )}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto rounded-xl p-0">
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

            {/* CONTA */}
            <FormField
              control={form.control}
              name="accountId"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-1.5">
                  <FormLabel className="text-xs font-medium">Conta</FormLabel>
                  <Select
                    value={field.value ?? ALL_VALUE}
                    onValueChange={(value) =>
                      field.onChange(value === ALL_VALUE ? undefined : value)
                    }
                  >
                    <FormControl>
                      <SelectTrigger className="w-full text-sm">
                        <SelectValue placeholder="Todas" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={ALL_VALUE}>Todas</SelectItem>
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

            {/* CATEGORIA */}
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-1.5">
                  <FormLabel className="text-xs font-medium">
                    Categoria
                  </FormLabel>
                  <Select
                    value={field.value ?? ALL_VALUE}
                    onValueChange={(value) =>
                      field.onChange(value === ALL_VALUE ? undefined : value)
                    }
                  >
                    <FormControl>
                      <SelectTrigger className="w-full text-sm">
                        <SelectValue placeholder="Todas" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={ALL_VALUE}>Todas</SelectItem>
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

            {/* BUSCA */}
            <FormField
              control={form.control}
              name="search"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-1.5">
                  <FormLabel className="text-xs font-medium">
                    Descrição
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Conta da luz..."
                      className="text-sm"
                      value={field.value ?? ''}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === '' ? undefined : e.target.value,
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex items-end gap-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={handleReset}
            disabled={isFiltering || isResetting}
            className="gap-1.5"
          >
            {isResetting ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <>
                <RotateCcw className="size-3.5" />
                Limpar
              </>
            )}
          </Button>

          <Button
            type="submit"
            size="sm"
            disabled={isFiltering || isResetting}
            className="gap-1.5"
          >
            {isFiltering ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              'Filtrar'
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}
