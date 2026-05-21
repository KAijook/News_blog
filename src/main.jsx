import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { Toaster } from 'react-hot-toast';
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Toaster
  position="top-center"
  reverseOrder={false}
  gutter={8}
  containerClassName=""
  containerStyle={{}}
  toasterId="default"
  toastOptions={{
    // Define default options
    className: '',
    duration: 5000,
    removeDelay: 1000,
    style: {
      background: '#363636',
      color: '#fff',
    },

    // Default options for specific types
    success: {
      duration: 3000,
      iconTheme: {
        primary: 'green',
        secondary: 'black',
      },
    },
  }}
/>
    <BrowserRouter>
    
      <App />
    </BrowserRouter>
  </StrictMode>,
)
