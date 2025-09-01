'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { toast } from 'react-toastify'
import { FaArrowLeft, FaInfoCircle } from 'react-icons/fa'
import Layout from '@/components/Layout'
import ProtectedRoute from '@/components/ProtectedRoute'
import Spinner from '@/components/Spinner'
import { useAuth } from '@/hooks/useAuth'
import api from '@/lib/axios'

const validationSchema = Yup.object({
  Quantity: Yup.number().positive('Quantity must be positive').required('Quantity is required'),
  Reason: Yup.string().required('Reason is required'),
})

export default function ReturnProductPage() {
  const router = useRouter()
  const params = useParams()
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', params.id],
    queryFn: async () => {
      const response = await api.get(`/stock/all/${params.id}`)
      return response.data
    }
  })

  const returnMutation = useMutation({
    mutationFn: async (data: any) => {
      return api.post('/stock/return', data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['store-stock'] })
      queryClient.invalidateQueries({ queryKey: ['warehouse-stock'] })
      toast.success('Product returned successfully!')
      router.back()
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error returning product')
    }
  })

  if (isLoading) {
    return (
      <Layout>
        <Spinner />
      </Layout>
    )
  }

  if (!product) {
    return (
      <Layout>
        <div className="text-center py-8">Product not found</div>
      </Layout>
    )
  }

  const initialValues = {
    Quantity: '',
    Reason: '',
    Notes: '',
  }

  const handleSubmit = async (values: typeof initialValues, { setSubmitting }: any) => {
    const returnData = {
      Product_id: product.id,
      Quantity: parseInt(values.Quantity),
      Reason: values.Reason,
      Notes: values.Notes,
      Returned_by: user?.name,
    }

    returnMutation.mutate(returnData)
    setSubmitting(false)
  }

  return (
    <Layout>
      <ProtectedRoute requiredPermissions={['store', 'inventory']}>
        <section className="bg-[#edf0f0b9] min-h-screen">
          <div className="container m-auto">
            <div className="grid grid-cols-1 gap-6">
              <div className="bg-white flex justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => router.back()}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <FaArrowLeft size={20} />
                  </button>
                  <p className="text-lg sm:text-xl font-bold">Return Product</p>
                </div>
                <div className="flex flex-col items-center justify-center bg-blue-500 text-white rounded-lg w-32 mr-2">
                  <p className="font-semibold">{user?.name}</p>
                  <p className="text-xs">{user?.role}</p>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto">
                <div className="flex items-center mb-6 pb-2 border-b">
                  <FaInfoCircle className="text-blue-600 mr-2" />
                  <h2 className="text-lg font-medium">Product Return</h2>
                </div>

                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold mb-2">Product Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p><span className="font-medium">Name:</span> {product.Name}</p>
                      <p><span className="font-medium">Category:</span> {product.Category}</p>
                      <p><span className="font-medium">Price:</span> {product.Price} ETB</p>
                    </div>
                    <div>
                      <p><span className="font-medium">Current Stock:</span> {product.Curent_stock}</p>
                      <p><span className="font-medium">Location:</span> {product.Location}</p>
                    </div>
                  </div>
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
                          <label className="block text-sm font-medium mb-1">Quantity to Return</label>
                          <Field
                            name="Quantity"
                            type="number"
                            placeholder="Enter quantity"
                            className="w-full py-2 px-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                          <ErrorMessage name="Quantity" component="div" className="text-red-500 text-sm mt-1" />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">Reason for Return</label>
                          <Field
                            as="select"
                            name="Reason"
                            className="w-full py-2 px-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                          >
                            <option value="">Select reason</option>
                            <option value="Damaged">Damaged</option>
                            <option value="Expired">Expired</option>
                            <option value="Customer Return">Customer Return</option>
                            <option value="Wrong Item">Wrong Item</option>
                            <option value="Other">Other</option>
                          </Field>
                          <ErrorMessage name="Reason" component="div" className="text-red-500 text-sm mt-1" />
                        </div>
                      </div>

                      <div className="mt-6">
                        <label className="block text-sm font-medium mb-1">Additional Notes</label>
                        <Field
                          as="textarea"
                          name="Notes"
                          rows="3"
                          placeholder="Enter additional notes (optional)"
                          className="w-full py-2 px-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
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
                          disabled={isSubmitting || returnMutation.isPending}
                          className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition disabled:opacity-50"
                        >
                          {isSubmitting || returnMutation.isPending ? 'Processing...' : 'Process Return'}
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