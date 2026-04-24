import Elysia from 'elysia'
import { authRoutes } from './routes/auth'
import { gameRoutes } from './routes/games'
import { genreRoutes } from './routes/genres'
import { pollRoutes } from './routes/polls'
import { rawgRoutes } from './routes/rawg'
import { suggestionRoutes } from './routes/suggestions'

const app = new Elysia()

app.use(authRoutes)
app.use(genreRoutes)
app.use(gameRoutes)
app.use(pollRoutes)
app.use(suggestionRoutes)
app.use(rawgRoutes)

const PORT = process.env.PORT || 4200

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
