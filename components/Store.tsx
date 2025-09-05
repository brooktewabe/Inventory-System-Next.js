'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import Swal from 'sweetalert2'
import { toast } from 'react-toastify'
import { FaEdit, FaTrash, FaSearch } from 'react-icons/fa'
import { PiKeyReturnBold } from 'react-icons/pi'
import { useAuth } from '@/hooks/useAuth'
import api from '@/lib/axios'

interface StockItem {
  id: string
  Product_id: string
  Name: string
  Category: string
  Price: number
  Curent_stock: number
  Restock_level: number
  Unit: string
  Product_image?: string
}

export default function Store() {
  const router = useRouter()
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  const itemsPerPage = 15

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 400)
    return () => clearTimeout(timer)
  }, [searchTerm])

  const { data: stockData, refetch } = useQuery({
    queryKey: ['store-stock', currentPage, debouncedSearchTerm],
    queryFn: async () => {
      if (debouncedSearchTerm) {
        const response = await api.get(`/stock/search?query=${debouncedSearchTerm}&location=store`)
        return { data: response.data, total: response.data.length }
      } else {
        const response = await api.get(`/stock/all/store?page=${currentPage}&limit=${itemsPerPage}`)
        return response.data
      }
    }
  })

  const stocks = stockData?.data || []
  const totalPages = Math.ceil((stockData?.total || 0) / itemsPerPage)

  const onDelete = async (id: string) => {
    Swal.fire({
      text: 'Are you sure you want to delete this product?',
      icon: 'error',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await api.get(`/stock/all/${id}`)
          const stockToDelete = response.data
          await api.delete(`/stock/all/${id}`)
          
          await api.post('/notification/create', {
            message: `${stockToDelete.Name} is deleted.`,
            priority: 'High',
          })
          
          toast.success('Deleted Successfully')
          refetch()
        } catch (error) {
          toast.error('Error deleting stock. Try again later.')
        }
      }
    })
  }

  const onEditStock = (id: string) => {
    router.push(`/edit-product/${id}`)
  }

  const handleViewNavigation = (id: string) => {
    router.push(`/stock-details/${id}`)
  }

  const handleReturnNavigation = (id: string) => {
    router.push(`/return-product/${id}`)
  }

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  return (
    <section className="bg-[#edf0f0b9] min-h-screen">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 gap-6">
          <div>
            <h3 className="text-xl ml-4 font-semibold">Store Inventory</h3>
          </div>
          
          {/* Search Bar */}
          <div className="mb-4 relative w-5/7 sm:w-3/5 md:w-3/5 mx-4">
            <div className="absolute inset-y-0 left-0 flex items-center">
              <div className="bg-blue-600 rounded-l-md px-3 py-3 text-white flex items-center justify-center">
                <FaSearch size={18} className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            </div>
            <input
              type="text"
              placeholder="Search by Name, Product ID, Category, Model"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-4 py-2.5 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
            />
          </div>

          <div className="bg-white rounded-md shadow-sm overflow-hidden ml-4 mr-4">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <td className="px-4 py-3 text-left text-xs font-medium text-gray-500">No.</td>
                    <td className="px-4 py-3 text-left text-xs font-medium text-gray-500">Product Image</td>
                    <td className="px-4 py-3 text-left text-xs font-medium text-gray-500">ID</td>
                    <td className="px-4 py-3 text-left text-xs font-medium text-gray-500">Category</td>
                    <td className="px-4 py-3 text-left text-xs font-medium text-gray-500">Product Name</td>
                    <td className="px-4 py-3 text-left text-xs font-medium text-gray-500">Price</td>
                    <td className="px-4 py-3 text-left text-xs font-medium text-gray-500">Stock</td>
                    <td className="px-4 py-3 text-left text-xs font-medium text-gray-500">Restock Level</td>
                    <td className="px-4 py-3 text-left text-xs font-medium text-gray-500">Unit</td>
                    <td className="px-4 py-3 text-left text-xs font-medium text-gray-500">Action</td>
                  </tr>
                </thead>
                <tbody>
                  {stocks.map((stock: StockItem, index: number) => (
                    <tr key={stock.id}>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        <img
                          className="size-10"
                          src={
                            stock.Product_image
                              ? `http://localhost:5000/uploads/${stock.Product_image}`
                              : '/placeholder.png'
                          }
                          alt="Stock Image"
                        />
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {stock.Product_id}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {stock.Category}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {stock.Name}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {stock.Price}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {stock.Curent_stock}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {stock.Restock_level}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {stock.Unit}
                      </td>
                      <td className="border-b space-x-2">
                        <button
                          onClick={() => handleReturnNavigation(stock.id)}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <PiKeyReturnBold />
                        </button>
                        <button
                          onClick={() => onEditStock(stock.id)}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <FaEdit />
                        </button>
                        {user?.role === 'admin' && (
                          <button
                            onClick={() => onDelete(stock.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <FaTrash />
                          </button>
                        )}
                        <button
                          onClick={() => handleViewNavigation(stock.id)}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
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

                        {totalPages > 5 && (
                          <>
                            <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                              ...
                            </span>
                            <button
                              onClick={() => handlePageChange(totalPages)}
                              className={`relative inline-flex items-center px-4 py-2 border ${
                                currentPage === totalPages
                                  ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                  : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50'
                              } text-sm font-medium`}
                            >
                              {totalPages}
                            </button>
                          </>
                        )}

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
                      <span className="font-medium">
                        {totalPages > 0 ? totalPages : 1}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}