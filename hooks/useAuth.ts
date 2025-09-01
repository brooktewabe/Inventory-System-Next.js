'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getAuthData, clearAuthData, type User } from '@/lib/auth'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const authData = getAuthData()
    setUser(authData)
    setLoading(false)
  }, [])

  const logout = async () => {
    try {
      clearAuthData()
      setUser(null)
      router.push('/login')
      router.refresh()
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const login = (authData: User & { jwt: string }) => {
    setUser(authData)
  }

  return {
    user,
    loading,
    logout,
    login,
    isAuthenticated: !!user
  }
}