import { api } from '@client/api/axios'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

type Mode = 'login' | 'register'

interface Props {
  mode: Mode
}

export function UserAuthPage({ mode }: Props) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const isLogin = mode === 'login'

  const authMutation = useMutation({
    mutationKey: ['user-auth', mode],
    mutationFn: async () => {
      const path = isLogin ? '/auth/user/login' : '/auth/user/register'
      return api.post(path, { username, password })
    },
    onSuccess: response => {
      if (isLogin) {
        queryClient.setQueryData(['user-me'], response.data.user)
        toast.success('Logged in successfully')
        navigate('/', { replace: true })
        return
      }

      toast.success('Account created. Now log in.')
      navigate('/auth/login', { replace: true })
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      toast.error(error.response?.data?.message || 'Request failed')
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    authMutation.mutate()
  }

  return (
    <div className='mx-auto mt-12 w-full max-w-md rounded-xl border border-white/10 bg-dark/70 p-4 sm:mt-20 sm:p-6'>
      <h1 className='font-serif text-xl text-accent sm:text-2xl'>
        {isLogin ? 'User Login' : 'User Registration'}
      </h1>
      <p className='mt-2 text-sm text-white/70'>
        {isLogin
          ? 'Sign in to leave comments on games.'
          : 'Create an account to post comments.'}
      </p>

      <form onSubmit={handleSubmit} className='mt-6 space-y-4'>
        <input
          type='text'
          placeholder='Username'
          value={username}
          onChange={e => setUsername(e.target.value)}
          className='w-full rounded-lg border border-white/10 bg-dark px-4 py-2 text-white placeholder:text-gray focus:border-accent/50 focus:outline-none'
          minLength={3}
          required
        />
        <input
          type='password'
          placeholder='Password'
          value={password}
          onChange={e => setPassword(e.target.value)}
          className='w-full rounded-lg border border-white/10 bg-dark px-4 py-2 text-white placeholder:text-gray focus:border-accent/50 focus:outline-none'
        />

        <button
          disabled={authMutation.isPending}
          className='w-full rounded-lg bg-accent px-4 py-2 font-serif font-bold text-dark hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-60'
        >
          {authMutation.isPending
            ? 'Please wait...'
            : isLogin
              ? 'Login'
              : 'Register'}
        </button>
      </form>

      <div className='mt-4 text-sm text-white/70'>
        {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
        <Link
          to={isLogin ? '/auth/register' : '/auth/login'}
          className='text-accent hover:underline'
        >
          {isLogin ? 'Register' : 'Login'}
        </Link>
      </div>
    </div>
  )
}
