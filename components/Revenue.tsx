'use client'

import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import api from '@/lib/axios'

export default function Revenue() {
  const [activePeriod, setActivePeriod] = useState('monthly')

  const { data: revenueData } = useQuery({
    queryKey: ['revenue', activePeriod],
    queryFn: async () => {
      let endpoint
      switch (activePeriod) {
        case 'daily':
          endpoint = '/sales/total-amount/day'
          break
        case 'monthly':
          endpoint = '/sales/total-amount/month'
          break
        case 'yearly':
          endpoint = '/sales/total-amount/year'
          break
        default:
          endpoint = '/sales/total-amount/month'
      }

      const response = await api.get(endpoint)
      return parseFloat(response.data.total) || 0
    }
  })

  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const handleToggle = (period: string) => {
    setActivePeriod(period)
  }

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6">
        <h5 className="font-semibold text-lg mb-2 sm:mb-0">Sales Amount</h5>
        <div className="flex flex-wrap gap-2 sm:gap-1 bg-gray-100 p-1 rounded-full">
          {['yearly', 'monthly', 'daily'].map((period) => (
            <button
              key={period}
              onClick={() => handleToggle(period)}
              className={`py-1.5 px-3 rounded-full text-sm transition-colors whitespace-nowrap ${
                activePeriod === period
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-700'
              }`}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <p className="text-2xl sm:text-3xl font-extrabold">
          {(revenueData || 0).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </p>
      </div>

      <p className="text-sm font-bold mt-3 sm:mt-4">Total Sales</p>
      <p className="text-sm text-gray-600">{currentDate}</p>
    </div>
  )
}