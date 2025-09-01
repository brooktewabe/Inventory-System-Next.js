'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { toast } from 'react-toastify'
import { FaUser, FaLock, FaUsers, FaCog } from 'react-icons/fa'
import Layout from '@/components/Layout'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useAuth } from '@/hooks/useAuth'
import api from '@/lib/axios'

const passwordSchema = Yup.object({
  currentPassword: Yup.string().required('Current password is required'),
  newPassword: Yup.string().min(8, 'Password must be at least 8 characters').required('New password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword')], 'Passwords must match')
    .required('Confirm password is required'),
})

const userSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  role: Yup.string().required('Role is required'),
  password: Yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
})

export default function SettingsPage() {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState('profile')

  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await api.get('/users')
      return response.data
    },
    enabled: user?.role === 'admin'
  })

  const changePasswordMutation = useMutation({
    mutationFn: async (data: any) => {
      return api.patch('/users/change-password', data)
    },
    onSuccess: () => {
      toast.success('Password changed successfully!')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error changing password')
    }
  })

  const createUserMutation = useMutation({
    mutationFn: async (data: any) => {
      return api.post('/users/create', data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success('User created successfully!')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error creating user')
    }
  })

  const deleteUserMutation = useMutation({
    mutationFn: async (id: string) => {
      return api.delete(`/users/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success('User deleted successfully!')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error deleting user')
    }
  })

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <FaUser /> },
    { id: 'security', label: 'Security', icon: <FaLock /> },
    ...(user?.role === 'admin' ? [{ id: 'users', label: 'User Management', icon: <FaUsers /> }] : []),
    { id: 'system', label: 'System', icon: <FaCog /> },
  ]

  return (
    <Layout>
      <ProtectedRoute requiredPermissions={['settings']}>
        <section className="bg-[#edf0f0b9] min-h-screen">
          <div className="container m-auto">
            <div className="grid grid-cols-1 gap-6">
              <div className="bg-white flex justify-between">
                <p className="text-lg sm:text-xl font-bold">Settings</p>
                <div className="flex flex-col items-center justify-center bg-blue-500 text-white rounded-lg w-32 mr-2">
                  <p className="font-semibold">{user?.name}</p>
                  <p className="text-xs">{user?.role}</p>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* Tabs */}
                <div className="border-b border-gray-200">
                  <nav className="flex space-x-8 px-6">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                          activeTab === tab.id
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        {tab.icon}
                        {tab.label}
                      </button>
                    ))}
                  </nav>
                </div>

                {/* Tab Content */}
                <div className="p-6">
                  {activeTab === 'profile' && (
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Profile Information</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Name</label>
                          <p className="text-lg">{user?.name}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Role</label>
                          <p className="text-lg capitalize">{user?.role}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Permissions</label>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {user?.permissions.map((permission) => (
                              <span
                                key={permission}
                                className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                              >
                                {permission}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'security' && (
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Change Password</h3>
                      <Formik
                        initialValues={{ currentPassword: '', newPassword: '', confirmPassword: '' }}
                        validationSchema={passwordSchema}
                        onSubmit={(values, { resetForm }) => {
                          changePasswordMutation.mutate(values)
                          resetForm()
                        }}
                      >
                        {({ isSubmitting }) => (
                          <Form className="space-y-4 max-w-md">
                            <div>
                              <label className="block text-sm font-medium mb-1">Current Password</label>
                              <Field
                                name="currentPassword"
                                type="password"
                                className="w-full py-2 px-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                              />
                              <ErrorMessage name="currentPassword" component="div" className="text-red-500 text-sm mt-1" />
                            </div>

                            <div>
                              <label className="block text-sm font-medium mb-1">New Password</label>
                              <Field
                                name="newPassword"
                                type="password"
                                className="w-full py-2 px-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                              />
                              <ErrorMessage name="newPassword" component="div" className="text-red-500 text-sm mt-1" />
                            </div>

                            <div>
                              <label className="block text-sm font-medium mb-1">Confirm Password</label>
                              <Field
                                name="confirmPassword"
                                type="password"
                                className="w-full py-2 px-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                              />
                              <ErrorMessage name="confirmPassword" component="div" className="text-red-500 text-sm mt-1" />
                            </div>

                            <button
                              type="submit"
                              disabled={isSubmitting || changePasswordMutation.isPending}
                              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
                            >
                              {isSubmitting || changePasswordMutation.isPending ? 'Changing...' : 'Change Password'}
                            </button>
                          </Form>
                        )}
                      </Formik>
                    </div>
                  )}

                  {activeTab === 'users' && user?.role === 'admin' && (
                    <div>
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-semibold">User Management</h3>
                      </div>

                      <div className="mb-8">
                        <h4 className="font-medium mb-4">Create New User</h4>
                        <Formik
                          initialValues={{ name: '', email: '', role: '', password: '' }}
                          validationSchema={userSchema}
                          onSubmit={(values, { resetForm }) => {
                            createUserMutation.mutate(values)
                            resetForm()
                          }}
                        >
                          {({ isSubmitting }) => (
                            <Form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Field
                                  name="name"
                                  type="text"
                                  placeholder="Full Name"
                                  className="w-full py-2 px-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                                <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-1" />
                              </div>

                              <div>
                                <Field
                                  name="email"
                                  type="email"
                                  placeholder="Email"
                                  className="w-full py-2 px-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                                <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
                              </div>

                              <div>
                                <Field
                                  as="select"
                                  name="role"
                                  className="w-full py-2 px-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                >
                                  <option value="">Select Role</option>
                                  <option value="admin">Admin</option>
                                  <option value="manager">Manager</option>
                                  <option value="data_clerk">Data Clerk</option>
                                </Field>
                                <ErrorMessage name="role" component="div" className="text-red-500 text-sm mt-1" />
                              </div>

                              <div>
                                <Field
                                  name="password"
                                  type="password"
                                  placeholder="Password"
                                  className="w-full py-2 px-3 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                                <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
                              </div>

                              <div className="md:col-span-2">
                                <button
                                  type="submit"
                                  disabled={isSubmitting || createUserMutation.isPending}
                                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
                                >
                                  {isSubmitting || createUserMutation.isPending ? 'Creating...' : 'Create User'}
                                </button>
                              </div>
                            </Form>
                          )}
                        </Formik>
                      </div>

                      <div>
                        <h4 className="font-medium mb-4">Existing Users</h4>
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {users?.map((userData: any) => (
                                <tr key={userData.id}>
                                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{userData.name}</td>
                                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{userData.email}</td>
                                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 capitalize">{userData.role}</td>
                                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                                    {userData.id !== user?.id && (
                                      <button
                                        onClick={() => deleteUserMutation.mutate(userData.id)}
                                        className="text-red-600 hover:text-red-800"
                                      >
                                        Delete
                                      </button>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'system' && (
                    <div>
                      <h3 className="text-lg font-semibold mb-4">System Information</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Application Version</label>
                          <p className="text-lg">v1.0.0</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Framework</label>
                          <p className="text-lg">Next.js 15</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Database</label>
                          <p className="text-lg">Connected</p>
                        </div>
                      </div>
                    </div>
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