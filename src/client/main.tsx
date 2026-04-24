import ReactDom from 'react-dom/client'
import { App } from './App'
import './global.css'
import Layout from './components/layout/Layout'

ReactDom.createRoot(document.getElementById('root')!).render(
  <Layout>
    <App />
  </Layout>
)
