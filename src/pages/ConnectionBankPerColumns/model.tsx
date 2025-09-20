import { useMutation, useQuery } from '@tanstack/react-query'
import { useParams, useRouter } from '@tanstack/react-router'
import { Tables } from '../../services/tables'
import { Connections } from '../../services/connections'
import { Columns, IColumnPayload } from '../../services/columns'
import { useState } from 'react'
import { useToastStore } from '../../store/toastStore'
import { AxiosError } from 'axios'

export const useConnectionBankPerColumns = () => {
  const { tableId, connectionId } = useParams({
    from: '/configuracoes/conexao-banco/$connectionId/$tableId'
  })
  const router = useRouter()

  const { dispatch: dispatchToast } = useToastStore()

  const [selectedColumnId, setSelectedColumnId] = useState<string>('')

  const [modalEditOpen, setModalEditOpen] = useState(false)
  const [modalConfirmOpen, setModalConfirmOpen] = useState(false)
  const [textModalConfirm, setTextModalConfirm] = useState('')

  const handleOpenModalConfirm = (text: string) => {
    setModalConfirmOpen(true)
    setTextModalConfirm(text)
  }

  const handleCloseModalConfirm = () => {
    setModalConfirmOpen(false)
    setSelectedColumnId('')
    setTextModalConfirm('')
  }

  const getTableByIdQuery = useQuery({
    queryKey: ['getTableById', tableId],
    queryFn: async () => {
      if (!tableId) throw new Error('ID não definido')
      const response = await Tables.getTableDetailById(tableId)
      return response
    },
    enabled: !!tableId
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

  const getColumnsQuery = useQuery({
    queryKey: ['getColumnsById', tableId],
    queryFn: async () => {
      if (!tableId) throw new Error('ID não definido')
      const response = await Columns.getColumns(tableId)
      return response
    },
    enabled: !!tableId
  })

  const getColumnByIdQuery = useQuery({
    queryKey: ['getColumnById', selectedColumnId],
    queryFn: async () => {
      if (!selectedColumnId) throw new Error('ID não definido')
      const response = await Columns.getColumnDetailById(selectedColumnId)
      return response
    },
    enabled: !!selectedColumnId
  })

  const updateColumnMutation = useMutation({
    mutationFn: async ({
      columnId,
      data
    }: {
      columnId: string
      data: IColumnPayload
    }) => {
      const response = await Columns.updateColumn(columnId, data)
      return response
    },
    onSuccess: () => {
      getColumnsQuery.refetch()
      getColumnByIdQuery.refetch()
      dispatchToast.setOpenToast('success', 'Coluna atualizada com sucesso')
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

  const deleteColumnMutation = useMutation({
    mutationFn: async (columnId: string) => {
      const response = await Columns.deleteColumn(columnId)
      return response
    },
    onSuccess: () => {
      getColumnsQuery.refetch()
      getColumnByIdQuery.refetch()
      dispatchToast.setOpenToast('success', 'Coluna deletada com sucesso')
      setModalConfirmOpen(false)
    },
    onError: (error: AxiosError) => {
      const data = error.response?.data as { detail: string } | undefined
      dispatchToast.setOpenToast(
        'error',
        data?.detail || 'Erro ao deletar coluna'
      )
      setModalConfirmOpen(false)
    }
  })

  const handleBack = () => {
    router.navigate({
      to: '/configuracoes/conexao-banco/$connectionId',
      params: { connectionId }
    })
  }

  return {
    handleBack,
    getTableByIdQuery,
    getConnectionByIdQuery,
    getColumnsQuery,
    getColumnByIdQuery,
    updateColumnMutation,
    selectedColumnId,
    setSelectedColumnId,
    modalEditOpen,
    setModalEditOpen,
    modalConfirmOpen,
    textModalConfirm,
    handleOpenModalConfirm,
    handleCloseModalConfirm,
    deleteColumnMutation
  }
}
