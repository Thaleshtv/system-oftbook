import { RouterProvider } from '@tanstack/react-router'
import { router } from './routes/router'

import SimpleBackdrop from './components/backdrop'
import { ToastContainer } from 'react-toastify'
import { useAuthStore } from './store/userStore'
import { useToastStore } from './store/toastStore'

export default function App() {
  const auth = useAuthStore()
  const toast = useToastStore()

  return (
    <>
      <RouterProvider router={router} context={{ auth, toast }} />
      <SimpleBackdrop />
      <ToastContainer />
    </>
  )
}
