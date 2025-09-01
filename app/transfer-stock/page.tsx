'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { toast } from 'react-toastify'
import { FaExchangeAlt, FaSearch } from 'react-icons/fa'
import Layout from '@/components/Layout'
import ProtectedRoute from '@/components/ProtectedRoute'
import Spinner from '@/components/Spinner'
import { useAuth } from '@/hooks/useAuth'
import api from '@/lib/axios'

const validationSchema = Yup.object({
  Product_id: Yup.string().required('Product is required'),
  Quantity: Yup.number().positive('Quantity must be positive').required('Quantity is required'),
  From_location: Yup.string().required('From location is required'),
  To_location: Yup.string().required('To location is required'),
  Reason: Yup.string().required('Reason is required'),
})

export default function TransferStockPage() {
  const router = useRouter()
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [searchTerm, setSearchTerm] = useState('')

  const { data: stockData, isLoading } = useQuery({
    queryKey: ['all-stock'],
    queryFn: async () => {
      const response = await api.get('/stock/all')
      return response.data
    }
  })

  const transferMutation = useMutation({
    mutationFn: async (data: any) => {
      return api.post('/stock/transfer', data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['warehouse-stock'] })
      queryClient.invalidateQueries({ queryKey: ['store-stock'] })
      queryClient.invalidateQueries({ queryKey: ['stock-movement'] })
      toast.success('Stock transferred successfully!')
      router.push('/stock-movement')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error transferring stock')
    }
  })

  const filteredStock = stockData?.filter((item: any) =>
    item.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.Product_id.toLowerCase().includes(searchTerm.toLowerCase())
  ) || []

  if (isLoading) {
    return (
      <Layout>
        <Spinner />
      </Layout>
    )
  }

  const initialValues = {
    Product_id: '',
    Quantity: '',
    From_location: '',
    To_location: '',
    Reason: '',
    Notes: '',
  }

  const handleSubmit = async (values: typeof initialValues, { setSubmitting, resetForm }: any) => {
    const transferData = {
      ...values,
      Quantity: parseInt(values.Quantity),
      Transferred_by: user?.name,
    }

    transferMutation.mutate(transferData)
    setSubmitting(false)
  }

  return (
    <Layout>
      <ProtectedRoute requiredPermissions={['inventory']}>
        <section className="bg-[#edf0f0b9] min-h-screen">
          <div className="container m-auto">
            <div className="grid grid-cols-1 gap-6">
              <div className="bg-white flex justify-between">
                <p className="text-lg sm:text-xl font-bold">Transfer Stock</p>
                <div className="flex flex-col items-center justify-center bg-blue-500 text-white rounded-lg w-32 mr-2">
                  <p className="font-semibold">{user?.name}</p>
                  <p className="text-xs">{user?.role}</p>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto">
                <div className="flex items-center gap-3 mb-6">
                  <FaExchangeAlt className="text-blue-600" size={24} />
                  <h2 className="text-xl font-semibold">Stock Transfer</h2>
                </div>

                <Formik
                  initialValues={initialValues}
                  validationSchema={validationSchema}
                  onSubmit={handleSubmit}
                >
                  {({ isSubmitting, values, setFieldValue }) => (
                    <Form>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium mb-1">Search Product</label>
                          <div className="relative mb-4">
                            <FaSearch className="absolute left-3 top-3 text-gray-400" size={16} />
                            <input
                              type="text"
                              placeholder="Search by product name or ID..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              className="w-full pl-10 py-2 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                          </div>
                          
                          <label className="block text-sm font-medium mb-1">Select Product</label>
                          <Field
                            as="select"
                            name="Product_id"
                            className="w-full py-2 px-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                          >
                            <option value="">Select product</option>
                            {filteredStock.map((item: any) => (
                              <option key={item.id} value={item.id}>
                                {item.Name} - {item.Product_id} (Stock: {item.Curent_stock})
                              </option>
                            ))}
                          </Field>
                          <ErrorMessage name="Product_id" component="div" className="text-red-500 text-sm mt-1" />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">From Location</label>
                          <Field
                            as="select"
                            name="From_location"
                            className="w-full py-2 px-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                          >
                            <option value="">Select location</option>
                            <option value="warehouse">Warehouse</option>
                            <option value="store">Store</option>
                          </Field>
                          <ErrorMessage name="From_location" component="div" className="text-red-500 text-sm mt-1" />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">To Location</label>
                          <Field
                            as="select"
                            name="To_location"
                            className="w-full py-2 px-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                          >
                            <option value="">Select location</option>
                            <option value="warehouse">Warehouse</option>
                            <option value="store">Store</option>
                          </Field>
                          <ErrorMessage name="To_location" component="div" className="text-red-500 text-sm mt-1" />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">Quantity</label>
                          <Field
                            name="Quantity"
                            type="number"
                            placeholder="Enter quantity to transfer"
                            className="w-full py-2 px-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                          <ErrorMessage name="Quantity" component="div" className="text-red-500 text-sm mt-1" />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">Reason</label>
                          <Field
                            as="select"
                            name="Reason"
                            className="w-full py-2 px-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                          >
                            <option value="">Select reason</option>
                            <option value="Restock">Restock</option>
                            <option value="Reorganization">Reorganization</option>
                            <option value="Demand">High Demand</option>
                            <option value="Other">Other</option>
                          </Field>
                          <ErrorMessage name="Reason" component="div" className="text-red-500 text-sm mt-1" />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium mb-1">Additional Notes</label>
                          <Field
                            as="textarea"
                            name="Notes"
                            rows="3"
                            placeholder="Enter additional notes (optional)"
                            className="w-full py-2 px-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
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
                          disabled={isSubmitting || transferMutation.isPending}
                          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
                        >
                          {isSubmitting || transferMutation.isPending ? 'Transferring...' : 'Transfer Stock'}
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