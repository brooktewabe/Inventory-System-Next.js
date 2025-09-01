'use client'

import { useState, useEffect } from 'react'

export function useSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Check if we're on the client side
    if (typeof window === 'undefined') return

    const handleResize = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      
      // Auto-collapse on mobile
      if (mobile) {
        setIsCollapsed(true)
      } else {
        // Restore saved state on desktop
        const saved = localStorage.getItem('sidebarCollapsed')
        setIsCollapsed(saved === 'true')
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const toggle = () => {
    if (isMobile) return // Don't allow toggle on mobile
    
    const newState = !isCollapsed
    setIsCollapsed(newState)
    localStorage.setItem('sidebarCollapsed', newState.toString())
  }

  return {
    isCollapsed,
    isMobile,
    toggle
  }
}