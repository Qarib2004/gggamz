import { api } from '@client/api/axios'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export function AdminLoginForm() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const navigate = useNavigate()

  const { mutate, error } = useMutation({
    mutationKey: ['admin-login'],
    mutationFn: () => api.post('/auth/login', { username, password }),
    onSuccess: data => {
      navigate('/blade', {
        replace: true
      })
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    mutate()
  }

  return (
    <form
      onSubmit={handleSubmit}
      className='mx-auto mt-12 w-full max-w-sm space-y-4 rounded-xl border border-white/10 bg-dark/60 p-4 sm:mt-20 sm:p-6'
    >
      <input
        type='text'
        placeholder='Username'
        value={username}
        onChange={e => setUsername(e.target.value)}
        className='w-full px-4 py-2 bg-dark/70 border border-white/10 rounded-lg text-white placeholder:text-gray focus:outline-none focus:border-accent/50 font-serif'
      />
      <input
        type='password'
        placeholder='Password'
        value={password}
        onChange={e => setPassword(e.target.value)}
        className='w-full px-4 py-2 bg-dark/70 border border-white/10 rounded-lg text-white placeholder:text-gray focus:outline-none focus:border-accent/50 font-serif'
      />
      {error && <p className='text-red-500 text-sm'>{error.message}</p>}
      <button className='w-full px-4 py-2 bg-accent text-dark font-serif font-bold rounded-lg hover:bg-accent/80 transition-colors'>
        Login
      </button>
    </form>
  )
}
