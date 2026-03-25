'use client'

import { useCategoryDeletionMutation } from '@/hooks/useCategoryDeleteMutation'
import { useCategoryUpdateMutation } from '@/hooks/useCategoryUpdateMutation'
import { useModalStore } from '@/store/useModalStore.ts'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import z from 'zod'
import { Button } from '../ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form'
import { Input } from '../ui/input'

const updateCategorySchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
})

type UpdateCategoryFormData = z.infer<typeof updateCategorySchema>

export function CategoryManagement() {
  const deleteC = useCategoryDeletionMutation()
  const updateC = useCategoryUpdateMutation()
  const { element, toggleIsOpen } = useModalStore()

  const form = useForm<UpdateCategoryFormData>({
    resolver: zodResolver(updateCategorySchema),
    defaultValues: {
      name: element?.type === 'category' ? element.data.name : '',
    },
  })

  function onSubmit(data: UpdateCategoryFormData) {
    if (element?.type === 'category' && form.formState.isDirty) {
      updateC.mutate({
        id: element.data.id,
        body: { name: data.name },
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

        <div className="flex flex-col justify-between gap-4 lg:flex-row">
          <Button
            type="button"
            variant="outline"
            className="text-xs md:text-sm"
            onClick={() => toggleIsOpen()}
          >
            Cancelar
          </Button>

          {element?.type === 'category' && (
            <Button
              type="button"
              variant="destructive"
              className="text-xs md:text-sm"
              onClick={() => {
                deleteC.mutate(element.data.id)
                toggleIsOpen()
              }}
              disabled={deleteC.isPending || deleteC.isSuccess}
            >
              Deletar Categoria
            </Button>
          )}

          <Button
            type="submit"
            className="text-xs md:text-sm"
            disabled={deleteC.isPending || deleteC.isSuccess}
          >
            Editar Categoria
          </Button>
        </div>
      </form>
    </Form>
  )
}
