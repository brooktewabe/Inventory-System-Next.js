'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import Swal from 'sweetalert2'
import { toast } from 'react-toastify'
import { FaSearch, FaInfoCircle, FaUpload, FaTimes } from 'react-icons/fa'
import Layout from '@/components/Layout'
import ProtectedRoute from '@/components/ProtectedRoute'
import Spinner from '@/components/Spinner'
import ItemSelector from '@/components/ItemSelector'
import { useAuth } from '@/hooks/useAuth'
import { useBatchSale } from '@/hooks/useBatchSale'
import api from '@/lib/axios'

interface StockItem {
  id: string
  Name: string
  Price: number
  Curent_stock: number
  Restock_level: number
}

interface SaleItem {
  itemName: string
  quantity: number
  price: number
  totalAmount: number
}

export default function BatchSalePage() {
  const router = useRouter()
  const { user } = useAuth()
  const { batchData, updateBatchData, addItem, clearBatchData } = useBatchSale()
  
  const [items, setItems] = useState<SaleItem[]>([{
    itemName: '',
    quantity: 0,
    price: 0,
    totalAmount: 0,
  }])

  const { data: stockData, isLoading } = useQuery({
    queryKey: ['stock', 'store'],
    queryFn: async () => {
      const response = await api.get('/stock/all/store')
      return response.data.data as StockItem[]
    }
  })

  useEffect(() => {
    // Restore form data if it exists
    if (batchData.formData.Full_name) {
      // Form data is already loaded from the hook
    }
  }, [batchData])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    updateBatchData({
      formData: { ...batchData.formData, [name]: value }
    })
  }

  const handleItemChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setItems(prevItems => {
      const updatedItems = [...prevItems]
      updatedItems[index] = { ...updatedItems[index], [name]: value }

      const selectedItem = stockData?.find(sl => sl.id === updatedItems[index].itemName)

      // If item name is selected, set default price
      if (name === 'itemName' && selectedItem) {
        updatedItems[index].price = selectedItem.Price || 0
      }

      // Recalculate total using quantity * price
      const quantity = parseFloat(updatedItems[index].quantity.toString()) || 0
      const price = parseFloat(updatedItems[index].price.toString()) || 0
      updatedItems[index].totalAmount = quantity * price

      return updatedItems
    })
  }

  const getSelectedIds = () => {
    if (!batchData.salesIdFromNames) return []
    return batchData.salesIdFromNames.split(',').map(id => id.trim())
  }

  const addMoreItem = async () => {
    const currentItem = items[items.length - 1]
    if (!currentItem.itemName || !currentItem.quantity) {
      Swal.fire({
        title: 'Error!',
        text: 'Item Name and Quantity are required for the current item.',
        icon: 'error',
        confirmButtonColor: '#d33',
        confirmButtonText: 'OK',
      })
      return
    }

    // Check for required fields
    const requiredFields = ['Full_name', 'Contact']
    for (let field of requiredFields) {
      if (!batchData.formData[field as keyof typeof batchData.formData]) {
        Swal.fire({
          title: 'Error!',
          text: `${field.replace('_', ' ')} is required.`,
          icon: 'error',
          confirmButtonColor: '#d33',
          confirmButtonText: 'OK',
        })
        return
      }
    }

    const selectedItem = stockData?.find(sl => sl.id === currentItem.itemName)
    if (!selectedItem) {
      Swal.fire({
        title: 'Error!',
        text: 'Selected item not found in stock.',
        icon: 'error',
        confirmButtonColor: '#d33',
        confirmButtonText: 'OK',
      })
      return
    }

    const newQuantity = selectedItem.Curent_stock - currentItem.quantity
    if (newQuantity < 0) {
      Swal.fire({
        title: 'Error!',
        text: 'Insufficient stock available.',
        icon: 'error',
        confirmButtonColor: '#d33',
        confirmButtonText: 'OK',
      })
      return
    }

    if (currentItem.quantity < 1) {
      Swal.fire({
        title: 'Error!',
        text: "Quantity can't be negative or zero.",
        icon: 'error',
        confirmButtonColor: '#d33',
        confirmButtonText: 'OK',
      })
      return
    }

    const saleData = {
      ...batchData.formData,
      Product_id: selectedItem.id,
      Quantity: currentItem.quantity,
      Total_amount: currentItem.totalAmount,
      EachQuantity: null,
    }

    try {
      await api.post('/sales/create', saleData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      await api.patch(`/stock/all/sale/${selectedItem.id}`, {
        Curent_stock: newQuantity,
        Name: selectedItem.Name,
      })

      if (newQuantity < selectedItem.Restock_level) {
        await api.post('/notification/create', {
          message: `${selectedItem.Name} is running low on stock.`,
          priority: 'High',
        })
      }

      addItem(
        {
          name: selectedItem.Name,
          quantity: currentItem.quantity,
          totalAmount: currentItem.totalAmount,
        },
        currentItem.itemName,
        selectedItem.Name,
        parseInt(currentItem.quantity.toString(), 10)
      )

      setItems([
        ...items.slice(0, -1),
        {
          itemName: '',
          quantity: 0,
          price: 0,
          totalAmount: 0,
        },
      ])
    } catch (error) {
      console.error('Error creating sale:', error)
      toast.error('Error recording sale. Try again later.')
    }
  }

  const handleSave = async () => {
    const combinedData = {
      Full_name: batchData.formData.Full_name,
      Contact: batchData.formData.Contact,
      Payment_method: batchData.formData.Payment_method,
      Transaction_id: batchData.formData.Transaction_id,
      Receipt: batchData.formData.Receipt,
      Sale_type: 'Batch Sale',
      Product_id: batchData.salesIdFromNames,
      Quantity: batchData.salesQuantity,
      Total_amount: batchData.salesTotal,
      EachQuantity: batchData.salesQuantityList,
      Item_List: batchData.salesItems,
    }

    if (!batchData.formData.Payment_method) {
      Swal.fire({
        title: 'Error!',
        text: 'Payment method is required.',
        icon: 'error',
        confirmButtonColor: '#d33',
        confirmButtonText: 'OK',
      })
      return
    }

    try {
      const response = await api.post('/sales/create', combinedData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      if (response.status === 201) {
        clearBatchData()
        Swal.fire({
          title: 'Success!',
          text: 'Sale saved successfully.',
          icon: 'success',
          confirmButtonColor: '#2563eb',
          confirmButtonText: 'OK',
        })
        router.push('/')
      }
    } catch (error) {
      console.error('Error saving sales:', error)
      toast.error('Error saving sales. Please try again.')
    }
  }

  const handleCancel = () => {
    router.push('/')
  }

  if (isLoading || !stockData) {
    return (
      <Layout>
        <Spinner />
      </Layout>
    )
  }

  return (
    <Layout>
      <section className="bg-[#edf0f0b9] h-full">
        <div className="container m-auto">
          <div className="grid grid-cols-1 gap-6">
            <div className="bg-white flex justify-between">
              <p className="text-lg sm:text-xl font-bold whitespace-nowrap">
                <span className="sm:hidden">Store</span>
                <span className="hidden sm:inline">Store Management System</span>
              </p>
              <div className="flex flex-col items-center justify-center bg-blue-500 text-white rounded-lg w-32 mr-2">
                <p className="font-semibold">{user?.name}</p>
                <p className="text-xs">{user?.role}</p>
              </div>
            </div>
            
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto">
                <div className="flex items-center mb-6 pb-2 border-b">
                  <FaInfoCircle className="text-blue-600 mr-2" />
                  <h2 className="text-lg font-medium">Point of Sale (Batch)</h2>
                </div>

                {/* Buyer Information */}
                <h4 className="text-base font-bold mb-4">Buyer Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm mb-1">Full Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                        <FaSearch className="text-blue-600" />
                      </div>
                      <input
                        type="text"
                        name="Full_name"
                        placeholder="Enter name"
                        value={batchData.formData.Full_name}
                        onChange={handleChange}
                        className="w-full pl-10 py-2 bg-gray-50 border border-gray-200 rounded-md focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Phone Number</label>
                    <input
                      type="text"
                      name="Contact"
                      placeholder="Enter Phone Number"
                      value={batchData.formData.Contact}
                      onChange={handleChange}
                      className="w-full py-2 bg-gray-50 border border-gray-200 rounded-md focus:outline-none"
                    />
                  </div>
                </div>
                
                <br />
                <hr />
                <br />
                
                {batchData.addedItems.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-md font-bold mb-4">Added Items</h3>
                    {batchData.addedItems.map((item, index) => (
                      <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4 bg-gray-50 p-4 rounded-lg">
                        <div>
                          <label className="block text-sm font-bold text-gray-700">Item Name</label>
                          <input
                            type="text"
                            value={item.name}
                            readOnly
                            className="mt-1 block w-full border border-gray-300 rounded-lg p-2 bg-gray-100"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-700">Quantity</label>
                          <input
                            type="number"
                            value={item.quantity}
                            readOnly
                            className="mt-1 block w-full border border-gray-300 rounded-lg p-2 bg-gray-100"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-700">Total Amount</label>
                          <input
                            type="number"
                            value={item.totalAmount}
                            readOnly
                            className="mt-1 block w-full border border-gray-300 rounded-lg p-2 bg-gray-100"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Order Information */}
                <h4 className="text-base font-bold mb-4 mt-6">Order Information</h4>
                {items.map((item, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                    <ItemSelector
                      index={index}
                      item={item}
                      handleItemChange={handleItemChange}
                      getSelectedIds={getSelectedIds}
                      stockData={stockData}
                    />

                    <div>
                      <label className="block text-sm mb-1">Quantity</label>
                      <input
                        type="number"
                        name="quantity"
                        placeholder="Enter quantity"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, e)}
                        className="w-full py-2 bg-gray-50 border border-gray-200 rounded-md focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-1">Price</label>
                      <input
                        type="number"
                        name="price"
                        placeholder="Enter price"
                        value={item.price}
                        onChange={(e) => handleItemChange(index, e)}
                        className="w-full py-2 bg-gray-50 border border-gray-200 rounded-md focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-1">Total Amount</label>
                      <input
                        type="number"
                        placeholder="Total Amount"
                        value={item.totalAmount}
                        readOnly
                        className="w-full py-2 bg-gray-50 border border-gray-200 rounded-md focus:outline-none"
                      />
                    </div>
                  </div>
                ))}
                
                <div className="flex justify-end mb-6">
                  <button
                    type="button"
                    onClick={addMoreItem}
                    className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
                  >
                    Add To Sale
                  </button>
                </div>

                {/* Payment Information */}
                <h4 className="text-base font-bold mb-4">Payment Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm mb-1">Transaction ID</label>
                    <input
                      type="text"
                      name="Transaction_id"
                      placeholder="Enter transaction ID"
                      value={batchData.formData.Transaction_id}
                      onChange={handleChange}
                      className="w-full py-2 bg-gray-50 border border-gray-200 rounded-md focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Payment Method</label>
                    <select
                      name="Payment_method"
                      value={batchData.formData.Payment_method}
                      onChange={handleChange}
                      className="w-full py-2 bg-gray-50 border border-gray-200 rounded-md focus:outline-none"
                    >
                      <option value="" disabled>Select Method</option>
                      <option value="Cash">Cash</option>
                      <option value="Bank Transfer">Bank Transfer</option>
                      <option value="Tele Birr">Tele Birr</option>
                      <option value="E Birr">E Birr</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-40">
                      <input
                        type="file"
                        id="Receipt"
                        name="Receipt"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            const blobURL = URL.createObjectURL(file)
                            updateBatchData({
                              formData: {
                                ...batchData.formData,
                                Receipt: file,
                                ReceiptPreview: blobURL,
                              }
                            })
                          }
                        }}
                        className="hidden"
                        accept=".png, .jpg, .jpeg"
                      />
                      <label
                        htmlFor="Receipt"
                        className="flex items-center justify-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-md cursor-pointer hover:bg-blue-700 transition-colors w-full"
                      >
                        <FaUpload size={16} />
                        <span className="truncate">Upload</span>
                      </label>
                    </div>
                    
                    {(batchData.formData as any).ReceiptPreview && (
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-20 h-20 border border-gray-200 rounded-md overflow-hidden cursor-pointer hover:border-blue-500 transition-colors"
                          onClick={() => window.open((batchData.formData as any).ReceiptPreview, '_blank')}
                          title="Click to view full size"
                        >
                          <img 
                            src={(batchData.formData as any).ReceiptPreview} 
                            alt="Receipt preview" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <button 
                          type="button"
                          onClick={() => updateBatchData({
                            formData: { ...batchData.formData, ReceiptPreview: null } as any
                          })}
                          className="text-gray-500 hover:text-red-500"
                          title="Remove image"
                        >
                          <FaTimes size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                  <div></div>
                  <div>
                    <label className="block text-sm mb-1">Price in ETB</label>
                    <input
                      type="number"
                      value={batchData.salesTotal}
                      disabled
                      className="w-1/3 py-2 bg-gray-50 border border-gray-200 rounded-md focus:outline-none"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-4">
                  {batchData.addedItems.length === 0 && (
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="border border-gray-400 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-100 transition"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={batchData.salesTotal === 0}
                    className={`px-6 py-2 rounded-md text-white transition ${
                      batchData.salesTotal === 0
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    Save Sale
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>
    </Layout>
  )
}