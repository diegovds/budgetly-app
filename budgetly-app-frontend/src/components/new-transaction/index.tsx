import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { GetAccount200Item, GetCategory200CategoriesItem } from '@/http/api'
import Link from 'next/link'
import z from 'zod'
import { Button } from '../ui/button'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

type NewTransactionProps = {
  accounts: GetAccount200Item[]
  categories: GetCategory200CategoriesItem[]
}

const createTransactionSchema = z.object({
  amount: z.number(),
  description: z.string().nullable(),
  date: z.iso.datetime(),
  type: z.enum(['INCOME', 'EXPENSE']),
  accountId: z.uuid(),
  categoryId: z.uuid(),
})

type CreateNewTransactionFormData = z.infer<typeof createTransactionSchema>

export function NewTransaction({ accounts, categories }: NewTransactionProps) {
  const form = useForm<CreateNewTransactionFormData>({
    resolver: zodResolver(createTransactionSchema),
    defaultValues: {
      type: 'INCOME',
      amount: 0,
      date: new Date().toISOString(),
      accountId: accounts[0]?.id || '',
      categoryId: categories[0]?.id || '',
      description: null,
    },
  })

  return (
    <Card className="h-fit w-full max-w-xl">
      <CardHeader>
        <CardTitle className="text-3xl font-bold tracking-tight">
          Adicionar Transação
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p>Card Content</p>
      </CardContent>
      <CardFooter className="flex justify-end gap-4">
        <Link href="/transactions">
          <Button variant="outline">Cancelar</Button>
        </Link>
        <Button type="submit">Salvar Transação</Button>
      </CardFooter>
    </Card>
  )
}
