import { GameList } from '@client/components/game-list/GameList'
import { TopMenuFilters } from '@client/components/layout/header/top-menu-filters/TopMenuFilters'
import { PollBanner } from '@client/components/PollBanner'
import { SuggestionBar } from '@client/components/SuggestionBar'
import { Captcha } from '@client/components/ui/Captcha'
import { useDebounce } from '@client/hooks/useDebounce'
import { useGames } from '@client/hooks/useGames'
import type { TurnstileInstance } from '@marsidev/react-turnstile'
import { useQueryState } from 'nuqs'
import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export function App() {
  const navigate = useNavigate()
  const [genreSlug] = useQueryState('genre')
  const [searchTerm, setSearchTerm] = useQueryState('search')

  const debouncedSearch = useDebounce(searchTerm, 500)

  const { data: games = [], isLoading: isGamesLoading } = useGames({
    genreSlug,
    searchTerm: debouncedSearch
  })

  const [token, setToken] = useState<string | null>(null)
  const captchaRef = useRef<TurnstileInstance>(null)
  const captchaContainerRef = useRef<HTMLDivElement>(null)

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
      <div className='mt-6 flex items-center gap-2 max-w-md mx-auto'>
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

      <div className='p-4 bg-dark/60 border border-accent/30 rounded-xl'>
        <div className='grid grid-cols-2 gap-4'>
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
