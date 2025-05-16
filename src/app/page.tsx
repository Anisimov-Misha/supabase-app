'use client'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import { redirect } from 'next/navigation';
import { supabase } from './client';
import { useAuth } from './AuthContext';

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

export default function SignUp() {

    const { token, setToken } = useAuth()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    
    const [passwordError, setPasswordError] = useState(false)
    const [passwordErrorMessage, setPasswordErrorMessage] = useState('')

    const [emailError, setEmailError] = useState(false)
    const [emailErrorMessage, setEmailErrorMessage] = useState('')

    const handleSubmit = async (e: any) => {
        e.preventDefault()

        setPasswordError(false)
        setEmailError(false)
        setPasswordErrorMessage('')
        setEmailErrorMessage('')
        if(!isValidEmail(email)){
            setEmailError(true)
            setEmailErrorMessage('Не валідний email!')
            return;
        }
        if(password.trim().length < 6) {
            setPasswordError(true)
            setPasswordErrorMessage('Пароль має бути не менше 6 символів!')
            return;
        }

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });
        if (error) {
            alert(error.message);
            return;
        }
        setToken(data);
        alert('Перевірте свою електронну пошту, щоб отримати посилання для підтвердження!');
        redirect('/dashboard'); 
    }

    function isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    useEffect(() => {
        if(sessionStorage.getItem('token')) {
           let data = JSON.parse(sessionStorage.getItem('token') || '') 
           setToken(data)
        }
    }, [])

    useEffect(() => {
        if (token) {
            sessionStorage.setItem('token', JSON.stringify(token));
        }
    }, [token]);

  return (
    <>
        <SignUpContainer direction="column" justifyContent="space-between">
            <Card variant="outlined">

                <Typography component="h1" variant="h4" sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }} >Реєстрація</Typography>
          
                <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }} onSubmit={handleSubmit}>

                    <FormControl>
                        <FormLabel htmlFor="email">Email</FormLabel>
                        <TextField
                            required
                            fullWidth
                            id="email"
                            placeholder="your@email.com"
                            name="email"
                            autoComplete="email"
                            variant="outlined"
                            error={emailError}
                            helperText={emailErrorMessage}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </FormControl>

                    <FormControl>
                        <FormLabel htmlFor="password">Password</FormLabel>
                        <TextField
                            required
                            fullWidth
                            name="password"
                            placeholder="••••••"
                            type="password"
                            id="password"
                            autoComplete="new-password"
                            variant="outlined"
                            error={passwordError}
                            helperText={passwordErrorMessage}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </FormControl>

                    <Button type="submit" fullWidth variant="contained">Sign up</Button>
          
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>

                    <Typography sx={{ textAlign: 'center' }}>Вже маєте аккаунт?
                        <Link href="/signin" variant="body2" sx={{ alignSelf: 'center' }}> Увійти</Link>
                    </Typography>

                </Box>
            </Card>
      </SignUpContainer>
    </>
  );
}