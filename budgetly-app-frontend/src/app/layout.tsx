import { getAuthState } from '@/actions/get-auth-state'
import { Footer } from '@/components/footer'
import { Navbar } from '@/components/navbar'
import {
  getAccount,
  getAccountTypes,
  getCategory,
  getCategoryTypes,
} from '@/http/api'
import { QueryClientContext } from '@/providers/query-client'
import { StoreHydration } from '@/providers/store-hydration'
import { StoreInitializer } from '@/providers/store-initializer'
import type { Metadata, Viewport } from 'next'
import { redirect } from 'next/navigation'
// eslint-disable-next-line camelcase
import { DM_Serif_Display, Poppins } from 'next/font/google'
import { Toaster } from 'sonner'
import './globals.css'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-poppins',
})

const dmSerifDisplay = DM_Serif_Display({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-serif-display',
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

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const { token } = await getAuthState()

  let accounts = null
  let categories = null
  let categoryTypes = null
  let accountTypes = null

  if (token) {
    try {
      ;[accounts, categories, categoryTypes, accountTypes] = await Promise.all([
        getAccount({ limit: 50 }),
        getCategory({ limit: 50, dateRange: 'all' }),
        getCategoryTypes(),
        getAccountTypes(),
      ])
    } catch {
      redirect('/api/auth/signout')
    }
  }

  return (
    <html lang="pt-BR">
      <body
        className={`${poppins.variable} ${dmSerifDisplay.variable} dark flex min-h-dvh flex-col font-sans antialiased`}
      >
        <QueryClientContext>
          <StoreHydration token={token} />
          {accounts && categories && categoryTypes && accountTypes && (
            <StoreInitializer
              accounts={accounts.accounts}
              categories={categories.categories}
              categoryTypes={categoryTypes}
              accountTypes={accountTypes}
            />
          )}
          <Navbar token={token} />
          <main className="container mx-auto my-5 flex flex-1 px-4 md:my-10 md:px-10">
            {children}
            <Toaster theme="dark" position="top-center" />
          </main>
          <Footer />
        </QueryClientContext>
      </body>
    </html>
  )
}
