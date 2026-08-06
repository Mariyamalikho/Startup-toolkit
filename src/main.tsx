import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ThemeProvider } from '@/hooks/useTheme'
import { ToastProvider } from '@/components/ui/Toast'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="system" storageKey="startup-toolkit-theme">
      <ToastProvider>
        <App />
      </ToastProvider>
    </ThemeProvider>
  </StrictMode>,
)
