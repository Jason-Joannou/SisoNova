'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { LoadingState } from '@/components/loading'

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const handleCallback = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const { data: { session }, error } = await supabase.auth.getSession()

      if (error) {
        console.error('Auth error:', error)
        window.location.href = '/login'
        return
      }

      if (session) {
        console.log('Session established, redirecting to dashboard')
        // Refresh the router cache before navigating
        router.refresh()
        await new Promise(resolve => setTimeout(resolve, 100))
        router.push('/dashboard')
      } else {
        console.log('No session found')
        window.location.href = '/login'
      }
    }

    handleCallback()
  }, [router])

  return (
    <LoadingState variant="full-page" label="Authenticating..." />
  )
}