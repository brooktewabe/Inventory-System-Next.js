'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import Swal from 'sweetalert2'
import { toast } from 'react-toastify'
import { FaUpload, FaTimes, FaInfoCircle } from 'react-icons/fa'
import Layout from '@/components/Layout'
import ProtectedRoute from '@/components/ProtectedRoute'
import Spinner from '@/components/Spinner'
import { useAuth } from '@/hooks/useAuth'
import api from '@/lib/axios'

const validationSchema = Yup.object({
  Full_name: Yup.string().required('Full name is required'),
  Contact: Yup.string().required('Contact is required'),
  Quantity: Yup.number().positive('Quantity must be positive').required('Quantity is required'),
  Payment_method: Yup.string().required('Payment method is required'),
})

export default function RecordSalePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  
  const productId = searchParams.get('id')

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', productId],
    queryFn: async () => {
      const response = await api.get(`/stock/all/${productId}`)
      return response.data
    },
    enabled: !!productId
  })

  const recordSaleMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      return api.post('/sales/create', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['store-stock'] })
      queryClient.invalidateQueries({ queryKey: ['sales-history'] })
      toast.success('Sale recorded successfully!')
      router.push('/sales')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error recording sale')
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
    Full_name: '',
    Contact: '',
    Quantity: '',
    Payment_method: '',
    Transaction_id: '',
    Receipt: null as File | null,
    Sale_type: 'Single',
  }

  const handleSubmit = async (values: typeof initialValues, { setSubmitting }: any) => {
    const quantity = parseInt(values.Quantity)
    const newStock = product.Curent_stock - quantity

    if (newStock < 0) {
      Swal.fire({
        title: 'Error!',
        text: 'Insufficient stock available.',
        icon: 'error',
        confirmButtonColor: '#d33',
      })
      setSubmitting(false)
      return
    }

    const formData = new FormData()
    formData.append('Product_id', product.id)
    formData.append('Full_name', values.Full_name)
    formData.append('Contact', values.Contact)
    formData.append('Quantity', values.Quantity)
    formData.append('Total_amount', (quantity * product.Price).toString())
    formData.append('Payment_method', values.Payment_method)
    formData.append('Transaction_id', values.Transaction_id)
    formData.append('Sale_type', values.Sale_type)
    
    if (values.Receipt) {
      formData.append('Receipt', values.Receipt)
    }

    try {
      await recordSaleMutation.mutateAsync(formData)
      
      // Update stock
      await api.patch(`/stock/all/sale/${product.id}`, {
        Curent_stock: newStock,
        Name: product.Name,
      })

      // Check for low stock notification
      if (newStock < product.Restock_level) {
        await api.post('/notification/create', {
          message: `${product.Name} is running low on stock.`,
          priority: 'High',
        })
      }
    } catch (error) {
      console.error('Error recording sale:', error)
    }
    
    setSubmitting(false)
  }

  return (
    <Layout>
      <ProtectedRoute requiredPermissions={['store']}>
        <section className="bg-[#edf0f0b9] min-h-screen">
          <div className="container m-auto">
            <div className="grid grid-cols-1 gap-6">
              <div className="bg-white flex justify-between">
                <p className="text-lg sm:text-xl font-bold">Record Sale</p>
                <div className="flex flex-col items-center justify-center bg-blue-500 text-white rounded-lg w-32 mr-2">
                  <p className="font-semibold">{user?.name}</p>
                  <p className="text-xs">{user?.role}</p>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto">
                <div className="flex items-center mb-6 pb-2 border-b">
                  <FaInfoCircle className="text-blue-600 mr-2" />
                  <h2 className="text-lg font-medium">Point of Sale</h2>
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
                      <p><span className="font-medium">Available Stock:</span> {product.Curent_stock}</p>
                      <p><span className="font-medium">Unit:</span> {product.Unit}</p>
                    </div>
                  </div>
                </div>

                <Formik
                  initialValues={initialValues}
                  validationSchema={validationSchema}
                  onSubmit={handleSubmit}
                >
                  {({ isSubmitting, setFieldValue, values }) => (
                    <Form>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium mb-1">Full Name</label>
                          <Field
                            name="Full_name"
                            type="text"
                            placeholder="Enter customer name"
                            className="w-full py-2 px-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                          <ErrorMessage name="Full_name" component="div" className="text-red-500 text-sm mt-1" />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">Contact</label>
                          <Field
                            name="Contact"
                            type="text"
                            placeholder="Enter phone number"
                            className="w-full py-2 px-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                          <ErrorMessage name="Contact" component="div" className="text-red-500 text-sm mt-1" />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">Quantity</label>
                          <Field
                            name="Quantity"
                            type="number"
                            placeholder="Enter quantity"
                            className="w-full py-2 px-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                          <ErrorMessage name="Quantity" component="div" className="text-red-500 text-sm mt-1" />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">Total Amount</label>
                          <input
                            type="number"
                            value={values.Quantity ? (parseInt(values.Quantity) * product.Price).toFixed(2) : '0.00'}
                            readOnly
                            className="w-full py-2 px-3 bg-gray-100 border border-gray-200 rounded-md"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">Payment Method</label>
                          <Field
                            as="select"
                            name="Payment_method"
                            className="w-full py-2 px-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                          >
                            <option value="">Select payment method</option>
                            <option value="Cash">Cash</option>
                            <option value="Bank Transfer">Bank Transfer</option>
                            <option value="Tele Birr">Tele Birr</option>
                            <option value="E Birr">E Birr</option>
                            <option value="Other">Other</option>
                          </Field>
                          <ErrorMessage name="Payment_method" component="div" className="text-red-500 text-sm mt-1" />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">Transaction ID</label>
                          <Field
                            name="Transaction_id"
                            type="text"
                            placeholder="Enter transaction ID (optional)"
                            className="w-full py-2 px-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </div>
                      </div>

                      <div className="mt-6">
                        <label className="block text-sm font-medium mb-1">Receipt (Optional)</label>
                        <div className="flex items-center gap-4">
                          <input
                            type="file"
                            id="Receipt"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0]
                              if (file) {
                                setFieldValue('Receipt', file)
                                const reader = new FileReader()
                                reader.onload = () => setImagePreview(reader.result as string)
                                reader.readAsDataURL(file)
                              }
                            }}
                            className="hidden"
                          />
                          <label
                            htmlFor="Receipt"
                            className="flex items-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-md cursor-pointer hover:bg-blue-700 transition-colors"
                          >
                            <FaUpload size={16} />
                            Upload Receipt
                          </label>
                          
                          {imagePreview && (
                            <div className="flex items-center gap-2">
                              <img 
                                src={imagePreview} 
                                alt="Receipt preview" 
                                className="w-20 h-20 object-cover border border-gray-200 rounded-md cursor-pointer"
                                onClick={() => window.open(imagePreview, '_blank')}
                              />
                              <button 
                                type="button"
                                onClick={() => {
                                  setImagePreview(null)
                                  setFieldValue('Receipt', null)
                                }}
                                className="text-red-500 hover:text-red-700"
                              >
                                <FaTimes size={16} />
                              </button>
                            </div>
                          )}
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
                          disabled={isSubmitting || recordSaleMutation.isPending}
                          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
                        >
                          {isSubmitting || recordSaleMutation.isPending ? 'Recording...' : 'Record Sale'}
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