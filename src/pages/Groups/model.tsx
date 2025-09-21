import { useMutation, useQuery } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { Groups, IGroupPayload } from '../../services/groups'
import z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AxiosError } from 'axios'
import { useToastStore } from '../../store/toastStore'
import { useState } from 'react'
import { ITablePayload } from '../../services/tables'

const groupSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  qtd_tabelas: z.number().min(0, 'Quantidade de tabelas é obrigatório'),
  qtd_usuarios: z.number().min(0, 'Quantidade de usuários é obrigatório'),
  ativa: z.boolean()
})

export type GroupFormValues = z.infer<typeof groupSchema>

export const useGroups = () => {
  const { dispatch: dispatchToast } = useToastStore()
  const [selectedGroupId, setSelectedGroupId] = useState<string>('')
  const [modalConfirmOpen, setModalConfirmOpen] = useState(false)
  const [textModalConfirm, setTextModalConfirm] = useState('')

  const [modalEditOpen, setModalEditOpen] = useState(false)

  const handleOpenModalConfirm = (text: string) => {
    if (!text) return
    setTextModalConfirm(text)
    setModalConfirmOpen(true)
  }

  const handleCloseModalConfirmation = () => {
    setModalConfirmOpen(false)
    setTextModalConfirm('')
  }

  const form = useForm<GroupFormValues>({
    resolver: zodResolver(groupSchema),
    defaultValues: {
      nome: '',
      qtd_tabelas: 0,
      qtd_usuarios: 0,
      ativa: true
    }
  })
  const router = useRouter()

  const getGroupsQuery = useQuery({
    queryKey: ['getGroupsList'],
    queryFn: async () => {
      const response = await Groups.getGroups()
      return response
    }
  })

  const getGroupDetailQuery = useQuery({
    queryKey: ['getGroupDetailById', selectedGroupId],
    queryFn: async () => {
      if (!selectedGroupId) throw new Error('ID não definido')
      const response = await Groups.getGroupDetailById(selectedGroupId)
      return response
    },
    enabled: !!selectedGroupId
  })

  const createGroupMutation = useMutation({
    mutationFn: async (data: GroupFormValues) => {
      const response = await Groups.createGroup(data)
      return response
    },
    onSuccess: () => {
      form.reset()
      getGroupsQuery.refetch()
      dispatchToast.setOpenToast('success', 'Grupo criado com sucesso')
    },
    onError: (error: AxiosError) => {
      const data = error.response?.data as { detail: string } | undefined
      dispatchToast.setOpenToast(
        'error',
        data?.detail || 'Erro ao criar conexão'
      )
    }
  })

  const updateGroupMutation = useMutation({
    mutationFn: async ({
      groupId,
      data
    }: {
      groupId: string
      data: IGroupPayload
    }) => {
      const response = await Groups.updateGroup(groupId, data)
      return response
    },
    onSuccess: () => {
      getGroupsQuery.refetch()
      getGroupDetailQuery.refetch()
      dispatchToast.setOpenToast('success', 'Grupo atualizado com sucesso')
      setModalEditOpen(false)
    },
    onError: (error: AxiosError) => {
      const data = error.response?.data as { detail: string } | undefined
      dispatchToast.setOpenToast(
        'error',
        data?.detail || 'Erro ao atualizar grupo'
      )
    }
  })

  const deleteGroupMutation = useMutation({
    mutationFn: async (groupId: string) => {
      const response = await Groups.deleteGroup(groupId)
      return response
    },
    onSuccess: () => {
      getGroupsQuery.refetch()
      dispatchToast.setOpenToast('success', 'Grupo deletado com sucesso')
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

  const onSubmit = form.handleSubmit((data) => {
    createGroupMutation.mutate(data)
  })
  return {
    handleBack,
    handleDirectGroup,
    getGroupsQuery,
    form,
    onSubmit,
    createGroupMutation,
    getGroupDetailQuery,
    selectedGroupId,
    setSelectedGroupId,
    modalConfirmOpen,
    setModalConfirmOpen,
    textModalConfirm,
    handleOpenModalConfirm,
    modalEditOpen,
    setModalEditOpen,
    deleteGroupMutation,
    updateGroupMutation
  }
}
