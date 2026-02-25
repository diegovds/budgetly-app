'use client'

import { clearAuthCookie } from '@/actions/clear-auth-cookie'
import { useAuthStore } from '@/store/auth'
import { LogOut, Menu, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from './ui/button'

type NavbarProps = {
  token: string | null
}

type MenuItem = {
  label: string
  href: string
}

export function Navbar({ token }: NavbarProps) {
  const [menuOpened, setMenuOpened] = useState(false)
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
      <div className="container mx-auto hidden items-center justify-between px-10 py-2 md:flex">
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
      <div
        className={`container mx-auto flex flex-col items-center justify-between px-4 py-2 md:hidden`}
      >
        <div className="flex w-full items-center justify-between">
          <h1 className="text-xl font-bold">Budgetly</h1>
          <Button variant="outline" onClick={() => setMenuOpened(!menuOpened)}>
            {menuOpened ? <X size={15} /> : <Menu size={15} />}
          </Button>
        </div>
        {token && (
          <div
            className={`flex w-full flex-col items-center overflow-hidden duration-300 ${menuOpened ? 'max-h-98.25' : 'max-h-0'}`}
          >
            <div className="mt-4 flex w-full flex-col items-center gap-2">
              {menu.map((item) =>
                item.href === pathname ? (
                  <Button className="w-full" key={item.href}>
                    {item.label}
                  </Button>
                ) : (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpened(!menuOpened)}
                  >
                    <Button className="w-full" variant="ghost">
                      {item.label}
                    </Button>
                  </Link>
                ),
              )}
            </div>
            <Button
              className="flex w-full items-center justify-center"
              variant="ghost"
              onClick={handleLogout}
            >
              Sair <LogOut />
            </Button>
          </div>
        )}
      </div>
    </nav>
  )
}
