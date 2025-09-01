'use client'

import { useState, useEffect } from 'react'

export interface BatchSaleItem {
  name: string
  quantity: number
  totalAmount: number
}

export interface BatchSaleData {
  addedItems: BatchSaleItem[]
  salesTotal: number
  salesQuantity: number
  salesIdFromNames: string
  salesItems: string
  salesQuantityList: string
  formData: {
    Full_name: string
    Contact: string
    Payment_method: string
    Transaction_id: string
    Receipt: File | null
    Sale_type: string
    EachQuantity: string
  }
}

const STORAGE_KEY = 'batchSaleData'

export function useBatchSale() {
  const [batchData, setBatchData] = useState<BatchSaleData>({
    addedItems: [],
    salesTotal: 0,
    salesQuantity: 0,
    salesIdFromNames: '',
    salesItems: '',
    salesQuantityList: '',
    formData: {
      Full_name: '',
      Contact: '',
      Payment_method: '',
      Transaction_id: '',
      Receipt: null,
      Sale_type: 'Batch',
      EachQuantity: '',
    }
  })

  // Load data from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        const parsedData = JSON.parse(stored)
        setBatchData(parsedData)
      } catch (error) {
        console.error('Error parsing stored batch sale data:', error)
      }
    }
  }, [])

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    if (batchData.addedItems.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(batchData))
    }
  }, [batchData])

  const updateBatchData = (updates: Partial<BatchSaleData>) => {
    setBatchData(prev => ({ ...prev, ...updates }))
  }

  const addItem = (item: BatchSaleItem, itemId: string, itemName: string, quantity: number) => {
    setBatchData(prev => ({
      ...prev,
      addedItems: [...prev.addedItems, item],
      salesTotal: prev.salesTotal + item.totalAmount,
      salesQuantity: prev.salesQuantity + quantity,
      salesIdFromNames: prev.salesIdFromNames 
        ? `${prev.salesIdFromNames}, ${itemId}` 
        : itemId,
      salesItems: prev.salesItems 
        ? `${prev.salesItems}, ${itemName}` 
        : itemName,
      salesQuantityList: prev.salesQuantityList 
        ? `${prev.salesQuantityList},${quantity}` 
        : quantity.toString(),
    }))
  }

  const clearBatchData = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY)
    }
    setBatchData({
      addedItems: [],
      salesTotal: 0,
      salesQuantity: 0,
      salesIdFromNames: '',
      salesItems: '',
      salesQuantityList: '',
      formData: {
        Full_name: '',
        Contact: '',
        Payment_method: '',
        Transaction_id: '',
        Receipt: null,
        Sale_type: 'Batch',
        EachQuantity: '',
      }
    })
  }

  return {
    batchData,
    updateBatchData,
    addItem,
    clearBatchData
  }
}