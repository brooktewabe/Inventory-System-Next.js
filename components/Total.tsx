'use client'

import { useQuery } from '@tanstack/react-query'
import api from '@/lib/axios'

export default function Total() {
  const { data: stockValue } = useQuery({
    queryKey: ['total-stock'],
    queryFn: async () => {
      const response = await api.get('/stock/total/total-stock')
      return response.data.totalSum
    }
  })

  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num)
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold">Total Inventory Asset</h3>
      </div>
      <div className="flex justify-between items-start mt-4">
        <p className="text-2xl mb-10 font-extrabold">
          {formatNumber(stockValue || 0)}
        </p>
      </div>
      <p className="text-sm font-bold">Total Value</p>
      <p className="text-sm text-gray-600">{currentDate}</p>
    </div>
  )
}