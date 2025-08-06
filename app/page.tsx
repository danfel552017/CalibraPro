'use client'

import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { useEffect } from 'react'
import LoadingSpinner from '@/components/ui/loading-spinner'

export default function HomePage() {
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === 'loading') return // Still loading

    if (!session) {
      redirect('/auth/signin')
    } else {
      redirect('/dashboard')
    }
  }, [session, status])

  if (status === 'loading') {
    return <LoadingSpinner />
  }

  return null
}