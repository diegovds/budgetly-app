import { TrendingUp } from 'lucide-react'
import Link from 'next/link'

const links = [
  { label: 'Painel', href: '/' },
  { label: 'Transações', href: '/transaction' },
  { label: 'Contas', href: '/account' },
  { label: 'Categorias', href: '/category' },
  { label: 'Dashboard', href: '/dashboard' },
]

export function Footer() {
  return (
    <footer className="border-border/50 bg-card/60 border-t">
      <div className="container mx-auto px-4 py-6 md:px-10">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <div className="bg-primary/15 flex size-6 items-center justify-center rounded-md">
              <TrendingUp className="text-primary size-3.5" />
            </div>
            <span className="text-sm font-semibold tracking-tight">
              Budgetly
            </span>
          </div>

          <nav className="flex flex-wrap justify-center gap-x-5 gap-y-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-muted-foreground hover:text-foreground text-xs transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <p className="text-muted-foreground text-xs">
            &copy; {new Date().getFullYear()} Budgetly
          </p>
        </div>
      </div>
    </footer>
  )
}
