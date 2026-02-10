import { getAuthState } from '@/actions/get-auth-state'
import { Navbar } from '@/components/navbar'
import { QueryClientContext } from '@/providers/query-client'
import { StoreHydration } from '@/providers/store-hydration'
import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import './globals.css'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400'],
})

export const metadata: Metadata = {
  title: {
    default: 'Budgetly',
    template: '%s | Budgetly',
  },
  description: '',
  openGraph: {
    title: {
      default: 'Budgetly',
      template: '%s | Budgetly',
    },
    description: '',
    images: [''],
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const { token } = await getAuthState()

  return (
    <html lang="pt-BR">
      <body
        className={`${poppins.className} dark flex min-h-dvh flex-col antialiased`}
      >
        <QueryClientContext>
          <StoreHydration token={token} />
          <Navbar token={token} />
          <main className="container mx-auto my-5 flex flex-1 px-4 md:my-10 md:px-10">
            {children}
          </main>
          <div className="bg-pink-500 p-4">footer</div>
        </QueryClientContext>
      </body>
    </html>
  )
}
