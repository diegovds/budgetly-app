import { HeaderPage } from '@/components/header-page'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Página não encontrada',
}

export default async function NotFound() {
  return (
    <div className="w-full">
      <HeaderPage
        buttonText="Voltar para  a Home"
        description="Parece que a página que você está procurando não existe."
        href="/"
        title="Página não encontrada"
        icon={false}
      />
    </div>
  )
}
