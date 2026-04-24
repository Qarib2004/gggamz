import { eq } from 'drizzle-orm'
import { db } from './client'
import { admins, genres, polls } from './schema'

const GENRES = [
  { name: 'Action', slug: 'action' },
  { name: 'Sosaliki', slug: 'soulslike' },
  { name: 'RPG', slug: 'rpg' },
  { name: 'Adventure', slug: 'adventure' },
  { name: 'Horror', slug: 'horror' },
  { name: 'Shooter', slug: 'shooter' },
  { name: 'Platformer', slug: 'platformer' },
  { name: 'Racing', slug: 'racing' }
]

async function seed() {
  console.log('🌱 Seeding genres...')

  await db.insert(genres).values(GENRES).onConflictDoNothing()

  const adminUsername = 'admin'
  const adminPassword = '123456'
  const passwordHash = await Bun.password.hash(adminPassword)

  await db.delete(admins).where(eq(admins.username, 'admin'))

  await db
    .insert(admins)
    .values({
      username: adminUsername,
      passwordHash
    })
    .onConflictDoUpdate({
      target: admins.username,
      set: { passwordHash }
    })

  await db.insert(polls).values({
    title: 'Game price and language bot',
    description:
      'Voting for a bot that will calculate the price of a game and check the available language in the game via a link across different regions (as well as calculate the price taking gift cards into account)',
    isActive: true
  })

  console.log('✅ Done!')
  process.exit(0)
}

seed()
