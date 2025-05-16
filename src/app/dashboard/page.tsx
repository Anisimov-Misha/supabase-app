'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '../AuthContext'
import { useRouter } from 'next/navigation'
import { supabase } from '../client'

export default function Dashboard() {
  const { token, setToken } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function checkSession() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        setToken(null)
        router.replace('/')
      } else {
        setToken(session)
      }
      setLoading(false)
    }
    checkSession()
  }, [router, setToken])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setToken(null)
    router.replace('/')
  }

  if (loading) return <div>Завантаження...</div>

  if (!token) return null

  return (
    <div>
      <h1>Welcome, {token.user.email}</h1>
      <button onClick={handleLogout}>Logout</button>
    </div>
  )
}
