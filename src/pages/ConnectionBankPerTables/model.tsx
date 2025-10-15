import { useMutation, useQuery } from '@tanstack/react-query'
import { useParams, useRouter } from '@tanstack/react-router'
import { Connections } from '../../services/connections'
import { Tables, ITablePayload } from '../../services/tables'
import { useToastStore } from '../../store/toastStore'
import { useState } from 'react'
import { AxiosError } from 'axios'

export const useConnectionBankPerTables = () => {
  const router = useRouter()

  const { dispatch: dispatchToast } = useToastStore()
  const [modalConfirmOpen, setModalConfirmOpen] = useState(false)
  const [textModalConfirm, setTextModalConfirm] = useState('')
  const [selectedTableId, setSelectedTableId] = useState<string>('')

  const [modalEditOpen, setModalEditOpen] = useState(false)

  const { connectionId } = useParams({
    from: '/configuracoes/conexao-banco/$connectionId'
  })

  const getConnectionByIdQuery = useQuery({
    queryKey: ['getConnectionId', connectionId],
    queryFn: async () => {
      if (!connectionId) throw new Error('ID não definido')
      const response = await Connections.getConnectionById(connectionId)
      return response
    },
    enabled: !!connectionId
  })

  const getTableByIdQuery = useQuery({
    queryKey: ['getTableById', selectedTableId],
    queryFn: async () => {
      if (!selectedTableId) throw new Error('ID não definido')
      const response = await Tables.getTableDetailById(selectedTableId)
      return response
    },
    enabled: !!selectedTableId
  })

  const getTablesQuery = useQuery({
    queryKey: ['getTablesById', connectionId],
    queryFn: async () => {
      if (!connectionId) throw new Error('ID não definido')
      const response = await Tables.getTables(connectionId)
      return response
    },
    enabled: !!connectionId
  })

  const updateTableMutation = useMutation({
    mutationFn: async ({
      tableId,
      data
    }: {
      tableId: string
      data: ITablePayload
    }) => {
      const response = await Tables.updateTable(tableId, data)
      return response
    },
    onSuccess: () => {
      getTablesQuery.refetch()
      getTableByIdQuery.refetch()
      dispatchToast.setOpenToast('success', 'Tabela atualizada com sucesso')
      setModalEditOpen(false)
    },
    onError: (error: AxiosError) => {
      const data = error.response?.data as { detail: string } | undefined
      dispatchToast.setOpenToast(
        'error',
        data?.detail || 'Erro ao atualizar conexão'
      )
    }
  })

  const deleteTableMutation = useMutation({
    mutationFn: async (tableId: string) => {
      const response = await Tables.deleteTable(tableId)
      return response
    },
    onSuccess: () => {
      getTablesQuery.refetch()
      dispatchToast.setOpenToast('success', 'Tabela deletada com sucesso')
      handleCloseModalConfirmation()
    },
    onError: (error: AxiosError) => {
      const data = error.response?.data as { detail: string } | undefined
      dispatchToast.setOpenToast(
        'error',
        data?.detail || 'Erro ao deletar tabela'
      )
      handleCloseModalConfirmation()
    }
  })

  const handleBack = () => {
    router.navigate({
      to: '/configuracoes/conexao-bancos'
    })
  }

  const handleOpenModalConfirm = (text: string) => {
    if (!text) return
    setTextModalConfirm(text)
    setModalConfirmOpen(true)
  }

  const handleCloseModalConfirmation = () => {
    setModalConfirmOpen(false)
    setTextModalConfirm('')
  }

  const handleDirectToColumn = (tableId: string) => {
    if (!tableId) return
    router.navigate({
      to: `/configuracoes/conexao-banco/$connectionId/$tableId`,
      params: {
        connectionId: connectionId,
        tableId: tableId
      }
    })
  }

  return {
    handleBack,
    handleDirectToColumn,
    getConnectionByIdQuery,
    getTablesQuery,
    modalConfirmOpen,
    handleOpenModalConfirm,
    textModalConfirm,
    setModalConfirmOpen,
    deleteTableMutation,
    selectedTableId,
    setSelectedTableId,
    getTableByIdQuery,
    modalEditOpen,
    setModalEditOpen,
    updateTableMutation
  }
}
