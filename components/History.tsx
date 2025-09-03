'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { FaSearch, FaCalendar } from 'react-icons/fa'
import api from '@/lib/axios'

interface Sale {
  id: string
  Item_List: string
  Full_name: string
  Quantity: number
  Total_amount: number
  Payment_method: string
  Sale_type: string
  Contact: string
}

export default function History() {
  const router = useRouter()
  const [searchVisible, setSearchVisible] = useState(false)
  const [filterVisible, setFilterVisible] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStartDate, setFilterStartDate] = useState('')
  const [filterEndDate, setFilterEndDate] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 15

  const { data: salesData } = useQuery({
    queryKey: ['sales-history', currentPage, searchTerm, filterStartDate, filterEndDate],
    queryFn: async () => {
      if (searchTerm || filterStartDate || filterEndDate) {
        const response = await api.get(
          `/sales/search/find?startDate=${filterStartDate || ''}&endDate=${filterEndDate || ''}&nameOrPhone=${searchTerm || ''}&page=${currentPage}&limit=${itemsPerPage}`
        )
        return response.data
      } else {
        const response = await api.get(`/sales/all-sales?page=${currentPage}&limit=${itemsPerPage}`)
        return response.data
      }
    }
  })

  const sales = salesData?.data || []
  const totalPages = Math.ceil((salesData?.total || 0) / itemsPerPage)

  const formatProduct = (id: string) => {
    if (!id) return ''
    if (id.length <= 10) return id
    return `${id.slice(0, 5)}...${id.slice(-5)}`
  }

  const onEdit = (id: string) => {
    router.push(`/sales-detail/${id}`)
  }

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  return (
    <div className="bg-[#edf0f0b9] p-6">
      <div className="flex justify-between items-center">
        <h3 className="font-medium text-lg">Sales Report</h3>
        <div className="">
          <button
            onClick={() => setSearchVisible(!searchVisible)}
            className="text-gray-600 hover:text-gray-900 p-2 rounded-full hover:bg-gray-100"
          >
            <FaSearch size={18} />
          </button>
          <button
            onClick={() => setFilterVisible(!filterVisible)}
            className="text-gray-600 hover:text-gray-900 p-2 rounded-full hover:bg-gray-100"
          >
            <FaCalendar size={18} />
          </button>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="p-4 border-b">
        <div className="flex flex-col md:flex-row gap-4">
          {searchVisible && (
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FaSearch className="text-gray-400" size={16} />
                </div>
                <input
                  type="text"
                  placeholder="Search by Client Name"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 py-2 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          {filterVisible && (
            <div className="w-full md:w-auto">
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                <div className="relative flex-1 min-w-[180px]">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FaCalendar className="text-gray-400" size={16} />
                  </div>
                  <input
                    type="date"
                    value={filterStartDate}
                    onChange={(e) => setFilterStartDate(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm sm:text-base"
                    placeholder="Start date"
                  />
                </div>

                <div className="relative flex-1 min-w-[180px]">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FaCalendar className="text-gray-400" size={16} />
                  </div>
                  <input
                    type="date"
                    value={filterEndDate}
                    onChange={(e) => setFilterEndDate(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm sm:text-base"
                    placeholder="End date"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              {[
                'No.',
                'Product',
                'Client',
                'Quantity',
                'Total amount',
                'Payment',
                'Type',
                'Contact',
                'Action',
              ].map((header) => (
                <th
                  key={header}
                  className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sales.map((sale: Sale, index: number) => (
              <tr key={sale.id} className="hover:bg-gray-50">
                <td className="py-4 px-4 whitespace-nowrap">
                  {(currentPage - 1) * itemsPerPage + index + 1}
                </td>
                <td className="py-4 px-4 whitespace-nowrap relative group">
                  <span className="truncate max-w-[150px] inline-block">
                    {formatProduct(sale.Item_List)}
                  </span>
                  <span className="absolute hidden group-hover:block bg-gray-800 text-white text-xs rounded p-2 z-10 left-0 mt-1 w-48">
                    {sale.Item_List}
                  </span>
                </td>
                <td className="py-4 px-4 whitespace-nowrap">{sale.Full_name}</td>
                <td className="py-4 px-4 whitespace-nowrap">{sale.Quantity}</td>
                <td className="py-4 px-4 whitespace-nowrap">{sale.Total_amount}</td>
                <td className="py-4 px-4 whitespace-nowrap">{sale.Payment_method}</td>
                <td className="py-4 px-4 whitespace-nowrap">{sale.Sale_type}</td>
                <td className="py-4 px-4 whitespace-nowrap">{sale.Contact}</td>
                <td className="py-4 px-4 whitespace-nowrap">
                  <button
                    onClick={() => onEdit(sale.id)}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
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
    </div>
  )
}