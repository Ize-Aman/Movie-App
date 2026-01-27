import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Login from './LoginPage/Login'
import Register from './LoginPage/Register'

createRoot(document.getElementById('root')).render(
  <App />,
)
