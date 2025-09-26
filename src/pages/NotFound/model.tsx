import { useNavigate } from '@tanstack/react-router'

export const useNotFound = () => {
  const navigate = useNavigate()

  const goHome = () => {
    navigate({ to: '/' })
  }

  const goBack = () => {
    window.history.back()
  }

  return {
    goHome,
    goBack
  }
}
