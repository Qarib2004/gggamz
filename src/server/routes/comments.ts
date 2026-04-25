import jwt from '@elysiajs/jwt'
import { db } from '@server/db/client'
import { comments, games, users } from '@server/db/schema'
import { desc, eq } from 'drizzle-orm'
import Elysia, { t } from 'elysia'

export const commentRoutes = new Elysia({ prefix: '/api/comments' })
  .use(jwt({ name: 'jwt', secret: process.env.JWT_SECRET! }))
  .get(
    '/game/:gameId',
    async ({ params, set }) => {
      const game = await db.query.games.findFirst({
        where: eq(games.id, params.gameId),
        columns: {
          id: true
        }
      })

      if (!game) {
        set.status = 404
        return { message: 'Game not found' }
      }

      return db.query.comments.findMany({
        where: eq(comments.gameId, params.gameId),
        with: {
          user: {
            columns: {
              id: true,
              username: true
            }
          }
        },
        orderBy: desc(comments.createdAt)
      })
    },
    {
      params: t.Object({
        gameId: t.String()
      })
    }
  )
  .post(
    '/game/:gameId',
    async ({ params, body, cookie, jwt, set }) => {
      const token = cookie.userToken?.value

      if (!token) {
        set.status = 401
        return { message: 'Login required' }
      }

      const payload = await jwt.verify(token)

      if (!payload || typeof payload !== 'object' || !('userId' in payload)) {
        set.status = 401
        return { message: 'Unauthorized' }
      }

      const userId = String(payload.userId)

      const [user, game] = await Promise.all([
        db.query.users.findFirst({
          where: eq(users.id, userId),
          columns: { id: true, username: true }
        }),
        db.query.games.findFirst({
          where: eq(games.id, params.gameId),
          columns: { id: true }
        })
      ])

      if (!user) {
        set.status = 401
        return { message: 'Unauthorized' }
      }

      if (!game) {
        set.status = 404
        return { message: 'Game not found' }
      }

      const [created] = await db
        .insert(comments)
        .values({
          body: body.body.trim(),
          gameId: game.id,
          userId: user.id
        })
        .returning()

      return {
        ...created,
        user
      }
    },
    {
      params: t.Object({
        gameId: t.String()
      }),
      body: t.Object({
        body: t.String({ minLength: 1, maxLength: 1000 })
      }),
      cookie: t.Cookie({
        userToken: t.Optional(t.String())
      })
    }
  )
