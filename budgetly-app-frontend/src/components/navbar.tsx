'use client'

import { clearAuthCookie } from '@/actions/clear-auth-cookie'
import { useAccountsStore } from '@/store/account'
import { useAccountTypesStore } from '@/store/account-type'
import { useAuthStore } from '@/store/auth'
import { useCategoriesStore } from '@/store/categories'
import { useCategoryTypesStore } from '@/store/category-type'
import { useQueryClient } from '@tanstack/react-query'
import { LogOut, Menu, TrendingUp, X } from 'lucide-react'
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
  const queryClient = useQueryClient()
  const [menuOpened, setMenuOpened] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { clearToken } = useAuthStore()
  const { clearAccounts } = useAccountsStore()
  const { clearAccountTypes } = useAccountTypesStore()
  const { clearCategories } = useCategoriesStore()
  const { clearCategoryTypes } = useCategoryTypesStore()

  const menu: MenuItem[] = [
    { label: 'Painel', href: '/' },
    { label: 'Transações', href: '/transaction' },
    { label: 'Contas', href: '/account' },
    { label: 'Categorias', href: '/category' },
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Perfil', href: '/profile' },
  ]

  async function handleLogout() {
    await clearAuthCookie()
    clearToken()
    clearAccounts()
    clearAccountTypes()
    clearCategories()
    clearCategoryTypes()
    queryClient.clear()
    router.push('/login')
  }

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <nav className="bg-card/80 border-border/50 sticky top-0 z-50 border-b backdrop-blur-md">
      {/* Desktop */}
      <div className="container mx-auto hidden items-center justify-between px-10 py-3 md:flex">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-primary/15 flex size-7 items-center justify-center rounded-lg">
            <TrendingUp className="text-primary size-4" />
          </div>
          <span className="text-base font-semibold tracking-tight">
            Budgetly
          </span>
        </Link>

        {token && (
          <>
            <div className="flex items-center gap-1">
              {menu.map((item) => (
                <Link key={item.href} href={item.href}>
                  <span
                    className={`relative px-3 py-1.5 text-sm transition-colors duration-150 ${
                      isActive(item.href)
                        ? 'text-foreground font-medium'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {item.label}
                    {isActive(item.href) && (
                      <span className="bg-primary absolute right-1/2 -bottom-3.25 h-0.5 w-4/5 translate-x-1/2 rounded-full" />
                    )}
                  </span>
                </Link>
              ))}
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground gap-1.5 text-sm"
              onClick={handleLogout}
            >
              <LogOut className="size-4" />
              Sair
            </Button>
          </>
        )}
      </div>

      {/* Mobile */}
      <div className="container mx-auto flex flex-col px-4 md:hidden">
        <div className="flex items-center justify-between py-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-primary/15 flex size-7 items-center justify-center rounded-lg">
              <TrendingUp className="text-primary size-4" />
            </div>
            <span className="text-base font-semibold tracking-tight">
              Budgetly
            </span>
          </Link>
          {token && (
            <Button
              variant="outline"
              size="icon"
              className="size-8"
              onClick={() => setMenuOpened(!menuOpened)}
            >
              {menuOpened ? <X className="size-4" /> : <Menu className="size-4" />}
            </Button>
          )}
        </div>

        {token && (
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${menuOpened ? 'max-h-96 pb-3' : 'max-h-0'}`}
          >
            <div className="border-border/50 flex flex-col gap-1 border-t pt-3">
              {menu.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpened(false)}
                  className={`rounded-md px-3 py-2 text-sm transition-colors ${
                    isActive(item.href)
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <button
                onClick={() => {
                  setMenuOpened(false)
                  handleLogout()
                }}
                className="text-muted-foreground hover:text-foreground mt-1 flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors"
              >
                <LogOut className="size-4" />
                Sair
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
