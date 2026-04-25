import { api } from '@client/api/axios'
import type { TAuthUser, TComment } from '@shared/types/comment.types'
import type { TGame } from '@shared/types/game.types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { FormEvent, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'

interface ApiError {
  message?: string
}

export function GameCommentsPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [commentBody, setCommentBody] = useState('')

  const { data: user } = useQuery({
    queryKey: ['user-me'],
    queryFn: () => api.get<TAuthUser>('/auth/user/me').then(res => res.data),
    retry: false
  })

  const { data: game, isLoading: isGameLoading } = useQuery({
    queryKey: ['game', slug],
    queryFn: () => api.get<TGame>(`/games/${slug}`).then(res => res.data),
    enabled: Boolean(slug)
  })

  const gameId = game?.id

  const { data: comments = [], isLoading: isCommentsLoading } = useQuery({
    queryKey: ['comments', gameId],
    queryFn: () =>
      api.get<TComment[]>(`/comments/game/${gameId}`).then(res => res.data),
    enabled: Boolean(gameId)
  })

  const createCommentMutation = useMutation({
    mutationKey: ['create-comment', gameId],
    mutationFn: async () =>
      api.post<TComment>(`/comments/game/${gameId}`, { body: commentBody }),
    onSuccess: () => {
      setCommentBody('')
      toast.success('Comment added')
      queryClient.invalidateQueries({ queryKey: ['comments', gameId] })
    },
    onError: (error: AxiosError<ApiError>) => {
      const message = error.response?.data?.message || 'Failed to add comment'
      toast.error(message)

      if (error.response?.status === 401) {
        navigate('/auth/login')
      }
    }
  })

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!commentBody.trim()) return
    createCommentMutation.mutate()
  }

  if (isGameLoading) {
    return <div className='mt-10 text-white/80'>Loading game...</div>
  }

  if (!game) {
    return <div className='mt-10 text-red-400'>Game not found.</div>
  }

  return (
    <div className='mx-auto mt-8 max-w-3xl'>
      <Link to='/' className='text-sm text-accent hover:underline'>
        Back to games
      </Link>

      <h1 className='mt-3 font-serif text-3xl text-white'>
        Comments for {game.title}
      </h1>

      {!user ? (
        <p className='mt-3 text-sm text-white/75'>
          To write a comment,{' '}
          <Link to='/auth/login' className='text-accent hover:underline'>
            login
          </Link>{' '}
          or{' '}
          <Link to='/auth/register' className='text-accent hover:underline'>
            register
          </Link>
          .
        </p>
      ) : (
        <p className='mt-3 text-sm text-white/75'>
          Logged in as <span className='text-accent'>{user.username}</span>
        </p>
      )}

      <form onSubmit={onSubmit} className='mt-5 space-y-3'>
        <textarea
          value={commentBody}
          onChange={e => setCommentBody(e.target.value)}
          placeholder='Write your comment...'
          rows={4}
          maxLength={1000}
          className='w-full rounded-xl border border-white/10 bg-dark/70 p-3 text-white placeholder:text-gray focus:border-accent/50 focus:outline-none'
          disabled={!user || createCommentMutation.isPending}
        />
        <button
          type='submit'
          disabled={!user || createCommentMutation.isPending || !commentBody.trim()}
          className='rounded-lg bg-accent px-4 py-2 font-serif font-bold text-dark hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-60'
        >
          {createCommentMutation.isPending ? 'Sending...' : 'Add comment'}
        </button>
      </form>

      <div className='mt-8 space-y-4'>
        {isCommentsLoading ? (
          <p className='text-white/80'>Loading comments...</p>
        ) : comments.length === 0 ? (
          <p className='text-white/70'>No comments yet. Be the first.</p>
        ) : (
          comments.map(comment => (
            <article
              key={comment.id}
              className='rounded-xl border border-white/10 bg-dark/60 p-4'
            >
              <div className='mb-2 flex items-center justify-between'>
                <span className='font-semibold text-accent'>
                  {comment.user.username}
                </span>
                <span className='text-xs text-white/50'>
                  {new Date(comment.createdAt).toLocaleString()}
                </span>
              </div>
              <p className='whitespace-pre-wrap text-white/85'>{comment.body}</p>
            </article>
          ))
        )}
      </div>
    </div>
  )
}
