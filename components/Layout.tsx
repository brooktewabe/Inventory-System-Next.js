'use client'

import { useAuth } from '@/hooks/useAuth'
import { useSidebar } from '@/hooks/useSidebar'
import Navbar from './Navbar'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const { user } = useAuth()
  const { isCollapsed, isMobile } = useSidebar()

  // Calculate margin based on sidebar state
  const getMarginLeft = () => {
    if (!user) return '0'
    if (isMobile) return '62px'
    return isCollapsed ? '100px' : '207px'
  }

  return (
    <div className="min-h-screen bg-[#edf0f0b9]">
      {user && <Navbar />}
      <div 
        className="transition-all duration-300"
        style={{ 
          marginLeft: getMarginLeft(),
          minHeight: '100vh'
        }}
      >
        {children}
      </div>
    </div>
  )
}