'use client'

import { useEffect, useState, useRef } from 'react'
import { FaSearch } from 'react-icons/fa'

interface StockItem {
  id: string
  Name: string
  Price: number
  Curent_stock: number
}

interface SaleItem {
  itemName: string
  quantity: number
  price: number
  totalAmount: number
}

interface ItemSelectorProps {
  index: number
  item: SaleItem
  handleItemChange: (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
  getSelectedIds: () => string[]
  stockData: StockItem[]
}

export default function ItemSelector({ 
  index, 
  item, 
  handleItemChange, 
  getSelectedIds, 
  stockData 
}: ItemSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [filteredStock, setFilteredStock] = useState<StockItem[]>(stockData)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Filter stock based on search term
  useEffect(() => {
    const filtered = stockData.filter(stock =>
      stock.Name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredStock(filtered)
  }, [searchTerm, stockData])

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const selectedStock = stockData.find(s => s.id === item.itemName)

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-sm mb-1">Item Name</label>
      <div
        className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2 cursor-pointer"
        onClick={() => setIsOpen(prev => !prev)}
      >
        {selectedStock?.Name || 'Select Item'}
      </div>

      {isOpen && (
        <div className="absolute mt-1 z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
          <div className="flex items-center px-2 py-1 border-b">
            <FaSearch className="text-gray-400 mr-2" />
            <input
              type="text"
              className="w-full py-1 px-2 text-sm border-none focus:outline-none"
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {filteredStock.length === 0 ? (
            <div className="px-4 py-2 text-gray-500 text-sm">No items found</div>
          ) : (
            filteredStock.map((stock) => {
              const isDisabled =
                getSelectedIds().includes(stock.id) &&
                item.itemName !== stock.id

              return (
                <div
                  key={stock.id}
                  className={`px-4 py-2 hover:bg-gray-100 text-sm cursor-pointer ${
                    isDisabled ? "text-gray-400 cursor-not-allowed" : ""
                  }`}
                  onClick={() => {
                    if (!isDisabled) {
                      handleItemChange(index, {
                        target: { name: 'itemName', value: stock.id }
                      } as React.ChangeEvent<HTMLInputElement>)
                      setIsOpen(false)
                      setSearchTerm('')
                    }
                  }}
                >
                  {stock.Name} {isDisabled ? "(Already Selected)" : ""}
                </div>
              )
            })
          )}
        </div>
      )}
    </div>
  )
}