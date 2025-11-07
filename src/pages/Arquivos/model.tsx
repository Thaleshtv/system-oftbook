import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Arquivos } from '../../services/arquivos'
import { useToastStore } from '../../store/toastStore'

export const useArquivos = () => {
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [showCreateFolderModal, setShowCreateFolderModal] = useState(false)
  const [currentPath, setCurrentPath] = useState<string>('')
  const { setOpenToast } = useToastStore((state) => state.dispatch)
  const queryClient = useQueryClient()

  const { data: foldersData, isLoading: isFoldersLoading } = useQuery({
    queryKey: ['folders', currentPath],
    queryFn: async () => {
      const response = await Arquivos.listFolders(currentPath || undefined)
      console.log('Folders API Response:', response)
      console.log('Folders response.data:', response.data)

      if (response.status === 200 && response.data) {
        // Se tem contents, usa ele
        if (response.data.contents && Array.isArray(response.data.contents)) {
          console.log('Folders data.contents is array:', response.data.contents)
          return response.data.contents
        }
        // Se response.data é um array direto
        if (Array.isArray(response.data)) {
          console.log('Folders data is array:', response.data)
          return response.data
        }
        // Se tem data
        if (response.data.data && Array.isArray(response.data.data)) {
          console.log('Folders data.data is array:', response.data.data)
          return response.data.data
        }
      }

      console.log('Returning empty array for folders')
      return []
    },
    retry: 1
  })

  const { data: documentsData, isLoading: isDocumentsLoading } = useQuery({
    queryKey: ['documents', currentPath],
    queryFn: async () => {
      const response = await Arquivos.listDocuments(currentPath || undefined)
      console.log('Documents API Response:', response)
      console.log('Documents response.data:', response.data)

      if (response.status === 200 && response.data.data) {
        console.log('Documents data.data:', response.data.data)
        return response.data.data
      }
      console.log('Returning empty array for documents')
      return []
    },
    retry: 1
  })

  const folders =
    foldersData?.filter((item) => item.type === 'folder') || []
  const arquivos = documentsData || []

  console.log('Computed folders:', folders)
  console.log('Computed arquivos:', arquivos)

  const uploadMutation = useMutation({
    mutationFn: (file: File) => {
      console.log('Uploading file to path:', currentPath || 'root')
      return Arquivos.uploadDocument(file, currentPath || undefined)
    },
    onSuccess: (response) => {
      if (response.status === 200) {
        const message = currentPath
          ? `${response.data.message} em ${currentPath}`
          : response.data.message
        setOpenToast('success', message)
        setShowUploadModal(false)
        queryClient.invalidateQueries({ queryKey: ['folders', currentPath] })
        queryClient.invalidateQueries({ queryKey: ['documents', currentPath] })
      }
    },
    onError: (error: any) => {
      console.error('Erro ao fazer upload:', error)
      const errorMessage =
        error?.response?.data?.message || 'Erro ao fazer upload do arquivo'
      setOpenToast('error', errorMessage)
    }
  })

  const deleteMutation = useMutation({
    mutationFn: Arquivos.deleteDocument,
    onSuccess: (response) => {
      if (response.status === 200) {
        setOpenToast('success', response.data.message)
        queryClient.invalidateQueries({ queryKey: ['folders', currentPath] })
        queryClient.invalidateQueries({ queryKey: ['documents', currentPath] })
      }
    },
    onError: (error: any) => {
      console.error('Erro ao deletar arquivo:', error)
      const errorMessage =
        error?.response?.data?.message || 'Erro ao deletar arquivo'
      setOpenToast('error', errorMessage)
    }
  })

  const createFolderMutation = useMutation({
    mutationFn: (folderName: string) =>
      Arquivos.createFolder(folderName, currentPath || undefined),
    onSuccess: (response) => {
      if (response.status === 200 || response.status === 201) {
        setOpenToast('success', response.data.message)
        setShowCreateFolderModal(false)
        queryClient.invalidateQueries({ queryKey: ['folders', currentPath] })
      }
    },
    onError: (error: any) => {
      console.error('Erro ao criar pasta:', error)
      const errorMessage =
        error?.response?.data?.message || 'Erro ao criar pasta'
      setOpenToast('error', errorMessage)
    }
  })

  const handleOpenUploadModal = () => {
    setShowUploadModal(true)
  }

  const handleCloseUploadModal = () => {
    setShowUploadModal(false)
  }

  const handleOpenCreateFolderModal = () => {
    setShowCreateFolderModal(true)
  }

  const handleCloseCreateFolderModal = () => {
    setShowCreateFolderModal(false)
  }

  const uploadArquivo = (file: File) => {
    uploadMutation.mutate(file)
  }

  const deleteArquivo = (fileName: string) => {
    deleteMutation.mutate(fileName)
  }

  const createFolder = (folderName: string) => {
    createFolderMutation.mutate(folderName)
  }

  const navigateToFolder = (folderPath: string) => {
    setCurrentPath(folderPath)
  }

  const navigateBack = () => {
    if (currentPath) {
      const pathParts = currentPath.split('/').filter(Boolean)
      pathParts.pop()
      setCurrentPath(pathParts.join('/'))
    }
  }

  return {
    arquivos,
    folders,
    currentPath,
    isLoading:
      isFoldersLoading ||
      isDocumentsLoading ||
      uploadMutation.isPending ||
      deleteMutation.isPending ||
      createFolderMutation.isPending,
    showUploadModal,
    showCreateFolderModal,
    handleOpenUploadModal,
    handleCloseUploadModal,
    handleOpenCreateFolderModal,
    handleCloseCreateFolderModal,
    uploadArquivo,
    deleteArquivo,
    createFolder,
    navigateToFolder,
    navigateBack
  }
}
