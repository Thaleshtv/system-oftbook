import { useRouter } from '@tanstack/react-router'

export const useGroup = () => {
  const router = useRouter()
  const handleBack = () => {
    router.navigate({
      to: '/configuracoes/grupos'
    })
  }
  return { handleBack }
}
