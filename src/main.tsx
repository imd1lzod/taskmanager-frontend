import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './hooks/queryClient'
import { Toaster } from 'react-hot-toast'
import { Provider } from 'react-redux'
import { store } from './store'
import { initSession } from './store/slices/authSlice'

function Bootstrap() {
  useEffect(() => {
    store.dispatch(initSession())
  }, [])
  return <App />
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <Bootstrap />
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      </QueryClientProvider>
    </Provider>
  </StrictMode>,
)
