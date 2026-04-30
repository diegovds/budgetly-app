'use client'

import Link from 'next/link'

type Props = {
  message?: string
  digest?: string
  reset?: () => void
}

export function ErrorPage({ message, digest, reset }: Props) {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-12 py-16">
      <div className="relative w-72">
        <svg
          viewBox="0 0 288 80"
          className="w-full overflow-visible"
          aria-hidden
        >
          {[16, 32, 48, 64].map((y) => (
            <line
              key={y}
              x1="0"
              y1={y}
              x2="288"
              y2={y}
              stroke="currentColor"
              strokeOpacity="0.06"
              strokeWidth="1"
            />
          ))}
          <path
            d="M0,14 C20,14 35,10 55,8 C70,6 78,10 90,22 C102,34 108,56 124,62 L288,62 L288,80 L0,80 Z"
            fill="oklch(0.704 0.191 22.216)"
            fillOpacity="0.08"
          />
          <path
            d="M0,14 C20,14 35,10 55,8 C70,6 78,10 90,22 C102,34 108,56 124,62 L288,62"
            fill="none"
            stroke="oklch(0.704 0.191 22.216)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle
            cx="288"
            cy="62"
            r="14"
            fill="oklch(0.704 0.191 22.216)"
            fillOpacity="0.12"
            className="animate-pulse"
          />
          <circle cx="288" cy="62" r="4" fill="oklch(0.704 0.191 22.216)" />
        </svg>
      </div>

      <div className="flex flex-col items-center gap-3 text-center">
        <h1 className="font-(family-name:--font-serif-display) text-4xl md:text-5xl">
          Algo deu errado
        </h1>
        <p className="text-muted-foreground max-w-xs text-sm leading-relaxed text-balance">
          {message && !message.includes('Server Components')
            ? message
            : 'Ocorreu um erro inesperado. Tente novamente ou volte para a página inicial.'}
        </p>
        {digest && (
          <p className="text-muted-foreground/40 font-mono text-xs">{digest}</p>
        )}
      </div>

      <div className="flex flex-col items-center gap-3 sm:flex-row">
        {reset && (
          <button
            onClick={reset}
            className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-9 cursor-pointer items-center justify-center rounded-md px-4 text-sm font-medium transition-all"
          >
            Tentar novamente
          </button>
        )}
        <Link
          href="/"
          className="text-muted-foreground hover:text-foreground inline-flex h-9 items-center justify-center rounded-md px-4 text-sm transition-colors"
        >
          Voltar para a Home
        </Link>
      </div>
    </div>
  )
}
