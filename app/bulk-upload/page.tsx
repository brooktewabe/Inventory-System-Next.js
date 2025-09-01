'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import { FaUpload, FaDownload, FaTimes } from 'react-icons/fa'
import Layout from '@/components/Layout'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useAuth } from '@/hooks/useAuth'
import api from '@/lib/axios'

export default function BulkUploadPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      if (selectedFile.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' &&
          selectedFile.type !== 'application/vnd.ms-excel') {
        toast.error('Please select a valid Excel file (.xlsx or .xls)')
        return
      }
      setFile(selectedFile)
    }
  }

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a file first')
      return
    }

    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await api.post('/stock/bulk-upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      toast.success(`Successfully uploaded ${response.data.count} products`)
      router.push('/warehouse')
    } catch (error: any) {
      console.error('Upload error:', error)
      toast.error(error.response?.data?.message || 'Error uploading file')
    } finally {
      setUploading(false)
    }
  }

  const downloadTemplate = () => {
    window.open('http://localhost:5000/template/product-template.xlsx', '_blank')
  }

  return (
    <Layout>
      <ProtectedRoute requiredPermissions={['add']}>
        <section className="bg-[#edf0f0b9] min-h-screen">
          <div className="container m-auto">
            <div className="grid grid-cols-1 gap-6">
              <div className="bg-white flex justify-between">
                <p className="text-lg sm:text-xl font-bold">Bulk Upload</p>
                <div className="flex flex-col items-center justify-center bg-blue-500 text-white rounded-lg w-32 mr-2">
                  <p className="font-semibold">{user?.name}</p>
                  <p className="text-xs">{user?.role}</p>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
                <h2 className="text-xl font-semibold mb-6">Upload Products from Excel</h2>
                
                <div className="mb-6">
                  <button
                    onClick={downloadTemplate}
                    className="flex items-center gap-2 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
                  >
                    <FaDownload size={16} />
                    Download Template
                  </button>
                  <p className="text-sm text-gray-600 mt-2">
                    Download the Excel template and fill in your product data
                  </p>
                </div>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <input
                    type="file"
                    id="file-upload"
                    accept=".xlsx,.xls"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  
                  {!file ? (
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <FaUpload size={48} className="mx-auto text-gray-400 mb-4" />
                      <p className="text-lg font-medium text-gray-700 mb-2">
                        Click to upload Excel file
                      </p>
                      <p className="text-sm text-gray-500">
                        Supports .xlsx and .xls files
                      </p>
                    </label>
                  ) : (
                    <div className="flex items-center justify-center gap-4">
                      <div className="text-center">
                        <p className="font-medium text-gray-700">{file.name}</p>
                        <p className="text-sm text-gray-500">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setFile(null)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaTimes size={20} />
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-4 mt-8">
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="border border-gray-400 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-100 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpload}
                    disabled={!file || uploading}
                    className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
                  >
                    {uploading ? 'Uploading...' : 'Upload Products'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </ProtectedRoute>
    </Layout>
  )
}