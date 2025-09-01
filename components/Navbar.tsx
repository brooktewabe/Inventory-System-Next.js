'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import Modal from 'react-modal'
import { useAuth } from '@/hooks/useAuth'
import { useSidebar } from '@/hooks/useSidebar'
import {
  AiOutlineMenu,
  AiOutlineBars,
  AiTwotonePlusCircle,
  AiFillSetting,
  AiOutlineShop,
  AiOutlineBell,
  AiOutlineContacts
} from 'react-icons/ai'
import { BiHorizontalCenter, BiSolidDashboard } from 'react-icons/bi'
import { CiLogout } from 'react-icons/ci'

// Set app element for modal accessibility
if (typeof window !== 'undefined') {
  Modal.setAppElement('body')
}

export default function Navbar() {
  const { user, logout } = useAuth()
  const { isCollapsed, isMobile, toggle } = useSidebar()
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  if (!user) return null

  const menuSection = [
    {
      icon: <BiSolidDashboard size={20} className={isMobile ? "" : "mr-4"} />,
      text: "Inventory Dashboard",
      link: "/dashboard",
    },
    {
      icon: <AiOutlineShop size={20} className={isMobile ? "" : "mr-4"} />,
      text: "Store Management",
      link: "/sales",
    },
  ]

  const functionSection = [
    {
      icon: <AiTwotonePlusCircle size={20} className={isMobile ? "" : "mr-4"} />,
      text: "Inventory Management",
      link: "/warehouse",
    },
    {
      icon: <AiOutlineBars size={20} className={isMobile ? "" : "mr-4"} />,
      text: "Inventory Report",
      link: "/sales-history",
    },
    {
      icon: <BiHorizontalCenter size={25} className={isMobile ? "" : "mr-4"} />,
      text: "Stock Movement",
      link: "/stock-movement",
    },
    {
      icon: <AiOutlineContacts size={20} className={isMobile ? "" : "mr-4"} />,
      text: "CMS",
      link: "/customers-list",
    },
  ]

  const bottomSection = [
    {
      icon: <AiOutlineBell size={20} className={isMobile ? "" : "mr-3"} />,
      text: "Notifications",
      link: "/notification",
    },
    {
      icon: <AiFillSetting size={20} className={isMobile ? "" : "mr-3"} />,
      text: "Settings",
      link: "/settings",
    },
  ]

  const handleLogout = async () => {
    setModalIsOpen(false)
    await logout()
  }

  const renderMenuItems = (items: typeof menuSection, sectionTitle?: string) => (
    <div className="mb-6">
      {(!isMobile || !isCollapsed) && sectionTitle && (
        <h3 className="text-xs font-semibold text-gray-500 mb-2 px-4">{sectionTitle}</h3>
      )}
      <ul className="space-y-1">
        {items.map((item, index) => (
          <li key={index}>
            <Link
              href={item.link}
              className={`flex items-center ${isMobile ? "justify-center px-2" : "px-4"} py-2 text-sm rounded-md transition-colors ${
                pathname === item.link ? "bg-blue-100 text-black-700" : "text-gray-700 hover:bg-gray-100"
              } ${isCollapsed && "justify-center"}`}
              title={isMobile ? item.text : ""}
            >
              <span className="flex items-center">{item.icon}</span>
              {(!isMobile && !isCollapsed) && <span>{item.text}</span>}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )

  return (
    <>
      <div
        className={`fixed top-0 left-0 h-screen bg-white border-r border-gray-200 z-50 transition-all duration-300 flex flex-col
          ${isMobile ? "w-[62px]" : isCollapsed ? "w-[100px]" : "w-[207px]"}`}
      >
        {/* Header */}
        <div className="bg-blue-600 py-[10px] px-4 flex items-center justify-between">
          {!isMobile && !isCollapsed && (
            <h1 className="text-white font-medium text-sm">Inventory Management</h1>
          )}
          {!isMobile && (
            <AiOutlineMenu
              size={20}
              className={`text-white cursor-pointer p-1 rounded hover:bg-blue-700 ${isCollapsed && "mx-auto"}`}
              onClick={toggle}
            />
          )}
          {isMobile && (
            <AiOutlineMenu
              size={20}
              className="text-white cursor-pointer p-1 rounded hover:bg-blue-700 mx-auto"
            />
          )}
        </div>

        {/* Navigation sections */}
        <div className="flex-1 py-4">
          {renderMenuItems(menuSection, "MENU")}
          {renderMenuItems(functionSection, "FUNCTION")}
        </div>

        {/* Bottom section */}
        <div className="border-t border-gray-200 pt-4 pb-6">
          {renderMenuItems(bottomSection)}

          <div className="px-4 mt-4">
            <button
              onClick={() => setModalIsOpen(true)}
              className={`flex items-center ${isMobile ? "justify-center" : ""} w-full px-2 py-2 text-sm rounded-md text-red-600 hover:bg-red-50 transition-colors
                ${isCollapsed && "justify-center"}`}
              title={isMobile ? "Logout" : ""}
            >
              <CiLogout size={20} className={isMobile || isCollapsed ? "mx-auto" : "mr-3"} />
              {!isMobile && !isCollapsed && <span>Logout</span>}
            </button>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Confirm Logout"
        className="bg-white p-6 rounded-lg shadow-md w-4/5 md:w-1/3 mx-auto mr-4"
        overlayClassName="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50"
      >
        <div className="text-center mb-4">
          <CiLogout size={50} className="mx-auto mb-4" />
          <p className="mb-4 text-center">Are you sure you want to logout?</p>
        </div>
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => setModalIsOpen(false)}
            className="border border-gray-700 px-6 py-2 w-32 rounded-full text-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-6 py-2 w-32 rounded-full"
          >
            Yes
          </button>
        </div>
      </Modal>
    </>
  )
}