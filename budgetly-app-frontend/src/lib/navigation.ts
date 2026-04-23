export type NavItem = {
  label: string
  href: string
}

export const navItems: NavItem[] = [
  { label: 'Painel', href: '/' },
  { label: 'Transações', href: '/transaction' },
  { label: 'Contas', href: '/account' },
  { label: 'Categorias', href: '/category' },
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Perfil', href: '/profile' },
]
