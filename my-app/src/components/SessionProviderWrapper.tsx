'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseBrowserClient'

export function SessionProviderWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    // Initialize session on app start
    const initializeSession = async () => {
      try {
        // Get current session
        const { data: { session } } = await supabase.auth.getSession()
        
        // If there's a session, refresh it
        if (session) {
          await supabase.auth.refreshSession()
        }
      } catch (error) {
        console.error('Session initialization error:', error)
      } finally {
        setIsInitialized(true)
      }
    }

    initializeSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        // This keeps session in sync across tabs
      }
    )

    return () => {
      subscription?.unsubscribe()
    }
  }, [])

  // Wait for session initialization before rendering
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return <>{children}</>
}