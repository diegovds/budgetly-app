export function OgImage() {
  return (
    <div
      style={{
        width: 1200,
        height: 630,
        backgroundColor: '#0d0e14',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 80px',
        fontFamily: 'var(--font-poppins, sans-serif)',
      }}
    >
      {/* Dot grid */}
      <svg
        style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
        width="1200"
        height="630"
      >
        <defs>
          <pattern
            id="og-dots"
            x="0"
            y="0"
            width="28"
            height="28"
            patternUnits="userSpaceOnUse"
          >
            <circle
              cx="1.5"
              cy="1.5"
              r="1.5"
              fill="#ffffff"
              fillOpacity="0.07"
            />
          </pattern>
        </defs>
        <rect width="1200" height="630" fill="url(#og-dots)" />
      </svg>

      {/* Glow — bottom left */}
      <div
        style={{
          position: 'absolute',
          bottom: -100,
          left: -80,
          width: 680,
          height: 440,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(232,137,90,0.18) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Glow — top right */}
      <div
        style={{
          position: 'absolute',
          top: -140,
          right: -100,
          width: 560,
          height: 400,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(232,137,90,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Chart */}
      <svg
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          pointerEvents: 'none',
        }}
        width="1200"
        height="200"
        viewBox="0 0 1200 200"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="og-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#E8895A" stopOpacity="0.14" />
            <stop offset="100%" stopColor="#E8895A" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d="M0,190 C80,185 180,172 300,152 C420,132 500,110 620,84 C720,62 800,42 920,26 C1020,13 1100,6 1200,2"
          fill="none"
          stroke="#E8895A"
          strokeWidth="2.5"
          strokeOpacity="0.65"
          strokeLinecap="round"
        />
        <path
          d="M0,190 C80,185 180,172 300,152 C420,132 500,110 620,84 C720,62 800,42 920,26 C1020,13 1100,6 1200,2 L1200,200 L0,200 Z"
          fill="url(#og-fill)"
        />
        <circle cx="1200" cy="2" r="14" fill="#E8895A" fillOpacity="0.2" />
        <circle cx="1200" cy="2" r="5" fill="#E8895A" fillOpacity="0.9" />
      </svg>

      {/* Logo */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          marginBottom: 40,
        }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            backgroundColor: 'rgba(232,137,90,0.15)',
            border: '1px solid rgba(232,137,90,0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <polyline
              points="22 7 13.5 15.5 8.5 10.5 2 17"
              stroke="#E8895A"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <polyline
              points="16 7 22 7 22 13"
              stroke="#E8895A"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <span
          style={{
            fontSize: 22,
            fontWeight: 600,
            color: '#F4F4F5',
            letterSpacing: '-0.03em',
          }}
        >
          Budgetly
        </span>
      </div>

      {/* Headline */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <h1
          style={{
            margin: 0,
            fontSize: 56,
            fontFamily: 'var(--font-serif-display, Georgia, serif)',
            color: '#F4F4F5',
            lineHeight: 1.05,
            letterSpacing: '-0.025em',
            fontWeight: 400,
          }}
        >
          Controle financeiro pessoal,
          <br />
          <span style={{ color: '#E8895A' }}>do seu jeito.</span>
        </h1>

        <p
          style={{
            margin: '24px 0 0',
            fontSize: 26,
            color: '#71717A',
            letterSpacing: '-0.02em',
            lineHeight: 1.4,
            fontWeight: 400,
          }}
        >
          Contas, categorias, transações e relatórios — tudo em um só lugar.
        </p>
      </div>
    </div>
  )
}
