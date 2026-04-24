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
        <h3 className='font-serif text-lg'>{activePoll.title}</h3>
        {activePoll.description && (
          <p className='text-sm text-gray mt-1'>{activePoll.description}</p>
        )}
      </div>
      <div className='mt-3'>
        <button
          onClick={handleVote}
          disabled={isPending}
          className='flex items-center gap-2 px-4 py-2 bg-accent text-dark font-serif font-bold rounded-lg hover:bg-accent/80 transition-colors disabled:opacity-50'
        >
          <Vote className='w-4 h-4' />
          <span>{activePoll.votesCount}</span>
        </button>
      </div>
    </div>
  )
}
