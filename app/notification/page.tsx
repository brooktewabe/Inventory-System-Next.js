'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { FaBell, FaTrash, FaCheck, FaExclamationTriangle, FaInfoCircle } from 'react-icons/fa'
import { toast } from 'react-toastify'
import Layout from '@/components/Layout'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useAuth } from '@/hooks/useAuth'
import api from '@/lib/axios'

interface Notification {
  id: string
  message: string
  priority: 'High' | 'Medium' | 'Low'
  is_read: boolean
  created_at: string
}

export default function NotificationPage() {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [filter, setFilter] = useState('all')

  const { data: notifications } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const response = await api.get('/notification/all')
      return response.data
    }
  })

  const markAsReadMutation = useMutation({
    mutationFn: async (id: string) => {
      return api.patch(`/notification/${id}/read`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
      toast.success('Notification marked as read')
    }
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return api.delete(`/notification/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
      toast.success('Notification deleted')
    }
  })

  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      return api.patch('/notification/mark-all-read')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
      toast.success('All notifications marked as read')
    }
  })

  const filteredNotifications = notifications?.filter((notification: Notification) => {
    if (filter === 'unread') return !notification.is_read
    if (filter === 'read') return notification.is_read
    return true
  }) || []

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'High': return <FaExclamationTriangle className="text-red-500" />
      case 'Medium': return <FaInfoCircle className="text-yellow-500" />
      case 'Low': return <FaInfoCircle className="text-blue-500" />
      default: return <FaInfoCircle className="text-gray-500" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'border-l-red-500 bg-red-50'
      case 'Medium': return 'border-l-yellow-500 bg-yellow-50'
      case 'Low': return 'border-l-blue-500 bg-blue-50'
      default: return 'border-l-gray-500 bg-gray-50'
    }
  }

  return (
    <Layout>
      <ProtectedRoute requiredPermissions={['notification']}>
        <section className="bg-[#edf0f0b9] min-h-screen">
          <div className="container m-auto">
            <div className="grid grid-cols-1 gap-6">
              <div className="bg-white flex justify-between">
                <p className="text-lg sm:text-xl font-bold">Notifications</p>
                <div className="flex flex-col items-center justify-center bg-blue-500 text-white rounded-lg w-32 mr-2">
                  <p className="font-semibold">{user?.name}</p>
                  <p className="text-xs">{user?.role}</p>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-3">
                    <FaBell className="text-blue-600" size={24} />
                    <h2 className="text-xl font-semibold">Notification Center</h2>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <select
                      value={filter}
                      onChange={(e) => setFilter(e.target.value)}
                      className="py-2 px-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="all">All Notifications</option>
                      <option value="unread">Unread</option>
                      <option value="read">Read</option>
                    </select>
                    
                    <button
                      onClick={() => markAllAsReadMutation.mutate()}
                      disabled={markAllAsReadMutation.isPending}
                      className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
                    >
                      Mark All Read
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  {filteredNotifications.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <FaBell size={48} className="mx-auto mb-4 text-gray-300" />
                      <p>No notifications found</p>
                    </div>
                  ) : (
                    filteredNotifications.map((notification: Notification) => (
                      <div
                        key={notification.id}
                        className={`border-l-4 p-4 rounded-r-lg ${getPriorityColor(notification.priority)} ${
                          !notification.is_read ? 'border-l-4' : 'opacity-75'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex items-start gap-3 flex-1">
                            {getPriorityIcon(notification.priority)}
                            <div className="flex-1">
                              <p className={`${!notification.is_read ? 'font-semibold' : ''}`}>
                                {notification.message}
                              </p>
                              <p className="text-sm text-gray-500 mt-1">
                                {new Date(notification.created_at).toLocaleString()}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {!notification.is_read && (
                              <button
                                onClick={() => markAsReadMutation.mutate(notification.id)}
                                disabled={markAsReadMutation.isPending}
                                className="text-green-600 hover:text-green-800 p-1"
                                title="Mark as read"
                              >
                                <FaCheck size={16} />
                              </button>
                            )}
                            <button
                              onClick={() => deleteMutation.mutate(notification.id)}
                              disabled={deleteMutation.isPending}
                              className="text-red-600 hover:text-red-800 p-1"
                              title="Delete"
                            >
                              <FaTrash size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </ProtectedRoute>
    </Layout>
  )
}