import type { games, genres } from '@server/db/schema'
import type { InferSelectModel } from 'drizzle-orm'

export type TGenre = InferSelectModel<typeof genres>

export type TGame = InferSelectModel<typeof games> & {
  genre: TGenre | null
}
