import { useMutation, useQuery } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { ConnectionPayload, Connections } from '../../services/connections'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useToastStore } from '../../store/toastStore'
import { AxiosError } from 'axios'
import { useState } from 'react'

interface ConnectionBankPageActions {
  nameAction: 'edit-connection' | 'delete-connection' | 'view-connection'
}

const connectionSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  driver: z.string().min(1, 'Driver é obrigatório'),
  server: z.string().min(1, 'Server é obrigatório'),
  database: z.string().min(1, 'Database é obrigatório'),
  pwd: z.string().min(1, 'Senha é obrigatória'),
  db_schema: z.string().min(1, 'Schema é obrigatório'),
  tipo_banco: z.string().min(1, 'Tipo de banco é obrigatório'),
  catalogo: z.string().min(1, 'Catálogo é obrigatório')
})

export type ConnectionFormValues = z.infer<typeof connectionSchema>

export const useConnectionBank = () => {
  const [modalConfirmOpen, setModalConfirmOpen] = useState(false)
  const [textModal, setTextModal] = useState('')
  const [loadingModal, setLoadingModal] = useState(false)

  const [modalEditOpen, setModalEditOpen] = useState(false)
  const [dataEditConnection, setDataEditConnection] =
    useState<ConnectionPayload>({
      nome: '',
      driver: '',
      server: '',
      database: '',
      pwd: '',
      db_schema: '',
      tipo_banco: '',
      catalogo: ''
    })

  const [connectionIdSelected, setConnectionIdSelected] = useState<string>('')
  const [actionSelected, setActionSelected] =
    useState<ConnectionBankPageActions>({
      nameAction: 'view-connection'
    })
  const { dispatch: dispatchToast } = useToastStore()

  const router = useRouter()

  const form = useForm<ConnectionFormValues>({
    resolver: zodResolver(connectionSchema),
    defaultValues: {
      nome: '',
      driver: '',
      server: '',
      database: '',
      pwd: '',
      db_schema: '',
      tipo_banco: '',
      catalogo: ''
    }
  })

  const handleOpenModalConfirmation = (text: string) => {
    setTextModal(text)
    setModalConfirmOpen(true)
  }

  const handleCloseModalConfirmation = () => {
    setModalConfirmOpen(false)
    setTextModal('')
  }

  const handleDirectToFunction = async (action: ConnectionBankPageActions) => {
    if (action.nameAction === 'delete-connection') {
      setLoadingModal(true)
      await deleteConnectionMutation.mutateAsync(connectionIdSelected)
      setLoadingModal(false)
      handleCloseModalConfirmation()
    }
  }

  const handleDirectToTable = (tableId: string) => {
    if (!tableId) return
    router.navigate({
      to: '/configuracoes/conexao-banco/$connectionId/$tableId',
      params: {
        connectionId: connectionIdSelected,
        tableId
      }
    })
  }

  const getConnectionsQuery = useQuery({
    queryKey: ['getConnectionsList'],
    queryFn: async () => {
      const response = await Connections.getConnections()
      return response
    }
  })

  const getConnectionByIdQuery = useQuery({
    queryKey: ['getConnectionId', connectionIdSelected],
    queryFn: async () => {
      if (!connectionIdSelected) throw new Error('ID não definido')
      const response = await Connections.getConnectionById(connectionIdSelected)
      return response
    },
    enabled: !!connectionIdSelected
  })

  const deleteConnectionMutation = useMutation({
    mutationFn: async (connectionId: string) => {
      const response = await Connections.deleteConnection(connectionId)
      return response
    },
    onSuccess: () => {
      getConnectionsQuery.refetch()
      dispatchToast.setOpenToast('success', 'Conexão deletada com sucesso')
      handleCloseModalConfirmation()
    },
    onError: (error: AxiosError) => {
      const data = error.response?.data as { detail: string } | undefined
      dispatchToast.setOpenToast(
        'error',
        data?.detail || 'Erro ao deletar conexão'
      )
      handleCloseModalConfirmation()
    }
  })

  const updateConnectionMutation = useMutation({
    mutationFn: async ({
      connectionId,
      data
    }: {
      connectionId: string
      data: ConnectionPayload
    }) => {
      const response = await Connections.updateConnection(connectionId, data)
      return response
    },
    onSuccess: () => {
      getConnectionByIdQuery.refetch()
      getConnectionsQuery.refetch()
      dispatchToast.setOpenToast('success', 'Conexão atualizada com sucesso')
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

  const createConnectionMutation = useMutation({
    mutationFn: async (data: ConnectionPayload) => {
      const response = await Connections.createConnection(data)
      return response
    },
    onSuccess: () => {
      form.reset()
      getConnectionsQuery.refetch()
      dispatchToast.setOpenToast('success', 'Conexão criada com sucesso')
    },
    onError: (error: AxiosError) => {
      const data = error.response?.data as { detail: string } | undefined
      dispatchToast.setOpenToast(
        'error',
        data?.detail || 'Erro ao criar conexão'
      )
    }
  })

  const onSubmit = form.handleSubmit((data) => {
    createConnectionMutation.mutate(data)
  })

  const handleOpenModalEditConnection = (id: string) => {
    setConnectionIdSelected(id)
    setModalEditOpen(true)
  }

  return {
    form,
    onSubmit,
    handleDirectToTable,
    getConnectionsQuery,
    createConnectionMutation,
    modalConfirmOpen,
    handleOpenModalConfirmation,
    handleCloseModalConfirmation,
    textModal,
    connectionIdSelected,
    setConnectionIdSelected,
    actionSelected,
    setActionSelected,
    handleDirectToFunction,
    loadingModal,
    setLoadingModal,
    deleteConnectionMutation,
    modalEditOpen,
    setModalEditOpen,
    dataEditConnection,
    setDataEditConnection,
    handleOpenModalEditConnection,
    getConnectionByIdQuery,
    updateConnectionMutation
  }
}
