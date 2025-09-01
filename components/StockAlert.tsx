'use client'

import { useQuery } from '@tanstack/react-query'
import { FaExclamationTriangle, FaTimes } from 'react-icons/fa'
import { useState } from 'react'
import api from '@/lib/axios'

interface LowStockItem {
  id: string
  Name: string
  Curent_stock: number
  Restock_level: number
  Location: string
}

export default function StockAlert() {
  const [isVisible, setIsVisible] = useState(true)

  const { data: lowStockItems } = useQuery({
    queryKey: ['low-stock-alerts'],
    queryFn: async () => {
      const response = await api.get('/stock/low-stock')
      return response.data
    }
  })

  if (!isVisible || !lowStockItems || lowStockItems.length === 0) {
    return null
  }

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
      <div className="flex justify-between items-start">
        <div className="flex items-start gap-3">
          <FaExclamationTriangle className="text-red-500 mt-1" size={20} />
          <div>
            <h3 className="font-semibold text-red-800 mb-2">Low Stock Alert</h3>
            <p className="text-sm text-red-700 mb-3">
              {lowStockItems.length} item(s) are running low on stock:
            </p>
            <div className="space-y-1">
              {lowStockItems.slice(0, 3).map((item: LowStockItem) => (
                <p key={item.id} className="text-sm text-red-600">
                  • {item.Name} ({item.Location}): {item.Curent_stock} remaining (restock at {item.Restock_level})
                </p>
              ))}
              {lowStockItems.length > 3 && (
                <p className="text-sm text-red-600">
                  ... and {lowStockItems.length - 3} more items
                </p>
              )}
            </div>
          </div>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="text-red-400 hover:text-red-600"
        >
          <FaTimes size={16} />
        </button>
      </div>
    </div>
  )
}