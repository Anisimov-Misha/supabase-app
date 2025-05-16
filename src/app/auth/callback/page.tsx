'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../AuthContext'
import { supabase } from '../../client'

export default function AuthCallback() {
  const router = useRouter()
  const { setToken } = useAuth()

  useEffect(() => {
    const handleAuth = async () => {
      const { data, error } = await supabase.auth.getSession()
      if (error) {
        console.error('Error fetching session', error)
        return router.push('/signin')
      }

      if (data?.session) {
        setToken(data.session)
        sessionStorage.setItem('token', JSON.stringify(data.session))
        router.push('/dashboard')
      } else {
        router.push('/signin')
      }
    }

    handleAuth()
  }, [router, setToken])

  return <p>Перевірка авторизації...</p>
}
