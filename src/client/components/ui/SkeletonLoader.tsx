import type { CSSProperties } from 'react'
import { twMerge } from 'tailwind-merge'

interface ISkeletonLoader {
  count?: number
  style?: CSSProperties
  className?: string
}

export function SkeletonLoader({
  count = 1,
  style,
  className
}: ISkeletonLoader) {
  return (
    <>
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          className={twMerge(
            'bg-white/8 mb-3 h-10 animate-pulse rounded-xl last:mb-0',
            className
          )}
          style={style}
        />
      ))}
    </>
  )
}