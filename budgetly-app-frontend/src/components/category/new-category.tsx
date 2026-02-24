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
import { useCategoryInsertionMutation } from '@/hooks/useCategoryInsertionMutation'
import { GetCategoryTypes200Item } from '@/http/api'
import Link from 'next/link'
import { Card, CardContent, CardHeader } from '../ui/card'

const createCategorySchema = z.object({
  name: z.string().min(1, 'Informe o nome da categoria'),
  type: z.enum(['INCOME', 'EXPENSE']),
})

type CreateCategoryFormData = z.infer<typeof createCategorySchema>

type NewCategoryProps = {
  categoryTypes: GetCategoryTypes200Item[]
}

export function NewCategory({ categoryTypes }: NewCategoryProps) {
  const { mutate, isPending, error, isSuccess } = useCategoryInsertionMutation()
  const form = useForm<CreateCategoryFormData>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      name: '',
      type: 'INCOME',
    },
  })

  function onSubmit(data: CreateCategoryFormData) {
    mutate(data)
  }

  return (
    <Card className="h-fit w-full max-w-xl">
      {/* Header */}
      <CardHeader className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Nova Categoria</h1>
        <p className="text-muted-foreground">
          Crie uma nova categoria para organizar suas finanças.
        </p>
      </CardHeader>

      {/* Form */}
      <CardContent>
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
                  <FormLabel>Nome da categoria</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Alimentação" {...field} />
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
                  <FormLabel>Tipo da categoria</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categoryTypes.map((categoryType) => (
                        <SelectItem
                          key={categoryType.value}
                          value={categoryType.value}
                        >
                          {categoryType.label}
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
              <Link href="/category">
                <Button type="button" variant="outline">
                  Cancelar
                </Button>
              </Link>
              <Button type="submit" disabled={isPending || isSuccess}>
                Salvar categoria
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
