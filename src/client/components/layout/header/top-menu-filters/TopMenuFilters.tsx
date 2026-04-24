import { GENRES } from './genres'
import cn from 'clsx'

const ACTIVE_ID = 'action'

export function TopMenuFilters() {
  return (
    <nav className='max-w-5xl mx-auto'>
      <ul className='flex items-center gap-10 justify-center'>
        {GENRES.map(genre => (
          <li key={genre.id}>
            <button
              className={cn('font-serif text-xl font-medium transition-colors hover:text-accent', {
                'text-accent': genre.id === ACTIVE_ID
              })}
            >
              {genre.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}
