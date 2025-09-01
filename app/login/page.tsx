'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { BiShow, BiHide } from 'react-icons/bi'
import { toast } from 'react-toastify'
import * as Yup from 'yup'
import Link from 'next/link'
import { AiOutlineUser, AiFillSecurityScan } from 'react-icons/ai'
import api from '@/lib/axios'
import { setAuthData } from '@/lib/auth'
import { useAuth } from '@/hooks/useAuth'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      const response = await api.post('/login', {
        email,
        password,
      })

      const authData = {
        jwt: response.data.jwt,
        role: response.data.role,
        name: response.data.name,
        id: response.data.id,
        permissions: response.data.permissions
      }

      setAuthData(authData)
      login(authData)

      setEmail('')
      setPassword('')
      
      router.push('/')
      router.refresh()
    } catch (error: any) {
      console.error('Login error:', error.response ? error.response.data : error)
      toast.error('Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  const validateForm = () => {
    const schema = Yup.object().shape({
      email: Yup.string().required('Email is required'),
      password: Yup.string().required('Password is required').min(8, 'Password must be at least 8 characters'),
    })

    try {
      schema.validateSync({ email, password }, { abortEarly: false })
      setErrors({})
      return true
    } catch (error: any) {
      const newErrors: Record<string, string> = {}
      error.inner.forEach((err: any) => {
        newErrors[err.path] = err.message
      })
      setErrors(newErrors)
      return false
    }
  }

  return (
    <div className="flex items-center justify-center h-screen bg-[#edf0f0] p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-md">
        <div className="mb-6">
          <p className="font-bold text-2xl text-gray-800">Login</p>
          <p className="text-sm text-gray-500">Hello - Login to your panel</p>
        </div>
        {errors.login && <div className="text-red-500 text-sm text-center mb-4">{errors.login}</div>}
        <form onSubmit={handleSubmit}>
          {/* Username */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 bg-white">
              <AiOutlineUser size={20} className="text-gray-500 mr-2" />
              <input
                id="email"
                name="email"
                type="text"
                placeholder="Enter username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full bg-transparent text-gray-800 outline-none text-sm ${
                  errors.email ? "border-red-500" : ""
                }`}
              />
            </div>
            {errors.email && <div className="text-red-500 text-sm mt-1">{errors.email}</div>}
          </div>

          {/* Password */}
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative flex items-center border border-gray-300 rounded-md px-3 py-2 bg-white">
              <AiFillSecurityScan size={20} className="text-gray-500 mr-2" />
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full bg-transparent text-gray-800 outline-none text-sm ${
                  errors.password ? "border-red-500" : ""
                }`}
              />
              <button
                type="button"
                className="absolute right-3 text-gray-400 hover:text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <BiHide /> : <BiShow />}
              </button>
            </div>
            {errors.password && <div className="text-red-500 text-sm mt-1">{errors.password}</div>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 font-semibold disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
          
          {/* Forgot Password Link */}
          <div className="text-center mt-4">
            <p className="text-sm text-gray-500">
              Forgot your password?{" "}
              <Link
                href="/forgot-password"
                className="text-blue-600 hover:underline font-medium"
              >
                Reset here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}