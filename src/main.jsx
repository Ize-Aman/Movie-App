import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider, useNavigate } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Login from './LoginPage/Login'
import Register from './LoginPage/Register'

const router = createBrowserRouter([
  { path: "/", element: <Login /> },
  { path: "/home", element: <App /> },
  { path: "/register", element: <Register /> }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)
