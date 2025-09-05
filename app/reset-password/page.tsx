'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { toast } from 'react-toastify'
import { AiFillSecurityScan } from 'react-icons/ai'
import { BiShow, BiHide } from 'react-icons/bi'
import api from '@/lib/axios'

const validationSchema = Yup.object({
  password: Yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
})

export default function ResetPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const tokenParam = searchParams.get('token')
    if (!tokenParam) {
      toast.error('Invalid reset link')
      router.push('/login')
    } else {
      setToken(tokenParam)
    }
  }, [searchParams, router])

  const handleSubmit = async (values: { password: string; confirmPassword: string }, { setSubmitting }: any) => {
    if (!token) return

    try {
      await api.post('/reset-password', {
        token,
        password: values.password,
      })
      toast.success('Password reset successfully!')
      router.push('/login')
    } catch (error: any) {
      console.error('Reset password error:', error)
      toast.error(error.response?.data?.message || 'Error resetting password')
    } finally {
      setSubmitting(false)
    }
  }

  if (!token) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex items-center justify-center h-screen bg-[#edf0f0] p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-md">
        <div className="mb-6">
          <h2 className="font-bold text-2xl text-gray-800">Reset Password</h2>
          <p className="text-sm text-gray-500">Enter your new password</p>
        </div>

        <Formik
          initialValues={{ password: '', confirmPassword: '' }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <div className="relative flex items-center border border-gray-300 rounded-md px-3 py-2 bg-white">
                  <AiFillSecurityScan size={20} className="text-gray-500 mr-2" />
                  <Field
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    className="w-full bg-transparent text-gray-800 outline-none text-sm"
                  />
                  <button
                    type="button"
                    className="absolute right-3 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <BiHide /> : <BiShow />}
                  </button>
                </div>
                <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <div className="relative flex items-center border border-gray-300 rounded-md px-3 py-2 bg-white">
                  <AiFillSecurityScan size={20} className="text-gray-500 mr-2" />
                  <Field
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    className="w-full bg-transparent text-gray-800 outline-none text-sm"
                  />
                  <button
                    type="button"
                    className="absolute right-3 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <BiHide /> : <BiShow />}
                  </button>
                </div>
                <ErrorMessage name="confirmPassword" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 font-semibold disabled:opacity-50"
              >
                {isSubmitting ? 'Resetting...' : 'Reset Password'}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  )
}