'use client'

import { ErrorPage } from '@/components/error-page'
import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <ErrorPage message={error.message} digest={error.digest} reset={reset} />
  )
}
