import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster }    from 'react-hot-toast'
import AppRouter from './routes/AppRouter'
import './style.css'   // Tailwind v4 + @custom-variant dark
import './index.css'   // design tokens + @layer components

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3500,
        style: { borderRadius:'12px', fontSize:'14px', fontFamily:'Inter, sans-serif' },
        success: { iconTheme: { primary:'#6366f1', secondary:'#fff' } },
        error:   { iconTheme: { primary:'#ef4444', secondary:'#fff' } },
      }}
    />
    <AppRouter />
  </StrictMode>
)
