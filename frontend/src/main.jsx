import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

const initialTheme = localStorage.getItem('lace-theme') || 'dark'
document.documentElement.dataset.theme = initialTheme
document.documentElement.classList.add(`theme-${initialTheme}`)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
