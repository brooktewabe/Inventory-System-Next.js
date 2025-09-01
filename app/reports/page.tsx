'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { FaDownload, FaCalendar, FaChartBar, FaFileExcel } from 'react-icons/fa'
import Layout from '@/components/Layout'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useAuth } from '@/hooks/useAuth'
import api from '@/lib/axios'

export default function ReportsPage() {
  const { user } = useAuth()
  const [reportType, setReportType] = useState('sales')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const { data: reportData } = useQuery({
    queryKey: ['reports', reportType, startDate, endDate],
    queryFn: async () => {
      const params = new URLSearchParams({
        type: reportType,
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
      })
      const response = await api.get(`/reports/generate?${params}`)
      return response.data
    },
    enabled: !!reportType
  })

  const handleExportReport = async (format: 'excel' | 'pdf') => {
    try {
      const response = await api.get(`/reports/export`, {
        responseType: 'blob',
        params: {
          type: reportType,
          format,
          startDate,
          endDate
        }
      })
      
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `${reportType}-report-${new Date().toISOString().split('T')[0]}.${format === 'excel' ? 'xlsx' : 'pdf'}`)
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (error) {
      console.error('Export error:', error)
    }
  }

  const reportTypes = [
    { value: 'sales', label: 'Sales Report', icon: <FaChartBar /> },
    { value: 'inventory', label: 'Inventory Report', icon: <FaFileExcel /> },
    { value: 'customers', label: 'Customer Report', icon: <FaFileExcel /> },
    { value: 'movement', label: 'Stock Movement Report', icon: <FaFileExcel /> },
  ]

  return (
    <Layout>
      <ProtectedRoute requiredPermissions={['inventory', 'store']}>
        <section className="bg-[#edf0f0b9] min-h-screen">
          <div className="container m-auto">
            <div className="grid grid-cols-1 gap-6">
              <div className="bg-white flex justify-between">
                <p className="text-lg sm:text-xl font-bold">Reports</p>
                <div className="flex flex-col items-center justify-center bg-blue-500 text-white rounded-lg w-32 mr-2">
                  <p className="font-semibold">{user?.name}</p>
                  <p className="text-xs">{user?.role}</p>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center gap-3 mb-6">
                  <FaChartBar className="text-blue-600" size={24} />
                  <h2 className="text-xl font-semibold">Generate Reports</h2>
                </div>

                {/* Report Configuration */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium mb-1">Report Type</label>
                    <select
                      value={reportType}
                      onChange={(e) => setReportType(e.target.value)}
                      className="w-full py-2 px-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      {reportTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Start Date</label>
                    <div className="relative">
                      <FaCalendar className="absolute left-3 top-3 text-gray-400" size={16} />
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full pl-10 py-2 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">End Date</label>
                    <div className="relative">
                      <FaCalendar className="absolute left-3 top-3 text-gray-400" size={16} />
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full pl-10 py-2 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="flex items-end gap-2">
                    <button
                      onClick={() => handleExportReport('excel')}
                      className="flex items-center gap-2 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
                    >
                      <FaFileExcel size={16} />
                      Excel
                    </button>
                    <button
                      onClick={() => handleExportReport('pdf')}
                      className="flex items-center gap-2 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
                    >
                      <FaDownload size={16} />
                      PDF
                    </button>
                  </div>
                </div>

                {/* Report Preview */}
                {reportData && (
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold mb-4">Report Preview</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            {Object.keys(reportData[0] || {}).map((key) => (
                              <th key={key} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                {key.replace(/_/g, ' ')}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {reportData.slice(0, 10).map((row: any, index: number) => (
                            <tr key={index} className="hover:bg-gray-50">
                              {Object.values(row).map((value: any, i: number) => (
                                <td key={i} className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                  {value}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {reportData.length > 10 && (
                      <p className="text-sm text-gray-500 mt-2">
                        Showing first 10 of {reportData.length} records
                      </p>
                    )}
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