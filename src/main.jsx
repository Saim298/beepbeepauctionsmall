import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { bootstrapAuthTokenFromUrl } from './api/client.js'

bootstrapAuthTokenFromUrl();
createRoot(document.getElementById('root')).render(
  <App />,
)
