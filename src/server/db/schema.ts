import { boolean, integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm/relations'

import { createId } from '@paralleldrive/cuid2'

export const genres = pgTable('genres', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),

  name: text('name').notNull().unique(),
  slug: text('slug').notNull().unique(),

  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
})

export const games = pgTable('games', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  externalId: text('external_id').notNull().unique(),

  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  posterUrl: text('poster_url'),
  platform: text('platform').notNull(),

  metaScore: integer('meta_score'),
  maxScore: integer('max_score').notNull(),
  review: text('review'),

  completedAt: timestamp('completed_at').notNull(),

  genreId: text('genre_id')
    .notNull()
    .references(() => genres.id, { onDelete: 'cascade' }),

  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
})

export const gamesRelations = relations(games, ({ one }) => ({
  genre: one(genres, {
    fields: [games.genreId],
    references: [genres.id]
  })
}))

export const suggestions = pgTable('suggestions', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  externalId: text('external_id').notNull().unique(),

  gameName: text('game_name').notNull(),
  posterUrl: text('poster_url'),

  votesCount: integer('votes_count').notNull().default(0),

  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
})

export const suggestionVotes = pgTable('suggestion_votes', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  suggestionId: text('suggestion_id')
    .notNull()
    .references(() => suggestions.id, { onDelete: 'cascade' }),

  ipHash: text('ip_hash').notNull(),

  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
})

export const polls = pgTable('polls', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  title: text('title').notNull(),
  description: text('description'),

  votesCount: integer('votes_count').notNull().default(0),
  isActive: boolean('is_active').notNull().default(true),

  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
})

export const pollVotes = pgTable('poll_votes', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  pollId: text('poll_id')
    .notNull()
    .references(() => polls.id, { onDelete: 'cascade' }),

  ipHash: text('ip_hash').notNull(),

  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
})

export const admins = pgTable('admins', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  username: text('username').notNull().unique(),
  passwordHash: text('password_hash').notNull(),

  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
})
