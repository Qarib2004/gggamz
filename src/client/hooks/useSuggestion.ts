import { api } from '@client/api/axios'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export function useSuggestions() {
  return useQuery({
    queryKey: ['suggestions'],
    queryFn: async () => {
      const { data } = await api.get('/suggestions')
      return data
    }
  })
}

export function useVoteSuggestion(onSettled?: () => void) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, token }: { id: string; token: string }) =>
      api.post(
        `/suggestions/${id}/vote`,
        {},
        {
          headers: { 'cf-turnstile-token': token }
        }
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suggestions'] })
    },
    onSettled 
  })
}

export function useAddSuggestion(onSettled?: () => void) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      token,
      ...data
    }: {
      gameName: string
      externalId: string
      posterUrl?: string
      token: string
    }) =>
      api.post('/suggestions', data, {
        headers: { 'cf-turnstile-token': token }
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suggestions'] })
    },
    onSettled
  })
}
