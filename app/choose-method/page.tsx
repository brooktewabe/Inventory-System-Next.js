'use client'

import { useRouter } from 'next/navigation'
import { FaPlus, FaUpload } from 'react-icons/fa'
import Layout from '@/components/Layout'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useAuth } from '@/hooks/useAuth'

export default function ChooseMethodPage() {
  const router = useRouter()
  const { user } = useAuth()

  const handleManualAdd = () => {
    router.push('/add-product')
  }

  const handleBulkUpload = () => {
    router.push('/bulk-upload')
  }

  return (
    <Layout>
      <ProtectedRoute requiredPermissions={['add']}>
        <section className="bg-[#edf0f0b9] min-h-screen">
          <div className="container m-auto">
            <div className="grid grid-cols-1 gap-6">
              <div className="bg-white flex justify-between">
                <p className="text-lg sm:text-xl font-bold">Choose Method</p>
                <div className="flex flex-col items-center justify-center bg-blue-500 text-white rounded-lg w-32 mr-2">
                  <p className="font-semibold">{user?.name}</p>
                  <p className="text-xs">{user?.role}</p>
                </div>
              </div>
              
              <div className="flex justify-center items-center min-h-[60vh]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl w-full mx-4">
                  <div 
                    onClick={handleManualAdd}
                    className="bg-white p-8 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow border-2 border-transparent hover:border-blue-500"
                  >
                    <div className="text-center">
                      <div className="bg-blue-600 text-white p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                        <FaPlus size={24} />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">Manual Add</h3>
                      <p className="text-gray-600">Add products one by one with detailed information</p>
                    </div>
                  </div>
                  
                  <div 
                    onClick={handleBulkUpload}
                    className="bg-white p-8 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow border-2 border-transparent hover:border-blue-500"
                  >
                    <div className="text-center">
                      <div className="bg-green-600 text-white p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                        <FaUpload size={24} />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">Bulk Upload</h3>
                      <p className="text-gray-600">Upload multiple products using Excel file</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </ProtectedRoute>
    </Layout>
  )
}