'use client'

import { useRouter } from 'next/navigation'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { toast } from 'react-toastify'
import { FaUser, FaPhone } from 'react-icons/fa'
import Layout from '@/components/Layout'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useAuth } from '@/hooks/useAuth'
import api from '@/lib/axios'

const validationSchema = Yup.object({
  Full_name: Yup.string().required('Full name is required'),
  Contact: Yup.string().required('Contact is required'),
  Email: Yup.string().email('Invalid email format'),
  Address: Yup.string(),
})

export default function AddCustomerPage() {
  const router = useRouter()
  const { user } = useAuth()

  const initialValues = {
    Full_name: '',
    Contact: '',
    Email: '',
    Address: '',
  }

  const handleSubmit = async (values: typeof initialValues, { setSubmitting, resetForm }: any) => {
    try {
      await api.post('/customers/create', values)
      toast.success('Customer added successfully!')
      resetForm()
      router.push('/customers-list')
    } catch (error: any) {
      console.error('Error adding customer:', error)
      toast.error(error.response?.data?.message || 'Error adding customer')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Layout>
      <ProtectedRoute requiredPermissions={['cms']}>
        <section className="bg-[#edf0f0b9] min-h-screen">
          <div className="container m-auto">
            <div className="grid grid-cols-1 gap-6">
              <div className="bg-white flex justify-between">
                <p className="text-lg sm:text-xl font-bold">Add Customer</p>
                <div className="flex flex-col items-center justify-center bg-blue-500 text-white rounded-lg w-32 mr-2">
                  <p className="font-semibold">{user?.name}</p>
                  <p className="text-xs">{user?.role}</p>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
                <div className="flex items-center gap-3 mb-6">
                  <FaUser className="text-blue-600" size={24} />
                  <h2 className="text-xl font-semibold">Customer Information</h2>
                </div>

                <Formik
                  initialValues={initialValues}
                  validationSchema={validationSchema}
                  onSubmit={handleSubmit}
                >
                  {({ isSubmitting }) => (
                    <Form>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium mb-1">Full Name *</label>
                          <Field
                            name="Full_name"
                            type="text"
                            placeholder="Enter full name"
                            className="w-full py-2 px-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                          <ErrorMessage name="Full_name" component="div" className="text-red-500 text-sm mt-1" />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">Contact *</label>
                          <Field
                            name="Contact"
                            type="text"
                            placeholder="Enter phone number"
                            className="w-full py-2 px-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                          <ErrorMessage name="Contact" component="div" className="text-red-500 text-sm mt-1" />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">Email</label>
                          <Field
                            name="Email"
                            type="email"
                            placeholder="Enter email address"
                            className="w-full py-2 px-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                          <ErrorMessage name="Email" component="div" className="text-red-500 text-sm mt-1" />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">Address</label>
                          <Field
                            name="Address"
                            type="text"
                            placeholder="Enter address"
                            className="w-full py-2 px-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                          <ErrorMessage name="Address" component="div" className="text-red-500 text-sm mt-1" />
                        </div>
                      </div>

                      <div className="flex justify-end space-x-4 mt-8">
                        <button
                          type="button"
                          onClick={() => router.back()}
                          className="border border-gray-400 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-100 transition"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
                        >
                          {isSubmitting ? 'Adding...' : 'Add Customer'}
                        </button>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </div>
        </section>
      </ProtectedRoute>
    </Layout>
  )
}