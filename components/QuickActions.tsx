'use client'

import { useRouter } from 'next/navigation'
import { FaPlus, FaShoppingCart, FaExchangeAlt, FaUsers, FaChartBar } from 'react-icons/fa'
import { hasPermission } from '@/lib/auth'

export default function QuickActions() {
  const router = useRouter()

  const actions = [
    {
      title: 'Add Product',
      description: 'Add new product to inventory',
      icon: <FaPlus size={24} />,
      color: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600',
      onClick: () => router.push('/choose-method'),
      permissions: ['add']
    },
    {
      title: 'Record Sale',
      description: 'Process a new sale',
      icon: <FaShoppingCart size={24} />,
      color: 'bg-green-500',
      hoverColor: 'hover:bg-green-600',
      onClick: () => router.push('/sales'),
      permissions: ['store']
    },
    {
      title: 'Transfer Stock',
      description: 'Move stock between locations',
      icon: <FaExchangeAlt size={24} />,
      color: 'bg-purple-500',
      hoverColor: 'hover:bg-purple-600',
      onClick: () => router.push('/transfer-stock'),
      permissions: ['inventory']
    },
    {
      title: 'Manage Customers',
      description: 'View and manage customers',
      icon: <FaUsers size={24} />,
      color: 'bg-orange-500',
      hoverColor: 'hover:bg-orange-600',
      onClick: () => router.push('/customers-list'),
      permissions: ['cms']
    },
    {
      title: 'View Reports',
      description: 'Generate and view reports',
      icon: <FaChartBar size={24} />,
      color: 'bg-indigo-500',
      hoverColor: 'hover:bg-indigo-600',
      onClick: () => router.push('/reports'),
      permissions: ['inventory', 'store']
    },
  ]

  const availableActions = actions.filter(action => 
    hasPermission(action.permissions)
  )

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {availableActions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className={`${action.color} ${action.hoverColor} text-white p-4 rounded-lg transition-colors text-left`}
          >
            <div className="flex items-center gap-3 mb-2">
              {action.icon}
              <h4 className="font-semibold">{action.title}</h4>
            </div>
            <p className="text-sm opacity-90">{action.description}</p>
          </button>
        ))}
      </div>
    </div>
  )
}