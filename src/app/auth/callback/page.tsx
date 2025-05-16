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
      const hash = window.location.hash
      const params = new URLSearchParams(hash.substring(1))
      const type = params.get('type')

      const { data, error } = await supabase.auth.getSession()

      if (error || !data.session) {
        console.error('Помилка при отриманні сесії', error)
        return router.replace('/signin')
      }

      setToken(data.session)
      sessionStorage.setItem('token', JSON.stringify(data.session))

      window.history.replaceState(null, '', '/')

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
