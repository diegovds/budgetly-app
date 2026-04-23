'use client'

import { useEffect } from 'react'
import { Toaster } from 'sonner'

export function AppToaster() {
  useEffect(() => {
    let rafId = 0
    let styleObserver: MutationObserver | null = null
    let bodyObserver: MutationObserver | null = null
    let resizeObserver: ResizeObserver | null = null
    let isApplying = false

    const applyPosition = () => {
      const main = document.querySelector('main')
      const toaster = document.querySelector(
        '[data-sonner-toaster]',
      ) as HTMLElement | null
      if (!main || !toaster || isApplying) return

      isApplying = true

      if (window.innerWidth < 768) {
        toaster.style.setProperty('left', '16px', 'important')
        toaster.style.setProperty('right', '16px', 'important')
        toaster.style.setProperty('bottom', '16px', 'important')
        toaster.style.setProperty('top', 'auto', 'important')
        toaster.style.setProperty('width', 'auto', 'important')
      } else {
        const rect = main.getBoundingClientRect()
        const paddingRight =
          parseFloat(getComputedStyle(main).paddingRight) || 0
        const viewportWidth = document.documentElement.clientWidth
        const rightOffset = Math.max(
          0,
          viewportWidth - rect.right + paddingRight,
        )

        toaster.style.setProperty('right', `${rightOffset}px`, 'important')
        toaster.style.setProperty('bottom', '24px', 'important')
        toaster.style.setProperty('left', 'auto', 'important')
        toaster.style.setProperty('top', 'auto', 'important')
        toaster.style.removeProperty('width')
      }

      requestAnimationFrame(() => {
        isApplying = false
      })
    }

    const scheduleApply = () => {
      cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(applyPosition)
    }

    const attachObservers = () => {
      const toaster = document.querySelector('[data-sonner-toaster]')
      const main = document.querySelector('main')
      if (!toaster || !main) return false

      styleObserver = new MutationObserver(scheduleApply)
      styleObserver.observe(toaster, {
        attributes: true,
        attributeFilter: ['style'],
      })

      resizeObserver = new ResizeObserver(scheduleApply)
      resizeObserver.observe(main)

      applyPosition()
      return true
    }

    if (!attachObservers()) {
      bodyObserver = new MutationObserver(() => {
        if (attachObservers()) {
          bodyObserver?.disconnect()
          bodyObserver = null
        }
      })
      bodyObserver.observe(document.body, { childList: true, subtree: true })
    }

    window.addEventListener('resize', scheduleApply)
    window.addEventListener('scroll', scheduleApply, { passive: true })

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', scheduleApply)
      window.removeEventListener('scroll', scheduleApply)
      styleObserver?.disconnect()
      bodyObserver?.disconnect()
      resizeObserver?.disconnect()
    }
  }, [])

  return (
    <Toaster
      theme="dark"
      position="bottom-right"
      gap={8}
      toastOptions={{
        style: {
          background: 'oklch(0.20 0.008 285.885)',
          border: '1px solid oklch(1 0 0 / 10%)',
          borderRadius: '0.75rem',
          boxShadow:
            '0 8px 40px oklch(0 0 0 / 50%), 0 1px 0 oklch(1 0 0 / 6%) inset',
          color: 'oklch(0.985 0 0)',
          fontSize: '13px',
          fontFamily: 'var(--font-poppins, sans-serif)',
        },
      }}
    />
  )
}
