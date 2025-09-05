'use client'

import { useState, useEffect, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { FaSearch, FaUser } from 'react-icons/fa'
import api from '@/lib/axios'

interface Customer {
  id: string
  Full_name: string
  Contact: string
  Email?: string
}

interface SearchCustomerProps {
  onSelect: (customer: Customer) => void
  selectedCustomer?: Customer | null
}

export default function SearchCustomer({ onSelect, selectedCustomer }: SearchCustomerProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchTerm])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const { data: customers } = useQuery({
    queryKey: ['customer-search', debouncedSearchTerm],
    queryFn: async () => {
      if (!debouncedSearchTerm) return []
      const response = await api.get(`/customers/search?query=${debouncedSearchTerm}`)
      return response.data
    },
    enabled: !!debouncedSearchTerm && isOpen
  })

  const handleSelect = (customer: Customer) => {
    onSelect(customer)
    setSearchTerm(customer.Full_name)
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3">
          <FaSearch className="text-blue-600" />
        </div>
        <input
          type="text"
          placeholder={selectedCustomer ? selectedCustomer.Full_name : "Search existing customer or enter new name"}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          className="w-full pl-10 py-2 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {isOpen && customers && customers.length > 0 && (
        <div className="absolute mt-1 z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {customers.map((customer: Customer) => (
            <div
              key={customer.id}
              className="px-4 py-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
              onClick={() => handleSelect(customer)}
            >
              <div className="flex items-center gap-3">
                <FaUser className="text-gray-400" size={16} />
                <div>
                  <p className="font-medium text-gray-900">{customer.Full_name}</p>
                  <p className="text-sm text-gray-500">{customer.Contact}</p>
                  {customer.Email && (
                    <p className="text-xs text-gray-400">{customer.Email}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}