import { useRouter } from '@tanstack/react-router'

export const useConnectionBank = () => {
  const router = useRouter()

  const handleDirectToTable = (tableId: string) => {
    if (!tableId) return
    router.navigate({
      to: `/configuracoes/conexao-banco/$tableId`,
      params: { tableId }
    })
  }
  return { handleDirectToTable }
}
