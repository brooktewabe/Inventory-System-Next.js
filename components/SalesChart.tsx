'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { FaChartBar } from 'react-icons/fa'
import api from '@/lib/axios'

export default function SalesChart() {
  const [period, setPeriod] = useState('week')

  const { data: salesData } = useQuery({
    queryKey: ['sales-chart', period],
    queryFn: async () => {
      const response = await api.get(`/dashboard/sales-chart?period=${period}`)
      return response.data
    }
  })

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <FaChartBar className="text-blue-600" size={20} />
          <h3 className="text-lg font-semibold">Sales Trend</h3>
        </div>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="py-1 px-3 bg-gray-50 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="year">This Year</option>
        </select>
      </div>

      <div className="space-y-3">
        {salesData?.map((data: any, index: number) => (
          <div key={index} className="flex items-center justify-between">
            <span className="text-sm text-gray-600">{data.label}</span>
            <div className="flex items-center gap-3">
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(data.value / (salesData[0]?.value || 1)) * 100}%` }}
                />
              </div>
              <span className="text-sm font-semibold w-16 text-right">{data.value}</span>
            </div>
          </div>
        ))}
      </div>

      {(!salesData || salesData.length === 0) && (
        <p className="text-gray-500 text-center py-4">No sales data available</p>
      )}
    </div>
  )
}