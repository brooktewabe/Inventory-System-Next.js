'use client'

import { useQuery } from '@tanstack/react-query'
import { FaClock, FaShoppingCart, FaExchangeAlt, FaPlus } from 'react-icons/fa'
import api from '@/lib/axios'

interface Activity {
  id: string
  type: 'sale' | 'transfer' | 'add' | 'return'
  description: string
  created_at: string
  user_name: string
}

export default function RecentActivity() {
  const { data: activities } = useQuery({
    queryKey: ['recent-activities'],
    queryFn: async () => {
      const response = await api.get('/dashboard/recent-activities')
      return response.data
    }
  })

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'sale': return <FaShoppingCart className="text-green-500" />
      case 'transfer': return <FaExchangeAlt className="text-blue-500" />
      case 'add': return <FaPlus className="text-purple-500" />
      case 'return': return <FaExchangeAlt className="text-red-500" />
      default: return <FaClock className="text-gray-500" />
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center gap-3 mb-4">
        <FaClock className="text-blue-600" size={20} />
        <h3 className="text-lg font-semibold">Recent Activity</h3>
      </div>

      <div className="space-y-4">
        {activities?.slice(0, 10).map((activity: Activity) => (
          <div key={activity.id} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg">
            <div className="mt-1">
              {getActivityIcon(activity.type)}
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">{activity.description}</p>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-xs text-gray-500">by {activity.user_name}</p>
                <span className="text-xs text-gray-400">•</span>
                <p className="text-xs text-gray-500">{formatTimeAgo(activity.created_at)}</p>
              </div>
            </div>
          </div>
        ))}
        
        {(!activities || activities.length === 0) && (
          <p className="text-gray-500 text-center py-4">No recent activity</p>
        )}
      </div>
    </div>
  )
}