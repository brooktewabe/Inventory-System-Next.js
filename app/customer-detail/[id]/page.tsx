'use client'

import { useRouter, useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { FaArrowLeft, FaUser, FaPhone, FaShoppingCart, FaCalendar } from 'react-icons/fa'
import Layout from '@/components/Layout'
import ProtectedRoute from '@/components/ProtectedRoute'
import Spinner from '@/components/Spinner'
import { useAuth } from '@/hooks/useAuth'
import api from '@/lib/axios'

export default function CustomerDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { user } = useAuth()

  const { data: customer, isLoading } = useQuery({
    queryKey: ['customer', params.id],
    queryFn: async () => {
      const response = await api.get(`/customers/${params.id}`)
      return response.data
    }
  })

  const { data: purchases } = useQuery({
    queryKey: ['customer-purchases', params.id],
    queryFn: async () => {
      const response = await api.get(`/customers/${params.id}/purchases`)
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

  if (!customer) {
    return (
      <Layout>
        <div className="text-center py-8">Customer not found</div>
      </Layout>
    )
  }

  return (
    <Layout>
      <ProtectedRoute requiredPermissions={['cms']}>
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
                  <p className="text-lg sm:text-xl font-bold">Customer Details</p>
                </div>
                <div className="flex flex-col items-center justify-center bg-blue-500 text-white rounded-lg w-32 mr-2">
                  <p className="font-semibold">{user?.name}</p>
                  <p className="text-xs">{user?.role}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Customer Info */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="bg-blue-600 text-white p-3 rounded-full">
                      <FaUser size={24} />
                    </div>
                    <h2 className="text-xl font-semibold">Customer Information</h2>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <FaUser className="text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-600">Full Name</p>
                        <p className="font-semibold">{customer.Full_name}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <FaPhone className="text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-600">Contact</p>
                        <p className="font-semibold">{customer.Contact}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <FaShoppingCart className="text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-600">Total Purchases</p>
                        <p className="font-semibold">{customer.Total_purchases}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <FaCalendar className="text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-600">Last Purchase</p>
                        <p className="font-semibold">
                          {customer.Last_purchase ? new Date(customer.Last_purchase).toLocaleDateString() : 'N/A'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t">
                      <p className="text-sm text-gray-600">Total Amount Spent</p>
                      <p className="text-2xl font-bold text-green-600">{customer.Total_amount} ETB</p>
                    </div>
                  </div>
                </div>

                {/* Purchase History */}
                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
                  <h2 className="text-xl font-semibold mb-6">Purchase History</h2>
                  
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Items</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {purchases?.map((purchase: any) => (
                          <tr key={purchase.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                              {new Date(purchase.Created_at).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900">
                              <div className="max-w-xs truncate" title={purchase.Item_List}>
                                {purchase.Item_List}
                              </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                              {purchase.Quantity}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                              {purchase.Total_amount} ETB
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                              {purchase.Payment_method}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <button
                                onClick={() => router.push(`/sales-detail/${purchase.id}`)}
                                className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                              >
                                <FaEye size={14} />
                                View
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </ProtectedRoute>
    </Layout>
  )
}