'use client'

import { useQuery } from '@tanstack/react-query'
import { FaBox, FaShoppingCart, FaUsers, FaDollarSign } from 'react-icons/fa'
import api from '@/lib/axios'

export default function DashboardStats() {
  const { data: stats } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const response = await api.get('/dashboard/stats')
      return response.data
    }
  })

  const statCards = [
    {
      title: 'Total Products',
      value: stats?.totalProducts || 0,
      icon: <FaBox size={24} />,
      color: 'bg-blue-500',
      textColor: 'text-blue-600'
    },
    {
      title: 'Total Sales',
      value: stats?.totalSales || 0,
      icon: <FaShoppingCart size={24} />,
      color: 'bg-green-500',
      textColor: 'text-green-600'
    },
    {
      title: 'Total Customers',
      value: stats?.totalCustomers || 0,
      icon: <FaUsers size={24} />,
      color: 'bg-purple-500',
      textColor: 'text-purple-600'
    },
    {
      title: 'Revenue Today',
      value: `${stats?.todayRevenue || 0} ETB`,
      icon: <FaDollarSign size={24} />,
      color: 'bg-yellow-500',
      textColor: 'text-yellow-600'
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {statCards.map((stat, index) => (
        <div key={index} className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
            <div className={`${stat.color} text-white p-3 rounded-full`}>
              {stat.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}