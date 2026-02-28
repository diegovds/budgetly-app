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
import { useCategoryTypesStore } from '@/store/category-type'
import { useModalStore } from '@/store/useModalStore.ts'

const createCategorySchema = z.object({
  name: z.string().min(1, 'Informe o nome da categoria'),
  type: z.enum(['INCOME', 'EXPENSE']),
})

type CreateCategoryFormData = z.infer<typeof createCategorySchema>

export function NewCategory() {
  const { toggleIsOpen } = useModalStore()
  const { mutate, isPending, error, isSuccess } = useCategoryInsertionMutation()
  const form = useForm<CreateCategoryFormData>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      name: '',
      type: 'INCOME',
    },
  })

  const { categoryTypes } = useCategoryTypesStore()

  function onSubmit(data: CreateCategoryFormData) {
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
                Nome da categoria
              </FormLabel>
              <FormControl>
                <Input
                  className="text-xs md:text-base"
                  placeholder="Ex: Alimentação"
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
                Tipo da categoria
              </FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className="text-xs md:text-base">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categoryTypes.map((categoryType) => (
                    <SelectItem
                      className="text-xs md:text-base"
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

          <Button
            type="submit"
            className="text-xs md:text-sm"
            disabled={isPending || isSuccess}
          >
            Salvar categoria
          </Button>
        </div>
      </form>
    </Form>
  )
}
