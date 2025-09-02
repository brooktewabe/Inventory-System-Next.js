'use client'

import { useAuth } from '@/hooks/useAuth'
import Layout from '@/components/Layout'
import ProtectedRoute from '@/components/ProtectedRoute'
import DashboardStats from '@/components/DashboardStats'
import StockAlert from '@/components/StockAlert'
import QuickActions from '@/components/QuickActions'
import RecentActivity from '@/components/RecentActivity'
import InventoryChart from '@/components/InventoryChart'
import SalesChart from '@/components/SalesChart'
import Revenue from '@/components/Revenue'
import Total from '@/components/Total'

export default function Dashboard() {
  const { user } = useAuth()

  if (!user) return null

  return (
      <ProtectedRoute requiredPermissions={['dashboard']}>
        <section className="bg-[#edf0f0b9] min-h-screen">
          <div className="container m-auto p-6">
            <div className="grid grid-cols-1 gap-6">
              <div className="bg-white p-4 rounded-lg shadow-md flex justify-between">
                <p className="text-xl font-bold">Dashboard</p>
                <div className="flex flex-col items-center justify-center bg-blue-500 text-white rounded-lg w-32">
                  <p className="font-semibold">{user.name}</p>
                  <p className="text-xs">{user.role}</p>
                </div>
              </div>
              
              <StockAlert />
              
              <DashboardStats />
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <QuickActions />
                </div>
                <div>
                  <InventoryChart />
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Revenue />
                <Total />
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SalesChart />
                <RecentActivity />
              </div>
            </div>
          </div>
        </section>
      </ProtectedRoute>
  )
}