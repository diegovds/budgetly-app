import { getAuthState } from '@/actions/get-auth-state'
import { Button } from '@/components/ui/button'
import { CirclePlus } from 'lucide-react'
import { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Minhas categorias',
}

export default async function CategoryPage() {
  const { token } = await getAuthState()

  if (!token) {
    redirect('/login')
  }

  return (
    <div className="w-full space-y-8">
      <header className="lg-gap-0 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <h1 className="mb-4 text-3xl font-bold">Gerenciar Categorias</h1>
          <p className="text-muted-foreground font-medium">
            Gerencie suas categorias de receitas e despesas para organizar
            melhor suas finanças.
          </p>
        </div>
        <Link href="/category/new">
          <Button className="w-fit">
            <CirclePlus /> Adicionar Categoria
          </Button>
        </Link>
      </header>
    </div>
  )
}
