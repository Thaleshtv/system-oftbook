import { useParams, useRouter } from '@tanstack/react-router'

export const useConnectionBankPerTables = () => {
  const { tableId } = useParams({
    from: '/configuracoes/conexao-banco/$tableId'
  })
  const router = useRouter()

  const handleBack = () => {
    router.navigate({
      to: '/configuracoes/conexao-bancos'
    })
  }

  const handleDirectToColumn = (columnId: string) => {
    if (!columnId) return
    router.navigate({
      to: `/configuracoes/conexao-banco/$tableId/$columnId`,
      params: { tableId: tableId, columnId }
    })
  }
  return { handleBack, handleDirectToColumn }
}
