import { api } from '@client/api/axios'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export function usePolls() {
  return useQuery({
    queryKey: ['polls'],
    queryFn: async () => {
      const { data } = await api.get('/polls')
      return data
    }
  })
}

export function useVotePoll(onSettled?: () => void) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, token }: { id: string; token: string }) =>
      api.post(
        `/polls/${id}/vote`,
        {},
        {
          headers: { 'cf-turnstile-token': token }
        }
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['polls'] })
    },
    onSettled
  })
}
