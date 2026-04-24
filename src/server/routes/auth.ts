import jwt from '@elysiajs/jwt'
import { db } from '@server/db/client'
import { admins } from '@server/db/schema'
import { eq } from 'drizzle-orm'
import Elysia, { t } from 'elysia'

export const authRoutes = new Elysia({ prefix: '/api/auth' })
  .use(jwt({ name: 'jwt', secret: process.env.JWT_SECRET! }))
  .post(
    '/login',
    async ({ body, jwt, cookie }) => {
      const admin = await db.query.admins.findFirst({
        where: eq(admins.username, body.username)
      })

      if (
        !admin ||
        !(await Bun.password.verify(body.password, admin.passwordHash))
      ) {
        throw new Error('Invalid username or password')
      }

      const tokenJWT = await jwt.sign({ id: admin.id })

      cookie.accessToken.set({
        value: tokenJWT,
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 3, 
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      })

      return { success: true }
    },
    {
      body: t.Object({
        username: t.String(),
        password: t.String()
      }),
      cookie: t.Cookie({
        accessToken: t.Optional(t.String())
      })
    }
  )
  .post(
    '/logout',
    async ({ cookie }) => {
      cookie.accessToken.remove()
      return { success: true }
    },
    {
      cookie: t.Cookie({
        accessToken: t.Optional(t.String())
      })
    }
  )
