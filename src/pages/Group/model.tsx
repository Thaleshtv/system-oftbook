import { useMutation, useQuery } from '@tanstack/react-query'
import { useParams, useRouter } from '@tanstack/react-router'
import { GroupTables } from '../../services/group-tables'
import { GroupUser } from '../../services/group-user'
import { Connections } from '../../services/connections'
import { useState } from 'react'
import { Tables } from '../../services/tables'
import { useToastStore } from '../../store/toastStore'
import { AxiosError } from 'axios'

type GroupPageActions = {
  nameAction: 'dissociate-table' | 'dissociate-user'
}

export const useGroup = () => {
  const [connectionId, setConnectionId] = useState<string>('')
  const [modalAssociateTableOpen, setModalAssociateTableOpen] = useState(false)
  const [modalAssociateUserOpen, setModalAssociateUserOpen] = useState(false)
  const [selectedTableId, setSelectedTableId] = useState<string>('')
  const [selectedUserId, setSelectedUserId] = useState<string>('')

  const [modalConfirmOpen, setModalConfirmOpen] = useState(false)
  const [textModal, setTextModal] = useState('')
  const [loadingModal, setLoadingModal] = useState(false)
  const [currentAction, setCurrentAction] = useState<GroupPageActions | null>(
    null
  )

  const { dispatch: dispatchToast } = useToastStore()

  const { groupId } = useParams({
    from: '/configuracoes/grupo/$groupId'
  })

  const router = useRouter()
  const handleBack = () => {
    router.navigate({
      to: '/configuracoes/grupos'
    })
  }

  const getTablesQuery = useQuery({
    queryKey: ['getTablesById', connectionId],
    queryFn: async () => {
      if (!connectionId) throw new Error('ID não definido')
      const response = await Tables.getTables(connectionId)
      return response
    },
    enabled: !!connectionId,
    retry: false
  })

  const getConnectionsQuery = useQuery({
    queryKey: ['getConnectionsList'],
    queryFn: async () => {
      const response = await Connections.getConnections()
      return response
    },
    retry: false
  })

  const getGroupIdQuery = useQuery({
    queryKey: ['groupId', groupId],
    queryFn: async () => {
      if (!groupId) return null
      const data = await GroupTables.getGroupTables(Number(groupId))
      return data
    },
    enabled: !!groupId,
    retry: false
  })

  const getGroupUsersQuery = useQuery({
    queryKey: ['groupUsers', groupId],
    queryFn: async () => {
      if (!groupId) return []
      const data = await GroupUser.getUsersByGroup(Number(groupId))
      return data
    },
    enabled: !!groupId,
    retry: false
  })

  const associateTableToGroupMutation = useMutation({
    mutationFn: async (tableId: string) => {
      if (!groupId) throw new Error('ID do grupo não definido')
      const data = await GroupTables.associateTableToGroup({
        tabela_id: Number(tableId),
        grupo_id: Number(groupId)
      })
      return data
    },
    onSuccess: () => {
      getGroupIdQuery.refetch()
      dispatchToast.setOpenToast('success', 'Tabela associada com sucesso')
    },
    onError: (error: AxiosError) => {
      dispatchToast.setOpenToast('error', 'Erro ao associar tabela')
      setLoadingModal(false)
      console.log(error)
    }
  })

  const dissociateTableFromGroupMutation = useMutation({
    mutationFn: async (tableId: number) => {
      if (!groupId) throw new Error('ID do grupo não definido')
      const data = await GroupTables.dissociateTableFromGroup(
        Number(groupId),
        Number(tableId)
      )
      return data
    },
    onSuccess: () => {
      getGroupIdQuery.refetch()
      dispatchToast.setOpenToast('success', 'Tabela dissociada com sucesso')
    },
    onError: (error: AxiosError) => {
      dispatchToast.setOpenToast('error', 'Erro ao dissociar tabela')
      setLoadingModal(false)
      console.log(error)
    }
  })

  const associateUserToGroupMutation = useMutation({
    mutationFn: async (userId: string) => {
      if (!groupId) throw new Error('ID do grupo não definido')
      const data = await GroupUser.associateUserToGroup({
        usuario_id: userId,
        grupo_id: Number(groupId)
      })
      return data
    },
    onSuccess: () => {
      getGroupUsersQuery.refetch()
      setModalAssociateUserOpen(false)
      dispatchToast.setOpenToast('success', 'Usuário associado com sucesso')
    },
    onError: (error: AxiosError) => {
      dispatchToast.setOpenToast('error', 'Erro ao associar usuário')
      setLoadingModal(false)
      console.log(error)
    }
  })

  const dissociateUserFromGroupMutation = useMutation({
    mutationFn: async (userId: string) => {
      if (!groupId) throw new Error('ID do grupo não definido')
      const data = await GroupUser.dissociateUserFromGroup(
        userId,
        Number(groupId)
      )
      return data
    },
    onSuccess: () => {
      getGroupUsersQuery.refetch()
      dispatchToast.setOpenToast('success', 'Usuário dissociado com sucesso')
    },
    onError: (error: AxiosError) => {
      dispatchToast.setOpenToast('error', 'Erro ao dissociar usuário')
      setLoadingModal(false)
      console.log(error)
    }
  })

  const handleControlModalAssociateTable = () => {
    setModalAssociateTableOpen(!modalAssociateTableOpen)
  }

  const handleControlModalAssociateUser = () => {
    setModalAssociateUserOpen(!modalAssociateUserOpen)
  }

  const handleOpenModalConfirmation = (
    text: string,
    action: GroupPageActions
  ) => {
    setTextModal(text)
    setCurrentAction(action)
    setModalConfirmOpen(true)
  }

  const handleCloseModalConfirmation = () => {
    setModalConfirmOpen(false)
    setTextModal('')
    setCurrentAction(null)
  }

  const handleDirectToFunction = async () => {
    if (!currentAction) return

    if (currentAction.nameAction === 'dissociate-table') {
      setLoadingModal(true)
      await dissociateTableFromGroupMutation.mutateAsync(
        Number(selectedTableId)
      )
      setLoadingModal(false)
      handleCloseModalConfirmation()
    } else if (currentAction.nameAction === 'dissociate-user') {
      setLoadingModal(true)
      await dissociateUserFromGroupMutation.mutateAsync(selectedUserId)
      setLoadingModal(false)
      handleCloseModalConfirmation()
    }
  }

  const getAvailableTables = () => {
    if (!getTablesQuery.data || !getGroupIdQuery.data) {
      return getTablesQuery.data || []
    }

    const associatedTableIds = getGroupIdQuery.data.map(
      (item) => item.tabela_id
    )

    return getTablesQuery.data.filter(
      (table) => !associatedTableIds.includes(table.id)
    )
  }

  return {
    handleBack,
    getGroupIdQuery,
    getGroupUsersQuery,
    getConnectionsQuery,
    getTablesQuery,
    getAvailableTables,
    setConnectionId,
    associateTableToGroupMutation,
    associateUserToGroupMutation,
    handleControlModalAssociateTable,
    handleControlModalAssociateUser,
    modalAssociateTableOpen,
    modalAssociateUserOpen,
    modalConfirmOpen,
    setModalConfirmOpen,
    textModal,
    loadingModal,
    setLoadingModal,
    handleOpenModalConfirmation,
    handleCloseModalConfirmation,
    handleDirectToFunction,
    dissociateTableFromGroupMutation,
    dissociateUserFromGroupMutation,
    setSelectedTableId,
    setSelectedUserId
  }
}
