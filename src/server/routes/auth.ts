import jwt from '@elysiajs/jwt'
import { db } from '@server/db/client'
import { admins, users } from '@server/db/schema'
import { eq } from 'drizzle-orm'
import Elysia, { t } from 'elysia'

const PASSWORD_PREFIX = 'pw:'

const normalizePassword = (password: string) => `${PASSWORD_PREFIX}${password}`
const isProduction = process.env.NODE_ENV === 'production'
const cookieDomain = process.env.COOKIE_DOMAIN
const sharedCookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? 'none' : 'lax',
  path: '/',
  ...(cookieDomain ? { domain: cookieDomain } : {})
} as const

const hashPassword = async (password: string) =>
  Bun.password.hash(normalizePassword(password))

const verifyPassword = async (password: string, hash: string) => {
  // Keep backward compatibility with hashes created before normalization.
  const normalizedMatches = await Bun.password.verify(
    normalizePassword(password),
    hash
  )

  if (normalizedMatches) {
    return true
  }

  return Bun.password.verify(password, hash)
}

export const authRoutes = new Elysia({ prefix: '/api/auth' })
  .use(jwt({ name: 'jwt', secret: process.env.JWT_SECRET! }))
  .post(
    '/register',
    async ({ body }) => {
      const existing = await db.query.admins.findFirst({
        where: eq(admins.username, body.username)
      })

      if (existing) {
        throw new Error('Username already taken')
      }

      const passwordHash = await hashPassword(body.password)

      await db.insert(admins).values({
        username: body.username,
        passwordHash
      })

      return { success: true }
    },
    {
      body: t.Object({
        username: t.String({ minLength: 3 }),
        password: t.String()
      })
    }
  )
  .post(
    '/login',
    async ({ body, jwt, cookie }) => {
      const admin = await db.query.admins.findFirst({
        where: eq(admins.username, body.username)
      })

      if (
        !admin ||
        !(await verifyPassword(body.password, admin.passwordHash))
      ) {
        throw new Error('Invalid username or password')
      }

      const tokenJWT = await jwt.sign({ id: admin.id })

      cookie.accessToken.set({
        value: tokenJWT,
        maxAge: 60 * 60 * 24 * 3,
        ...sharedCookieOptions
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
    '/user/register',
    async ({ body, set }) => {
      const existing = await db.query.users.findFirst({
        where: eq(users.username, body.username)
      })

      if (existing) {
        set.status = 409
        return { message: 'Username already taken' }
      }

      const passwordHash = await hashPassword(body.password)

      await db.insert(users).values({
        username: body.username,
        passwordHash
      })

      return { success: true }
    },
    {
      body: t.Object({
        username: t.String({ minLength: 3 }),
        password: t.String()
      })
    }
  )
  .post(
    '/user/login',
    async ({ body, jwt, cookie, set }) => {
      const user = await db.query.users.findFirst({
        where: eq(users.username, body.username)
      })

      if (
        !user ||
        !(await verifyPassword(body.password, user.passwordHash))
      ) {
        set.status = 401
        return { message: 'Invalid username or password' }
      }

      const userToken = await jwt.sign({ userId: user.id })

      cookie.userToken.set({
        value: userToken,
        maxAge: 60 * 60 * 24 * 7,
        ...sharedCookieOptions
      })

      return {
        success: true,
        user: {
          id: user.id,
          username: user.username
        }
      }
    },
    {
      body: t.Object({
        username: t.String(),
        password: t.String()
      }),
      cookie: t.Cookie({
        userToken: t.Optional(t.String())
      })
    }
  )
  .get(
    '/user/me',
    async ({ cookie, jwt, set }) => {
      const token = cookie.userToken?.value

      if (!token) {
        set.status = 401
        return { message: 'Unauthorized' }
      }

      const payload = await jwt.verify(token)

      if (!payload || typeof payload !== 'object' || !('userId' in payload)) {
        set.status = 401
        return { message: 'Unauthorized' }
      }

      const user = await db.query.users.findFirst({
        where: eq(users.id, String(payload.userId)),
        columns: {
          id: true,
          username: true
        }
      })

      if (!user) {
        set.status = 401
        return { message: 'Unauthorized' }
      }

      return user
    },
    {
      cookie: t.Cookie({
        userToken: t.Optional(t.String())
      })
    }
  )
  .post(
    '/user/logout',
    async ({ cookie }) => {
      cookie.userToken.remove()
      return { success: true }
    },
    {
      cookie: t.Cookie({
        userToken: t.Optional(t.String())
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
