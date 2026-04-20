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
        className="space-y-6"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-medium">
                Nome da conta
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Ex: Nubank"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => toggleIsOpen()}
          >
            Cancelar
          </Button>

          {element?.type === 'account' && (
            <Button
              type="button"
              variant="destructive"
              size="sm"
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
            size="sm"
            disabled={
              deleteA.isPending ||
              deleteA.isSuccess ||
              updateA.isPending ||
              updateA.isSuccess
            }
          >
            Salvar
          </Button>
        </div>
      </form>
    </Form>
  )
}
