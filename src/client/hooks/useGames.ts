import { api } from "@client/api/axios"
import type { TGame } from "@shared/types/game.types"
import { useQuery } from "@tanstack/react-query"

interface Props {
  genreSlug?: string | null
  searchTerm?: string | null
}



export function useGames({ genreSlug, searchTerm }: Props) {
  return useQuery({
    queryKey: ['games', genreSlug, searchTerm],
    queryFn: async () => {
      const params = new URLSearchParams()

      if (genreSlug) {
        params.append('genreSlug', genreSlug)
      }

      if (searchTerm) {
        params.append('search', searchTerm)
      }

      const query = params.toString()

      return api
        .get<TGame[]>(`/games${query ? `?${query}` : ''}`)
        .then(res => res.data)
    }
  })
}
