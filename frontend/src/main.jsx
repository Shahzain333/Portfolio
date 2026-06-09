import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster }     from 'react-hot-toast'
import AppRouter from './routes/AppRouter'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppRouter />
    <Toaster
      position='top-right'  
      toastOptions={{
        duration: 3000,
        style: { borderRadius: '12px', fontSize: '14px', fontFamily: 'Inter, sans-serif' },
        success: { iconTheme: { primary: '#6366f1', secondary: '#fff' } },
      }}
    />
  </StrictMode>,
)
