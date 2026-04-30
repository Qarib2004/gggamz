import type { TGame } from '@shared/types/game.types'
import { SkeletonLoader } from '../ui/SkeletonLoader'
import { GameCard } from './GameCard'

interface Props {
  games: TGame[]
  isLoading: boolean
}

export function GameList({ games, isLoading }: Props) {
  if (isLoading) {
    return (
      <div className='mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:mt-10 lg:grid-cols-3 xl:grid-cols-4'>
        <SkeletonLoader count={4} className='w-68.75 h-91.5' />
      </div>
    )
  }

  if (!games.length) {
    return (
      <div className='text-center text-white/80 mt-12'>
        These games are not in GGGAMZ's collection yet. You can suggest them
        using the form below!
      </div>
    )
  }

  return (
    <div className='grid grid-cols-1 gap-4 py-8 sm:grid-cols-2 sm:gap-5 sm:py-10 lg:grid-cols-3 xl:grid-cols-4'>
      {games.map(game => (
        <GameCard key={game.id} game={game} />
      ))}
    </div>
  )
}
