'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../AuthContext'
import { supabase } from '../../client'

export default function AuthCallback() {
  const router = useRouter()
  const { setToken } = useAuth()

  useEffect(() => {
    const handleAuthCallback = async () => {
      if (typeof window === 'undefined') return

      const hash = window.location.hash
      const params = new URLSearchParams(hash.substring(1)) 

      const access_token = params.get('access_token')
      const refresh_token = params.get('refresh_token')
      const type = params.get('type')

      if (!access_token || !refresh_token) {
        console.error('Не знайдено токенів у URL')
        return router.replace('/signin')
      }

      const { data, error } = await supabase.auth.setSession({
        access_token,
        refresh_token,
      })

      if (error || !data.session) {
        console.error('Помилка при встановленні сесії:', error)
        return router.replace('/signin')
      }

      setToken(data.session)
      sessionStorage.setItem('token', JSON.stringify(data.session))

      window.history.replaceState(null, '', window.location.pathname)

      if (type === 'recovery') {
        router.replace('/reset-password-confirm') 
      } else {
        router.replace('/dashboard') 
      }
    }

    handleAuthCallback()
  }, [router, setToken])

  return <p>Перевірка авторизації...</p>
}
