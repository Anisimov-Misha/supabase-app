'use client'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import { supabase } from '../client';
import { useRouter } from 'next/navigation';

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  [theme.breakpoints.up('sm')]: {
    width: '450px',
  },
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

const SignUpContainer = styled(Stack)(({ theme }) => ({
  height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
  minHeight: '100%',
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
  '&::before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    zIndex: -1,
    inset: 0,
    backgroundImage:
      'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
    backgroundRepeat: 'no-repeat',
    ...theme.applyStyles('dark', {
      backgroundImage:
        'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
    }),
  },
}));

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
    <>
        <SignUpContainer direction="column" justifyContent="space-between">
            <Card variant="outlined">

                <Typography component="h1" variant="h4" sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }} >Оновлення паролю</Typography>
          
                <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }} onSubmit={handleUpdatePassword}>

                    <FormControl>
                        <FormLabel htmlFor="email">Новий пароль:</FormLabel>
                        <TextField
                            required
                            fullWidth
                            id="password"
                            placeholder="******"
                            name="password"
                            variant="outlined"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </FormControl>

                    <FormControl>
                        <FormLabel htmlFor="email">Підтвердіть пароль</FormLabel>
                        <TextField
                            required
                            fullWidth
                            id="confirmpassword"
                            placeholder="******"
                            name="password"
                            variant="outlined"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </FormControl>

                    <Button type="submit" fullWidth variant="contained">Відновити</Button>

                    {message && (
                      <Typography sx={{ color: 'green', textAlign: 'center' }}>
                        {message}
                      </Typography>
                    )}
                    {error && (
                      <Typography sx={{ color: 'red', textAlign: 'center' }}>
                        {error}
                      </Typography>
                    )}
          
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Typography sx={{ textAlign: 'center' }}>Вже є аккаунт?
                        <Link href="/" variant="body2" sx={{ alignSelf: 'center' }}> Увійти</Link>
                    </Typography>

                </Box>
            </Card>
      </SignUpContainer>
    </>
  )
}
