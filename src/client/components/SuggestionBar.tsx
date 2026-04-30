import {
  useAddSuggestion,
  useSuggestions,
  useVoteSuggestion
} from '@client/hooks/useSuggestion'
import { useTopGames } from '@client/hooks/useTopGames'
import { ChevronUp } from 'lucide-react'
import { toast } from 'sonner'

interface Props {
  genreSlug?: string | null
  token: string | null
  onNeedCaptcha: () => void
  onUsed: () => void
}

export function SuggestionBar({
  genreSlug,
  token,
  onNeedCaptcha,
  onUsed
}: Props) {
  const { data: suggestions = [] } = useSuggestions()
  const { data: topGames = [] } = useTopGames(genreSlug)
  const { mutate: vote, isPending: isVoting } = useVoteSuggestion(onUsed)
  const { mutate: add, isPending: isAdding } = useAddSuggestion(onUsed)

  const top8 = suggestions.slice(0, 8)
  const availableGames = topGames
    .filter(
      (g: any) => !suggestions.find((s: any) => s.externalId === String(g.id))
    )
    .slice(0, 8)

  const handleVote = (id: string) => {
    if (!token) {
      toast.error('Please complete captcha first')
      onNeedCaptcha()
      return
    }
    vote({ id, token })
  }

  const handleAdd = (game: any) => {
    if (!token) {
      toast.error('Please complete captcha first')
      onNeedCaptcha()
      return
    }
    add({
      gameName: game.name,
      externalId: String(game.id),
      posterUrl: game.background_image,
      token
    })
  }

  return (
    <div>
      <div>
        <span className='text-xs uppercase tracking-wider text-accent'>
          Vote for next game
        </span>
        <h3 className='font-serif text-lg'>Top games to suggest</h3>
      </div>

      <div className='mt-3 flex flex-wrap gap-2'>
        {top8.map((s: any) => (
          <button
            key={s.id}
            onClick={() => handleVote(s.id)}
            disabled={isVoting}
            className='group flex max-w-full items-center gap-2 rounded-lg border border-white/10 bg-dark/60 px-3 py-1.5 text-left text-xs transition-all hover:border-accent/50 disabled:opacity-50 sm:text-sm'
          >
            <span className='max-w-[180px] truncate text-white/80 group-hover:text-white sm:max-w-[240px]'>
              {s.gameName}
            </span>
            <span className='flex items-center gap-0.5 text-accent'>
              <ChevronUp className='w-3 h-3' />
              <span className='text-xs'>{s.votesCount}</span>
            </span>
          </button>
        ))}
      </div>

      {!!availableGames.length && (
        <div className='mt-3 flex flex-wrap gap-2'>
          {availableGames.map((g: any) => (
            <button
              key={g.id}
              onClick={() => handleAdd(g)}
              disabled={isAdding}
              className='max-w-full truncate rounded-lg border border-white/10 bg-dark/60 px-3 py-1.5 text-left text-xs text-white/80 hover:border-accent/50 hover:text-white disabled:opacity-50 sm:text-sm'
            >
              {g.name}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
