import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile'
import { forwardRef } from 'react'

interface Props {
  onSuccess: (token: string) => void
}

const SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY!

export const Captcha = forwardRef<TurnstileInstance, Props>(
  ({ onSuccess }, ref) => {
    return (
      <div className='scale-75 origin-center'>
        <Turnstile
          ref={ref}
          siteKey={SITE_KEY}
          onSuccess={onSuccess}
          options={{ size: 'normal', theme: 'dark' }}
        />
      </div>
    )
  }
)
