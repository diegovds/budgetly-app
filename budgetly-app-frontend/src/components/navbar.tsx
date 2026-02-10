'use client'

import { clearAuthCookie } from '@/actions/clear-auth-cookie'
import { useAuthStore } from '@/store/auth'
import { LogOut } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from './ui/button'

type NavbarProps = {
  token: string | null
}

type MenuItem = {
  label: string
  href: string
}

export function Navbar({ token }: NavbarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { clearToken } = useAuthStore()

  const menu: MenuItem[] = [
    { label: 'Painel', href: '/' },
    { label: 'Transações', href: '/transaction' },
    { label: 'Contas', href: '/account' },
    { label: 'Categorias', href: '/category' },
  ]

  async function handleLogout() {
    await clearAuthCookie()
    clearToken()
    router.push('/login')
  }

  return (
    <nav className="bg-card">
      <div className="container mx-auto flex items-center justify-between px-4 py-2 md:px-10">
        <h1 className="text-xl font-bold">Budgetly</h1>
        {token && (
          <>
            <div className="flex gap-2">
              {menu.map((item) =>
                item.href === pathname ? (
                  <Button key={item.href}>{item.label}</Button>
                ) : (
                  <Link key={item.href} href={item.href}>
                    <Button variant="ghost">{item.label}</Button>
                  </Link>
                ),
              )}
            </div>
            <Button
              className="flex items-center justify-center"
              variant="ghost"
              onClick={handleLogout}
            >
              Sair <LogOut />
            </Button>
          </>
        )}
      </div>
    </nav>
  )
}
