'use client'

import { useRouter, useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { FaArrowLeft, FaDownload, FaReceipt } from 'react-icons/fa'
import Layout from '@/components/Layout'
import ProtectedRoute from '@/components/ProtectedRoute'
import Spinner from '@/components/Spinner'
import { useAuth } from '@/hooks/useAuth'
import api from '@/lib/axios'

export default function SalesDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { user } = useAuth()

  const { data: sale, isLoading } = useQuery({
    queryKey: ['sale-detail', params.id],
    queryFn: async () => {
      const response = await api.get(`/sales/${params.id}`)
      return response.data
    }
  })

  const handlePrintReceipt = () => {
    window.print()
  }

  if (isLoading) {
    return (
      <Layout>
        <Spinner />
      </Layout>
    )
  }

  if (!sale) {
    return (
      <Layout>
        <div className="text-center py-8">Sale not found</div>
      </Layout>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
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
                  <p className="text-lg sm:text-xl font-bold">Sale Details</p>
                </div>
                <div className="flex flex-col items-center justify-center bg-blue-500 text-white rounded-lg w-32 mr-2">
                  <p className="font-semibold">{user?.name}</p>
                  <p className="text-xs">{user?.role}</p>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-6 pb-4 border-b">
                  <h2 className="text-xl font-semibold">Sale Information</h2>
                  <button
                    onClick={handlePrintReceipt}
                    className="flex items-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <FaReceipt size={16} />
                    Print Receipt
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg mb-4">Customer Information</h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Full Name</label>
                      <p className="text-lg">{sale.Full_name}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Contact</label>
                      <p className="text-lg">{sale.Contact}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Sale Date</label>
                      <p className="text-lg">{formatDate(sale.Created_at)}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg mb-4">Sale Information</h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Products</label>
                      <p className="text-lg">{sale.Item_List}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Quantity</label>
                      <p className="text-lg">{sale.Quantity}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Total Amount</label>
                      <p className="text-lg font-semibold text-green-600">{sale.Total_amount} ETB</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Payment Method</label>
                      <p className="text-lg">{sale.Payment_method}</p>
                    </div>
                    
                    {sale.Transaction_id && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Transaction ID</label>
                        <p className="text-lg">{sale.Transaction_id}</p>
                      </div>
                    )}
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Sale Type</label>
                      <p className="text-lg">{sale.Sale_type}</p>
                    </div>
                  </div>
                </div>

                {sale.Receipt && (
                  <div className="mt-8">
                    <h3 className="font-semibold text-lg mb-4">Receipt</h3>
                    <img
                      src={`http://localhost:5000/uploads/${sale.Receipt}`}
                      alt="Receipt"
                      className="max-w-md h-auto border border-gray-200 rounded-lg cursor-pointer"
                      onClick={() => window.open(`http://localhost:5000/uploads/${sale.Receipt}`, '_blank')}
                    />
                  </div>
                )}

                <div className="flex justify-end space-x-4 mt-8">
                  <button
                    onClick={() => router.back()}
                    className="border border-gray-400 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-100 transition"
                  >
                    Back
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