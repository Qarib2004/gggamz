import { SkeletonLoader } from '@client/components/ui/SkeletonLoader'
import { useGenres } from '@client/hooks/useGenres'
import cn from 'clsx'
import { useQueryState } from 'nuqs'

export function TopMenuFilters() {
  const [genreSlug, setGenreSlug] = useQueryState('genre')

  const { data: genres = [], isLoading: isGenresLoading } = useGenres()

  return (
    <nav>
      <ul className='flex items-center gap-12 justify-center'>
        {isGenresLoading ? (
          <SkeletonLoader count={5} />
        ) : (
          genres.map(genre => (
            <li key={genre.slug}>
              <button
                className={cn(
                  'font-serif text-xl font-medium transition-colors hover:text-accent hover:underline hover:underline-offset-5',
                  {
                    'text-accent underline underline-offset-5':
                      genre.slug.toString() === genreSlug
                  }
                )}
                onClick={() => {
                  if (genre.slug.toString() === genreSlug) {
                    setGenreSlug(null)
                    return
                  }
                  setGenreSlug(genre.slug.toString())
                }}
              >
                {genre.name}
              </button>
            </li>
          ))
        )}
      </ul>
    </nav>
  )
}
