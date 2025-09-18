import { useRouter } from '@tanstack/react-router'

export const useGroups = () => {
  const router = useRouter()

  const handleDirectGroup = (groupId: string) => {
    router.navigate({
      to: '/configuracoes/grupo/$groupId',
      params: { groupId }
    })
  }

  const handleBack = () => {
    router.navigate({
      to: '/configuracoes/conexao-bancos'
    })
  }
  return { handleBack, handleDirectGroup }
}
