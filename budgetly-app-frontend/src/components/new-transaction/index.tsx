import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { GetAccount200Item, GetCategory200CategoriesItem } from '@/http/api'
import Link from 'next/link'
import { Button } from '../ui/button'

type NewTransactionProps = {
  accounts: GetAccount200Item[]
  categories: GetCategory200CategoriesItem[]
}

export function NewTransaction({ accounts, categories }: NewTransactionProps) {
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
