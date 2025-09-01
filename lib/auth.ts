import Cookies from 'js-cookie'

export interface User {
  id: string
  name: string
  role: string
  permissions: string[]
}

export const getAuthData = (): User | null => {
  if (typeof window === 'undefined') return null
  
  const token = Cookies.get('jwt')
  const role = localStorage.getItem('role')
  const name = localStorage.getItem('name')
  const uid = localStorage.getItem('uid')
  const permissions = localStorage.getItem('permissions')
  
  if (!token || !role || !name || !uid) return null
  
  return {
    id: uid,
    name,
    role,
    permissions: permissions ? permissions.split(',') : []
  }
}

export const setAuthData = (data: {
  jwt: string
  role: string
  name: string
  id: string
  permissions: string[]
}) => {
  Cookies.set('jwt', data.jwt, { expires: 1 })
  localStorage.setItem('role', data.role)
  localStorage.setItem('name', data.name)
  localStorage.setItem('uid', data.id)
  localStorage.setItem('permissions', data.permissions.join(','))
}

export const clearAuthData = () => {
  Cookies.remove('jwt')
  localStorage.removeItem('role')
  localStorage.removeItem('name')
  localStorage.removeItem('uid')
  localStorage.removeItem('permissions')
}

export const hasPermission = (requiredPermissions: string[]): boolean => {
  const user = getAuthData()
  if (!user) return false
  
  return requiredPermissions.some(permission => 
    user.permissions.includes(permission)
  )
}