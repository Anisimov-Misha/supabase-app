'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../client'

function parseHashParams(hash: string) {
  if (!hash) return {}
  return Object.fromEntries(
    hash.substring(1).split('&').map(param => {
      const [key, value] = param.split('=')
      return [key, decodeURIComponent(value.replace(/\+/g, ' '))]
    })
  )
}

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [isValidLink, setIsValidLink] = useState(true)

  const router = useRouter()

  useEffect(() => {
    const hashParams = parseHashParams(window.location.hash)
    if (hashParams.error) {
      setError(`Помилка: ${hashParams.error_description || hashParams.error}`)
      setIsValidLink(false)
    } else {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (!session) {
          setError('Ви не авторизовані. Будь ласка, увійдіть заново.')
          setIsValidLink(false)
          setTimeout(() => router.push('/'), 1500)
        }
      })
    }
  }, [router])

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setMessage(null)

    if (password.length < 6) {
      setError('Пароль повинен бути не менше 6 символів.')
      return
    }
    if (password !== confirmPassword) {
      setError('Паролі не співпадають.')
      return
    }

    setLoading(true)

    const { error } = await supabase.auth.updateUser({
      password,
    })

    setLoading(false)

    if (error) {
      setError(error.message)
    } else {
      setMessage('Пароль успішно оновлено. Ви будете перенаправлені на головну сторінку.')
      setTimeout(() => router.push('/'), 3000)
    }
  }

  if (!isValidLink) {
    return (
      <div style={{ maxWidth: 400, margin: 'auto', padding: 20 }}>
        <h1>Скидання паролю</h1>
        <p style={{ color: 'red' }}>{error}</p>
        <p>Будь ласка, спробуйте надіслати лист зі скиданням паролю ще раз.</p>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 400, margin: 'auto', padding: 20 }}>
      <h1>Оновлення паролю</h1>
      <form onSubmit={handleUpdatePassword}>
        <label htmlFor="password">Новий пароль:</label><br />
        <input
          id="password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          minLength={6}
          style={{ width: '100%', padding: 8, margin: '8px 0' }}
        />

        <label htmlFor="confirmPassword">Підтвердіть пароль:</label><br />
        <input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          required
          minLength={6}
          style={{ width: '100%', padding: 8, margin: '8px 0' }}
        />

        <button type="submit" disabled={loading} style={{ padding: 10, width: '100%' }}>
          {loading ? 'Оновлення...' : 'Оновити пароль'}
        </button>
      </form>

      {message && <p style={{ color: 'green', marginTop: 10 }}>{message}</p>}
      {error && <p style={{ color: 'red', marginTop: 10 }}>{error}</p>}
    </div>
  )
}
