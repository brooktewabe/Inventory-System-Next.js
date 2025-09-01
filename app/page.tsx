'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import Layout from '@/components/Layout'
import Dashboard from './dashboard/page'
import Spinner from '@/components/Spinner'

export default function HomePage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading) {
    return <Spinner />
  }

  if (!user) {
    return <Spinner />
  }

  return (
    <Layout>
      <Dashboard />
    </Layout>
  )
}