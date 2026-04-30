import { usePolls, useVotePoll } from '@client/hooks/usePolls'
import { Vote } from 'lucide-react'
import { toast } from 'sonner'

interface Props {
  token: string | null
  onNeedCaptcha: () => void
  onUsed: () => void
}

export function PollBanner({ token, onNeedCaptcha, onUsed }: Props) {
  const { data: polls = [] } = usePolls()
  const { mutate: vote, isPending } = useVotePoll(onUsed)

  const activePoll = polls[0]
  if (!activePoll) return null

  const handleVote = () => {
    if (!token) {
      toast.error('Please complete captcha first')
      onNeedCaptcha()
      return
    }
    vote({ id: activePoll.id, token })
  }

  return (
    <div>
      <div>
        <span className='text-xs uppercase tracking-wider text-accent'>
          Vote
        </span>
        <h3 className='font-serif text-base sm:text-lg'>{activePoll.title}</h3>
        {activePoll.description && (
          <p className='mt-1 text-xs text-gray sm:text-sm'>
            {activePoll.description}
          </p>
        )}
      </div>
      <div className='mt-3'>
        <button
          onClick={handleVote}
          disabled={isPending}
          className='flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2 font-serif font-bold text-dark transition-colors hover:bg-accent/80 disabled:opacity-50 sm:w-auto'
        >
          <Vote className='w-4 h-4' />
          <span>{activePoll.votesCount}</span>
        </button>
      </div>
    </div>
  )
}
