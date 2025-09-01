'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { FaSearch, FaEye, FaUserPlus } from 'react-icons/fa'
import Layout from '@/components/Layout'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useAuth } from '@/hooks/useAuth'
import api from '@/lib/axios'

interface Customer {
  id: string
  Full_name: string
  Contact: string
  Total_purchases: number
  Last_purchase: string
  Total_amount: number
}

export default function CustomersListPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  const itemsPerPage = 15

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 400)
    return () => clearTimeout(timer)
  }, [searchTerm])

  const { data: customersData } = useQuery({
    queryKey: ['customers', currentPage, debouncedSearchTerm],
    queryFn: async () => {
      if (debouncedSearchTerm) {
        const response = await api.get(`/customers/search?query=${debouncedSearchTerm}`)
        return { data: response.data, total: response.data.length }
      } else {
        const response = await api.get(`/customers?page=${currentPage}&limit=${itemsPerPage}`)
        return response.data
      }
    }
  })

  const customers = customersData?.data || []
  const totalPages = Math.ceil((customersData?.total || 0) / itemsPerPage)

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const handleViewCustomer = (id: string) => {
    router.push(`/customer-detail/${id}`)
  }

  const handleAddCustomer = () => {
    router.push('/add-customer')
  }

  return (
    <Layout>
      <ProtectedRoute requiredPermissions={['cms']}>
        <section className="bg-[#edf0f0b9] min-h-screen">
          <div className="container m-auto">
            <div className="grid grid-cols-1 gap-6">
              <div className="bg-white flex justify-between">
                <p className="text-lg sm:text-xl font-bold">Customer Management</p>
                <div className="flex flex-col items-center justify-center bg-blue-500 text-white rounded-lg w-32 mr-2">
                  <p className="font-semibold">{user?.name}</p>
                  <p className="text-xs">{user?.role}</p>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Customer List</h2>
                  <button
                    onClick={handleAddCustomer}
                    className="flex items-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <FaUserPlus size={16} />
                    Add Customer
                  </button>
                </div>

                {/* Search */}
                <div className="mb-6 relative w-full md:w-1/3">
                  <div className="absolute inset-y-0 left-0 flex items-center">
                    <div className="bg-blue-600 rounded-l-md px-3 py-3 text-white flex items-center justify-center">
                      <FaSearch size={16} />
                    </div>
                  </div>
                  <input
                    type="text"
                    placeholder="Search customers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-14 pr-4 py-2.5 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">No.</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Purchases</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Amount</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Purchase</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {customers.map((customer: Customer, index: number) => (
                        <tr key={customer.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                            {(currentPage - 1) * itemsPerPage + index + 1}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                            {customer.Full_name}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                            {customer.Contact}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                            {customer.Total_purchases}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                            {customer.Total_amount} ETB
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                            {customer.Last_purchase ? new Date(customer.Last_purchase).toLocaleDateString() : 'N/A'}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <button
                              onClick={() => handleViewCustomer(customer.id)}
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

                {/* Pagination */}
                {!searchTerm && (
                  <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200">
                    <div className="flex-1 flex justify-between sm:hidden">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        Next
                      </button>
                    </div>
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                      <div>
                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                          <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                          >
                            Previous
                          </button>

                          {[...Array(Math.min(5, totalPages))].map((_, i) => (
                            <button
                              key={i}
                              onClick={() => handlePageChange(i + 1)}
                              className={`relative inline-flex items-center px-4 py-2 border ${
                                currentPage === i + 1
                                  ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                  : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50'
                              } text-sm font-medium`}
                            >
                              {i + 1}
                            </button>
                          ))}

                          <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                          >
                            Next
                          </button>
                        </nav>
                      </div>
                      <div className="text-sm text-gray-700">
                        Page <span className="font-medium">{currentPage}</span> of{" "}
                        <span className="font-medium">{totalPages > 0 ? totalPages : 1}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </ProtectedRoute>
    </Layout>
  )
}