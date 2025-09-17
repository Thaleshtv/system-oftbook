import { useRouter } from '@tanstack/react-router'

export const useConnectionBankPerTables = () => {
  const router = useRouter()

  const handleBack = () => {
    router.navigate({
      to: '/configuracoes/conexao-banco'
    })
  }
  return { handleBack }
}
