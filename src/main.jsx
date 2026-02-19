import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { AuthContextProvider } from './components/Context/Auth.jsx'
import { ItemsContextProvider } from './components/Context/Item.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ItemsContextProvider>
        <AuthContextProvider>
          <App />
        </AuthContextProvider>
      </ItemsContextProvider>
    </BrowserRouter>
  </StrictMode>
)
