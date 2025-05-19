'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '../AuthContext'
import { useRouter } from 'next/navigation'
import { supabase } from '../client'
import {
  Box,
  Button,
  CircularProgress,
  Typography,
  Stack,
  Divider,
} from '@mui/material'
import dayjs from 'dayjs'
import UploadForm from '../UploadForm'
import Link from 'next/link'

export default function Dashboard() {
  const { token, setToken } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [uploadOpen, setUploadOpen] = useState(false)

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
      const {
        data: { session },
      } = await supabase.auth.getSession()
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
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    )
  }

  if (!token) return null

  return (
    <Box px={2} py={3} bgcolor="#f9f9f9" minHeight="100vh">
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={2}
        flexWrap="wrap"
        gap={1}
      >
        <Stack direction="row" spacing={4} alignItems="center" flexWrap="wrap">
          <Info label="Email" value={token.user.email ?? '—'} />
          <Info label="ID користувача" value={token.user.id} />
          <Info
            label="Дата створення"
            value={dayjs(token.user.created_at).format('DD.MM.YYYY HH:mm')}
          />
        </Stack>

          <Link href="/dashboard/tasks" passHref>
            <Button
              variant="contained"
              size="large"
              sx={{
                fontSize: '1.1rem',
                paddingX: 3,
                paddingY: 1.5,
              }}
            >
              Мій ToDo - list
            </Button>
          </Link>

        <Button variant="outlined" color="error" onClick={handleLogout}>
          Вийти
        </Button>
      </Box>

      <Divider sx={{ mb: 2 }} />

      <Button
        variant="contained"
        onClick={() => setUploadOpen(true)}
        sx={{ mb: 2 }}
      >
        Додати фото
      </Button>

      <UploadForm open={uploadOpen} onClose={() => setUploadOpen(false)} />
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
