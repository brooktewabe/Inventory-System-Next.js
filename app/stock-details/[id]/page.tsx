'use client'

import { useRouter, useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { FaArrowLeft, FaEdit } from 'react-icons/fa'
import Layout from '@/components/Layout'
import ProtectedRoute from '@/components/ProtectedRoute'
import Spinner from '@/components/Spinner'
import { useAuth } from '@/hooks/useAuth'
import api from '@/lib/axios'

export default function StockDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const { user } = useAuth()

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', params.id],
    queryFn: async () => {
      const response = await api.get(`/stock/all/${params.id}`)
      return response.data
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

  return (
    <Layout>
      <ProtectedRoute requiredPermissions={['inventory', 'store']}>
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
                  <p className="text-lg sm:text-xl font-bold">Product Details</p>
                </div>
                <div className="flex flex-col items-center justify-center bg-blue-500 text-white rounded-lg w-32 mr-2">
                  <p className="font-semibold">{user?.name}</p>
                  <p className="text-xs">{user?.role}</p>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <img
                      src={product.Product_image ? `http://localhost:5000/uploads/${product.Product_image}` : '/placeholder.png'}
                      alt={product.Name}
                      className="w-full h-64 object-cover rounded-lg border border-gray-200"
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Product ID</label>
                      <p className="text-lg font-semibold">{product.Product_id}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Product Name</label>
                      <p className="text-lg font-semibold">{product.Name}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Category</label>
                      <p className="text-lg">{product.Category}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Price</label>
                      <p className="text-lg font-semibold text-green-600">{product.Price} ETB</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Current Stock</label>
                        <p className="text-lg font-semibold">{product.Curent_stock}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Restock Level</label>
                        <p className="text-lg">{product.Restock_level}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Unit</label>
                        <p className="text-lg">{product.Unit}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Location</label>
                        <p className="text-lg capitalize">{product.Location}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-4 mt-8">
                  <button
                    onClick={() => router.back()}
                    className="border border-gray-400 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-100 transition"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => router.push(`/edit-product/${product.id}`)}
                    className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition flex items-center gap-2"
                  >
                    <FaEdit size={16} />
                    Edit Product
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </ProtectedRoute>
    </Layout>
  )
}