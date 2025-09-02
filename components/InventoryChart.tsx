'use client'

import { useQuery } from '@tanstack/react-query'
import { FaChartLine } from 'react-icons/fa'
import api from '@/lib/axios'

export default function InventoryChart() {
  const { data: chartData } = useQuery({
    queryKey: ['inventory-chart'],
    queryFn: async () => {
      const response = await api.get('/dashboard/inventory-chart')
      return response.data
    }
  })

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center gap-3 mb-4">
        <FaChartLine className="text-blue-600" size={20} />
        <h3 className="text-lg font-semibold">Inventory Overview</h3>
      </div>

      <div className="space-y-4">
        {chartData?.categories?.map((category: any, index: number) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div 
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: category.color }}
              />
              <span className="text-sm font-medium">{category.name}</span>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold">{category.count} items</p>
              <p className="text-xs text-gray-500">{category.value} ETB</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">Total Inventory Value</span>
          <span className="text-lg font-bold text-green-600">
            {chartData?.totalValue || 0} ETB
          </span>
        </div>
      </div>
    </div>
  )
}