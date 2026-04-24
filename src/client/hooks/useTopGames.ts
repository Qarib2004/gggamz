import { api } from '@client/api/axios'
import { useQuery } from '@tanstack/react-query'

export function useTopGames(genre?: string | null) {
  return useQuery({
    queryKey: ['rawg-top', genre],
    queryFn: async () => {
      const { data } = await api.get('/rawg/top', {
        params: { genre: genre || undefined }
      })
      return data
    },
    staleTime: 1000 * 60 * 30
  })
}
