'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '../AuthContext'
import { useRouter } from 'next/navigation'
import { supabase } from '../client'
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  CircularProgress,
  Stack,
} from '@mui/material'
import dayjs from 'dayjs'

export default function Dashboard() {
  const { token, setToken } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
  const hash = window.location.hash
  if (hash.includes('access_token')) {
    const params = new URLSearchParams(hash.slice(1))
    const access_token = params.get('access_token')
    const refresh_token = params.get('refresh_token')

    if (access_token && refresh_token) {
      supabase.auth.setSession({ access_token, refresh_token }).then(() => {
        window.history.replaceState(null, '', window.location.pathname)
      })
    }
  }
}, [])

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

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    )
  }

  if (!token) return null

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="#f9f9f9"
      px={2}
    >
      <Card sx={{ minWidth: 400, p: 3, boxShadow: 5 }}>
        <CardContent>
          <Typography variant="h4" gutterBottom align="center">
            Особистий кабінет
          </Typography>

          <Stack spacing={2} mt={3}>
            <Info label="Email" value={token.user.email ?? '—'} />
            <Info label="ID користувача" value={token.user.id} />
            <Info
              label="Дата створення"
              value={dayjs(token.user.created_at).format('DD.MM.YYYY HH:mm')}
            />
          </Stack>

          <Button
            onClick={handleLogout}
            variant="contained"
            color="error"
            fullWidth
            sx={{ mt: 4 }}
          >
            Вийти
          </Button>
        </CardContent>
      </Card>
    </Box>
  )
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <Box>
      <Typography variant="subtitle2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body1">{value}</Typography>
    </Box>
  )
}
