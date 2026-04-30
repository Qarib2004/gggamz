import ReactDom from 'react-dom/client'

import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Layout from './components/layout/Layout'
import './global.css'

import { NuqsAdapter } from 'nuqs/adapters/react'
import { Toaster } from 'sonner'
import { App } from './pages/home/App'
import { Admin } from './pages/admin/Admin'
import { AdminLoginForm } from './pages/admin/login-form/AdminLoginForm'
import { UserAuthPage } from './pages/auth/UserAuthPage'
import { GameCommentsPage } from './pages/comments/GameCommentsPage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5
    }
  }
})

ReactDom.createRoot(document.getElementById('root')!).render(
  <NuqsAdapter>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path='/' element={<App />} />
            <Route path='/auth/login' element={<UserAuthPage mode='login' />} />
            <Route
              path='/auth/register'
              element={<UserAuthPage mode='register' />}
            />
            <Route
              path='/games/:slug/comments'
              element={<GameCommentsPage />}
            />
            <Route path='/blade/auth' element={<AdminLoginForm />} />
            <Route path='/blade' element={<Admin />} />
          </Routes>

          <Toaster />
        </Layout>
      </BrowserRouter>
    </QueryClientProvider>
  </NuqsAdapter>
)
