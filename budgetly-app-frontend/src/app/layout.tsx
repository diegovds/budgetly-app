import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Budgetly',
  description: '',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} dark flex min-h-dvh flex-col antialiased`}
      >
        <div className="bg-pink-500 p-4">navbar</div>
        <main className="container mx-auto my-5 flex flex-1 px-4 md:my-10 md:px-10">
          {children}
        </main>
        <div className="bg-pink-500 p-4">footer</div>
      </body>
    </html>
  )
}
