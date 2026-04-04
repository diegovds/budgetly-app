'use client'

import { useAccountDeletionMutation } from '@/hooks/useAccountDeleteMutation'
import { useAccountUpdateMutation } from '@/hooks/useAccountUpdateMutation'
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

const updateAccountSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
})

type UpdateAccountFormData = z.infer<typeof updateAccountSchema>

export function AccountManagement() {
  const deleteA = useAccountDeletionMutation()
  const updateA = useAccountUpdateMutation()
  const { element, toggleIsOpen } = useModalStore()

  const form = useForm<UpdateAccountFormData>({
    resolver: zodResolver(updateAccountSchema),
    defaultValues: {
      name: element?.type === 'account' ? element.data.name : '',
    },
  })

  const { isDirty } = form.formState

  function onSubmit(data: UpdateAccountFormData) {
    if (element?.type === 'account' && isDirty) {
      updateA.mutate(
        { id: element.data.id, body: { name: data.name } },
        { onSuccess: () => toggleIsOpen() },
      )
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="bg-accent space-y-6 rounded border p-4"
      >
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

        <div className="flex flex-col justify-between gap-4 lg:flex-row">
          <Button
            type="button"
            variant="outline"
            className="text-xs md:text-sm"
            onClick={() => toggleIsOpen()}
          >
            Cancelar
          </Button>

          {element?.type === 'account' && (
            <Button
              type="button"
              variant="destructive"
              className="text-xs md:text-sm"
              onClick={() => {
                deleteA.mutate(element.data.id, {
                  onSuccess: () => toggleIsOpen(),
                })
              }}
              disabled={deleteA.isPending || deleteA.isSuccess}
            >
              Deletar Conta
            </Button>
          )}

          <Button
            type="submit"
            className="text-xs md:text-sm"
            disabled={
              deleteA.isPending ||
              deleteA.isSuccess ||
              updateA.isPending ||
              updateA.isSuccess
            }
          >
            Editar Conta
          </Button>
        </div>
      </form>
    </Form>
  )
}
