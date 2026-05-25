import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './context/AuthContext.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <App />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#0D3333',
                color: '#F2EFE4',
                border: '2px solid #C8FF00',
                borderRadius: '0',
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.875rem',
                fontWeight: '500',
              },
              success: {
                iconTheme: { primary: '#C8FF00', secondary: '#0D3333' },
              },
              error: {
                iconTheme: { primary: '#ff4444', secondary: '#0D3333' },
              },
            }}
          />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
