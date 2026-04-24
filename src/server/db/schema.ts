import { boolean, integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm/relations'

import { createId } from '@paralleldrive/cuid2'




export const games = pgTable('games',{
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
     title:text('title').notNull(),
    score:text('score').notNull(),
    platform:text('platform')
})