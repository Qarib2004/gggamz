import { t } from 'elysia'

export const authGuard = {
  cookie: t.Object({
    accessToken: t.Optional(t.String())
  }),

  async beforeHandle(ctx: any) {
    const token = ctx.cookie?.accessToken?.value

    if (!token) {
      return ctx.status(401)
    }

    const payload = await ctx.jwt.verify(token)

    if (!payload) {
      return ctx.status(403)
    }
  }
}
