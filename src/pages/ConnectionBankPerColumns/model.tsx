import { useParams, useRouter } from '@tanstack/react-router'

export const useConnectionBankPerColumns = () => {
  const { tableId, columnId } = useParams({
    from: '/configuracoes/conexao-banco/$tableId/$columnId'
  })
  const router = useRouter()

  const handleBack = () => {
    router.navigate({
      to: '/configuracoes/conexao-banco/$tableId',
      params: { tableId }
    })
  }

  return { handleBack }
}
