'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { toast } from 'react-toastify'
import { AiOutlineMail } from 'react-icons/ai'
import api from '@/lib/axios'

const validationSchema = Yup.object({
  email: Yup.string().email('Invalid email format').required('Email is required'),
})

export default function ForgotPasswordPage() {
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (values: { email: string }, { setSubmitting }: any) => {
    try {
      await api.post('/forgot-password', values)
      setIsSubmitted(true)
      toast.success('Password reset instructions sent to your email')
    } catch (error: any) {
      console.error('Forgot password error:', error)
      toast.error(error.response?.data?.message || 'Error sending reset instructions')
    } finally {
      setSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#edf0f0] p-4">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-md text-center">
          <div className="mb-6">
            <AiOutlineMail size={64} className="mx-auto text-blue-600 mb-4" />
            <h2 className="font-bold text-2xl text-gray-800 mb-2">Check Your Email</h2>
            <p className="text-sm text-gray-500">
              We've sent password reset instructions to your email address.
            </p>
          </div>
          <Link
            href="/login"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 font-semibold inline-block"
          >
            Back to Login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center h-screen bg-[#edf0f0] p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-md">
        <div className="mb-6">
          <h2 className="font-bold text-2xl text-gray-800">Forgot Password</h2>
          <p className="text-sm text-gray-500">Enter your email to reset your password</p>
        </div>

        <Formik
          initialValues={{ email: '' }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="mb-6">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 bg-white">
                  <AiOutlineMail size={20} className="text-gray-500 mr-2" />
                  <Field
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    className="w-full bg-transparent text-gray-800 outline-none text-sm"
                  />
                </div>
                <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 font-semibold disabled:opacity-50"
              >
                {isSubmitting ? 'Sending...' : 'Send Reset Instructions'}
              </button>

              <div className="text-center mt-4">
                <Link
                  href="/login"
                  className="text-blue-600 hover:underline font-medium text-sm"
                >
                  Back to Login
                </Link>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  )
}