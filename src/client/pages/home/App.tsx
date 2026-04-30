import { GameList } from '@client/components/game-list/GameList'
import { TopMenuFilters } from '@client/components/layout/header/top-menu-filters/TopMenuFilters'
import { PollBanner } from '@client/components/PollBanner'
import { SuggestionBar } from '@client/components/SuggestionBar'
import { api } from '@client/api/axios'
import { Captcha } from '@client/components/ui/Captcha'
import { useDebounce } from '@client/hooks/useDebounce'
import { useGames } from '@client/hooks/useGames'
import type { TurnstileInstance } from '@marsidev/react-turnstile'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useQueryState } from 'nuqs'
import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

type UserMe = { id: string; username: string }

export function App() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [genreSlug] = useQueryState('genre')
  const [searchTerm, setSearchTerm] = useQueryState('search')
  const { data: user } = useQuery<UserMe | null>({
    queryKey: ['user-me'],
    queryFn: () =>
      api
        .get<UserMe>('/auth/user/me')
        .then(res => res.data)
        .catch(() => null),
    retry: false
  })

  const debouncedSearch = useDebounce(searchTerm, 500)

  const { data: games = [], isLoading: isGamesLoading } = useGames({
    genreSlug,
    searchTerm: debouncedSearch
  })

  const [token, setToken] = useState<string | null>(null)
  const captchaRef = useRef<TurnstileInstance>(null)
  const captchaContainerRef = useRef<HTMLDivElement>(null)
  const logoutMutation = useMutation({
    mutationKey: ['user-logout'],
    mutationFn: () => api.post('/auth/user/logout'),
    onSuccess: () => {
      queryClient.setQueryData<UserMe | null>(['user-me'], null)
      queryClient.invalidateQueries({ queryKey: ['user-me'] })
      toast.success('Logged out')
    }
  })

  const scrollToCaptcha = () => {
    captchaContainerRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const resetCaptcha = () => {
    setToken(null)
    captchaRef.current?.reset()
  }

  return (
    <div className='mb-10'>
      <TopMenuFilters />
      <div className='fixed top-3 right-3 z-30 flex max-w-[calc(100vw-1.5rem)] flex-wrap items-center justify-end gap-2 sm:top-4 sm:right-4 sm:max-w-none'>
        {user ? (
          <>
            <div className='max-w-[48vw] truncate rounded-lg border border-accent/40 bg-dark/70 px-3 py-2 font-serif text-xs text-accent sm:max-w-none sm:px-4 sm:text-sm'>
              {user.username}
            </div>
            <button
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isPending}
              className='rounded-lg border border-white/10 bg-dark/70 px-3 py-2 font-serif text-xs text-white transition-colors hover:border-accent/50 disabled:opacity-60 sm:px-4 sm:text-sm'
            >
              Logout
            </button>
          </>
        ) : (
          <button
            onClick={() => {
              toast('You are an administrator?', {
                action: {
                  label: 'Yes',
                  onClick: () => navigate('/blade/auth')
                },
                cancel: {
                  label: 'No',
                  onClick: () => navigate('/auth/login')
                }
              })
            }}
            className='rounded-lg border border-white/10 bg-dark/70 px-3 py-2 font-serif text-xs text-white transition-colors hover:border-accent/50 sm:px-4 sm:text-sm'
          >
            Login
          </button>
        )}
      </div>
      <div className='mx-auto mt-6 flex w-full max-w-md items-center gap-2'>
        <input
          type='text'
          placeholder='Search your favorite games...'
          value={searchTerm ?? ''}
          onChange={e => setSearchTerm(e.target.value || null)}
          className='flex-1 px-4 py-2 bg-dark/70 border border-white/10 rounded-lg text-white placeholder:text-gray focus:outline-none focus:border-accent/50 font-serif'
        />
        <button
          onClick={() => {
            setSearchTerm(null)
            navigate('/')
          }}
          className='px-4 py-2 bg-dark/70 border border-white/10 rounded-lg text-white hover:border-accent/50 transition-colors font-serif whitespace-nowrap'
        >
          All
        </button>
      </div>
      <GameList games={games} isLoading={isGamesLoading} />

      <div className='rounded-xl border border-accent/30 bg-dark/60 p-3 sm:p-4'>
        <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
          <SuggestionBar
            genreSlug={genreSlug}
            token={token}
            onNeedCaptcha={scrollToCaptcha}
            onUsed={resetCaptcha}
          />
          <PollBanner
            token={token}
            onNeedCaptcha={scrollToCaptcha}
            onUsed={resetCaptcha}
          />
        </div>

        <div ref={captchaContainerRef} className='mt-4 flex justify-center'>
          <Captcha ref={captchaRef} onSuccess={setToken} />
        </div>
      </div>
    </div>
  )
}
