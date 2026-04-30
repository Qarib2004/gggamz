import { SkeletonLoader } from '@client/components/ui/SkeletonLoader'
import { useGenres } from '@client/hooks/useGenres'
import cn from 'clsx'
import { useQueryState } from 'nuqs'

export function TopMenuFilters() {
  const [genreSlug, setGenreSlug] = useQueryState('genre')

  const { data: genres = [], isLoading: isGenresLoading } = useGenres()

  return (
    <nav className='overflow-x-auto pb-1'>
      <ul className='flex min-w-max items-center justify-start gap-6 px-1 sm:justify-center sm:gap-10'>
        {isGenresLoading ? (
          <SkeletonLoader count={5} />
        ) : (
          genres.map(genre => (
            <li key={genre.slug}>
              <button
                className={cn(
                  'whitespace-nowrap font-serif text-base font-medium transition-colors hover:text-accent hover:underline hover:underline-offset-5 sm:text-lg md:text-xl',
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
