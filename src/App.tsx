import { RouterProvider } from '@tanstack/react-router'
import { router } from './routes/router'

import SimpleBackdrop from './components/backdrop'
import { ToastContainer } from 'react-toastify'
import { useAuthStore } from './store/userStore'
import { useToastStore } from './store/toastStore'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'

export default function App() {
  const auth = useAuthStore()
  const toast = useToastStore()

  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} context={{ auth, toast }} />
      <SimpleBackdrop />
      <ToastContainer />
    </QueryClientProvider>
  )
}
