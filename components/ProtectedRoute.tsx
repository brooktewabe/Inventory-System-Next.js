'use client'

import { useAuth } from '@/hooks/useAuth'
import { hasPermission } from '@/lib/auth'
import UnauthorizedAccess from './UnauthorizedAccess'
import Spinner from './Spinner'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredPermissions?: string[]
}

export default function ProtectedRoute({ 
  children, 
  requiredPermissions = [] 
}: ProtectedRouteProps) {
  const { user, loading } = useAuth()

  if (loading) {
    return <Spinner />
  }

  if (!user) {
    return <UnauthorizedAccess />
  }

  if (requiredPermissions.length > 0 && !hasPermission(requiredPermissions)) {
    return <UnauthorizedAccess />
  }

  return <>{children}</>
}