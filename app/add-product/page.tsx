'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { toast } from 'react-toastify'
import { FaUpload, FaTimes } from 'react-icons/fa'
import Layout from '@/components/Layout'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useAuth } from '@/hooks/useAuth'
import api from '@/lib/axios'

const validationSchema = Yup.object({
  Product_id: Yup.string().required('Product ID is required'),
  Name: Yup.string().required('Product name is required'),
  Category: Yup.string().required('Category is required'),
  Price: Yup.number().positive('Price must be positive').required('Price is required'),
  Curent_stock: Yup.number().min(0, 'Stock cannot be negative').required('Stock is required'),
  Restock_level: Yup.number().min(0, 'Restock level cannot be negative').required('Restock level is required'),
  Unit: Yup.string().required('Unit is required'),
  Location: Yup.string().required('Location is required'),
})

export default function AddProductPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const initialValues = {
    Product_id: '',
    Name: '',
    Category: '',
    Price: '',
    Curent_stock: '',
    Restock_level: '',
    Unit: '',
    Location: '',
    Product_image: null as File | null,
  }

  const handleSubmit = async (values: typeof initialValues, { setSubmitting, resetForm }: any) => {
    try {
      const formData = new FormData()
      Object.entries(values).forEach(([key, value]) => {
        if (value !== null) {
          formData.append(key, value as string)
        }
      })

      await api.post('/stock/create', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      await api.post('/notification/create', {
        message: `${values.Name} is added to inventory.`,
        priority: 'Medium',
      })

      toast.success('Product added successfully!')
      resetForm()
      setImagePreview(null)
      router.push('/warehouse')
    } catch (error: any) {
      console.error('Error adding product:', error)
      if (error.response?.data?.message) {
        toast.error(error.response.data.message)
      } else {
        toast.error('Error adding product. Please try again.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Layout>
      <ProtectedRoute requiredPermissions={['add']}>
        <section className="bg-[#edf0f0b9] min-h-screen">
          <div className="container m-auto">
            <div className="grid grid-cols-1 gap-6">
              <div className="bg-white flex justify-between">
                <p className="text-lg sm:text-xl font-bold">Add Product</p>
                <div className="flex flex-col items-center justify-center bg-blue-500 text-white rounded-lg w-32 mr-2">
                  <p className="font-semibold">{user?.name}</p>
                  <p className="text-xs">{user?.role}</p>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto">
                <Formik
                  initialValues={initialValues}
                  validationSchema={validationSchema}
                  onSubmit={handleSubmit}
                >
                  {({ isSubmitting, setFieldValue, values }) => (
                    <Form>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium mb-1">Product ID</label>
                          <Field
                            name="Product_id"
                            type="text"
                            placeholder="Enter product ID"
                            className="w-full py-2 px-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                          <ErrorMessage name="Product_id" component="div" className="text-red-500 text-sm mt-1" />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">Product Name</label>
                          <Field
                            name="Name"
                            type="text"
                            placeholder="Enter product name"
                            className="w-full py-2 px-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                          <ErrorMessage name="Name" component="div" className="text-red-500 text-sm mt-1" />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">Category</label>
                          <Field
                            name="Category"
                            type="text"
                            placeholder="Enter category"
                            className="w-full py-2 px-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                          <ErrorMessage name="Category" component="div" className="text-red-500 text-sm mt-1" />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">Price</label>
                          <Field
                            name="Price"
                            type="number"
                            step="0.01"
                            placeholder="Enter price"
                            className="w-full py-2 px-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                          <ErrorMessage name="Price" component="div" className="text-red-500 text-sm mt-1" />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">Current Stock</label>
                          <Field
                            name="Curent_stock"
                            type="number"
                            placeholder="Enter current stock"
                            className="w-full py-2 px-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                          <ErrorMessage name="Curent_stock" component="div" className="text-red-500 text-sm mt-1" />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">Restock Level</label>
                          <Field
                            name="Restock_level"
                            type="number"
                            placeholder="Enter restock level"
                            className="w-full py-2 px-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                          <ErrorMessage name="Restock_level" component="div" className="text-red-500 text-sm mt-1" />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">Unit</label>
                          <Field
                            name="Unit"
                            type="text"
                            placeholder="Enter unit (e.g., pcs, kg, liter)"
                            className="w-full py-2 px-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                          <ErrorMessage name="Unit" component="div" className="text-red-500 text-sm mt-1" />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">Location</label>
                          <Field
                            as="select"
                            name="Location"
                            className="w-full py-2 px-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                          >
                            <option value="">Select location</option>
                            <option value="store">Store</option>
                            <option value="warehouse">Warehouse</option>
                          </Field>
                          <ErrorMessage name="Location" component="div" className="text-red-500 text-sm mt-1" />
                        </div>
                      </div>

                      <div className="mt-6">
                        <label className="block text-sm font-medium mb-1">Product Image</label>
                        <div className="flex items-center gap-4">
                          <input
                            type="file"
                            id="Product_image"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0]
                              if (file) {
                                setFieldValue('Product_image', file)
                                const reader = new FileReader()
                                reader.onload = () => setImagePreview(reader.result as string)
                                reader.readAsDataURL(file)
                              }
                            }}
                            className="hidden"
                          />
                          <label
                            htmlFor="Product_image"
                            className="flex items-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-md cursor-pointer hover:bg-blue-700 transition-colors"
                          >
                            <FaUpload size={16} />
                            Upload Image
                          </label>
                          
                          {imagePreview && (
                            <div className="flex items-center gap-2">
                              <img 
                                src={imagePreview} 
                                alt="Preview" 
                                className="w-20 h-20 object-cover border border-gray-200 rounded-md"
                              />
                              <button 
                                type="button"
                                onClick={() => {
                                  setImagePreview(null)
                                  setFieldValue('Product_image', null)
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
                          disabled={isSubmitting}
                          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
                        >
                          {isSubmitting ? 'Adding...' : 'Add Product'}
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