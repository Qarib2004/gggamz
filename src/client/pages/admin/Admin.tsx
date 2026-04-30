import { api } from '@client/api/axios'
import { useDebounce } from '@client/hooks/useDebounce'
import { useGenres } from '@client/hooks/useGenres'
import type { TGame } from '@shared/types/game.types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import type { IRawgGame } from './rawg-game.types'
import { useNavigate } from 'react-router-dom'

type GameForm = Pick<
  TGame,
  | 'maxScore'
  | 'review'
  | 'genreId'
  | 'platform'
  | 'externalId'
  | 'title'
  | 'posterUrl'
  | 'metaScore'
  | 'slug'
> & {
  completedAt: string
}

export function Admin() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<IRawgGame | null>(null)

  const debouncedSearch = useDebounce(search)

  const { register, handleSubmit, reset, setValue } = useForm<GameForm>({
    defaultValues: {
      platform: 'PS5 Pro'
    }
  })

  const { data: results = [] } = useQuery({
    queryKey: ['rawg-search', debouncedSearch],
    queryFn: async () => {
      if (!debouncedSearch) return []
      const { data } = await api.get<{ results: IRawgGame[] }>('/rawg/search', {
        params: { q: debouncedSearch }
      })

      return data.results || []
    },
    enabled: !!debouncedSearch
  })

  const handleSelect = (game: IRawgGame) => {
    setSelected(game)
    setSearch('')
    setValue('metaScore', game.metacritic ?? null)
    setValue('completedAt', new Date().toISOString().split('T')[0])
  }

  const { data: genres = [] } = useGenres()

  const queryClient = useQueryClient()

  const { mutate, isPending } = useMutation({
    mutationFn: (data: GameForm) => api.post('/games', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['games'] })
      setSelected(null)
      reset()
      toast.success('Game added!')
    },
    onError: (error: AxiosError<{ error?: string }>) => {
      toast.error(error.response?.data?.error || 'Failed to add game')
    }
  })

  const onSubmit = (data: GameForm) => {
    if (!selected) {
      toast.error('Choose a game first')
      return
    }

    mutate({
      externalId: String(selected.id),
      title: selected.name,
      slug: selected.slug,
      posterUrl: selected.background_image,
      metaScore: +(data.metaScore ?? 0),
      maxScore: +data.maxScore,
      review: data.review,
      platform: data.platform,
      genreId: data.genreId,
      completedAt: new Date(data.completedAt).toISOString()
    })
  }

  return (
    <div className='mx-auto mt-8 w-full max-w-2xl space-y-5 pb-6 sm:mt-10'>
      <h1 className='text-2xl font-serif text-accent'>Add Game</h1>
      <button
        type='button'
        onClick={() => navigate('/')}
        className='rounded-lg border border-white/10 bg-dark/70 px-4 py-2 font-serif text-sm text-white transition-colors hover:border-accent/50'
      >
        Main page
      </button>

      <div className='relative'>
        <input
          type='text'
          placeholder='Search game in RAWG...'
          value={search}
          onChange={e => {
            setSearch(e.target.value)
            if (selected) setSelected(null)
          }}
          className='w-full rounded-lg border border-white/10 bg-dark/70 px-4 py-2 font-serif text-white placeholder:text-gray focus:border-accent/50 focus:outline-none'
        />
        {results.length > 0 && (
          <ul className='absolute z-20 w-full bg-dark border border-white/10 rounded-lg mt-1 max-h-60 overflow-auto'>
            {results.map(g => (
              <li
                key={g.id}
                onClick={() => handleSelect(g)}
                className='px-4 py-2 hover:bg-accent/20 cursor-pointer flex items-center gap-3'
              >
                {g.background_image && (
                  <img
                    src={g.background_image}
                    className='w-10 h-10 object-cover rounded'
                  />
                )}
                <span>{g.name}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {selected && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className='space-y-4 rounded-lg border border-white/10 bg-dark/50 p-3 sm:p-4'
        >
          <div className='flex flex-col gap-4 sm:flex-row'>
            {selected.background_image && (
              <img
                src={selected.background_image}
                className='h-52 w-full rounded object-cover sm:h-40 sm:w-32'
              />
            )}
            <div>
              <h2 className='text-xl font-serif'>{selected.name}</h2>
              <p className='text-gray text-sm'>
                Genres: {selected.genres.map(g => g.name).join(', ') || '—'}
              </p>
              <p className='text-gray text-sm'>
                Metacritic: {selected.metacritic ?? '—'}
              </p>
            </div>
          </div>

          <select
            {...register('platform', { required: true })}
            className='w-full px-4 py-2 bg-dark/70 border border-white/10 rounded-lg text-white font-serif'
          >
            <option value=''>Choose platform</option>
            {['PS4', 'PS5', 'PS5 Pro', 'Switch 2'].map(g => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>

          <select
            {...register('genreId', { required: true })}
            className='w-full px-4 py-2 bg-dark/70 border border-white/10 rounded-lg text-white font-serif'
          >
            <option value=''>Choose genre</option>
            {genres.map(g => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>

          <input
            type='number'
            placeholder='Your rating (1-5+)'
            {...register('maxScore', {
              required: true,
              min: 1,
              max: 6,
              valueAsNumber: true
            })}
            className='w-full px-4 py-2 bg-dark/70 border border-white/10 rounded-lg text-white placeholder:text-gray font-serif'
          />

          <input
            type='number'
            placeholder='Metacritic rating'
            {...register('metaScore', {
              required: true,
              min: 1,
              max: 100,
              valueAsNumber: true
            })}
            className='w-full px-4 py-2 bg-dark/70 border border-white/10 rounded-lg text-white placeholder:text-gray font-serif'
          />

          <input
            type='date'
            {...register('completedAt', { required: true })}
            className='w-full px-4 py-2 bg-dark/70 border border-white/10 rounded-lg text-white font-serif'
          />

          <textarea
            placeholder='Review...'
            {...register('review')}
            rows={4}
            className='w-full px-4 py-2 bg-dark/70 border border-white/10 rounded-lg text-white placeholder:text-gray font-serif resize-none'
          />

          <button
            disabled={isPending}
            className='w-full px-4 py-2 bg-accent text-dark font-serif font-bold rounded-lg hover:bg-accent/80 transition-colors disabled:opacity-50'
          >
            {isPending ? 'Adding...' : 'Add Game'}
          </button>
        </form>
      )}
    </div>
  )
}
