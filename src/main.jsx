// Punto de entrada de la aplicación React
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.scss'
import App from './App.jsx'

// Renderizar la aplicación dentro del elemento root del HTML
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
