import api from './api'
import type {
  UploadDocumentResponse,
  ListDocumentsResponse,
  DeleteDocumentResponse,
  CreateFolderResponse,
  ListFoldersResponse,
  AnalyzePdfTokensResponse
} from '../types/arquivosTypes'

export const Arquivos = {
  uploadDocument: async (
    file: File,
    folder?: string
  ): Promise<UploadDocumentResponse> => {
    const formData = new FormData()
    formData.append('file', file)
    if (folder) {
      formData.append('folder', folder)
    }

    const response = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return { status: response.status, data: response.data }
  },

  listDocuments: async (folder?: string): Promise<ListDocumentsResponse> => {
    const params = folder ? { folder } : {}
    const response = await api.get('/documents', {
      params,
      paramsSerializer: {
        encode: (value: string) => encodeURIComponent(value)
      }
    })
    return { status: response.status, data: response.data }
  },

  deleteDocument: async (fileName: string): Promise<DeleteDocumentResponse> => {
    const response = await api.delete(`/documents/${fileName}`)
    return { status: response.status, data: response.data }
  },

  createFolder: async (
    folderName: string,
    parentPath?: string
  ): Promise<CreateFolderResponse> => {
    const params: { folder_name: string; parent_path?: string } = { folder_name: folderName }
    if (parentPath) {
      params.parent_path = parentPath
    }
    const response = await api.post('/folders', null, { params })
    return { status: response.status, data: response.data }
  },

  listFolders: async (folderPath?: string): Promise<ListFoldersResponse> => {
    const params = folderPath ? { path: folderPath } : {}
    const response = await api.get('/folders', {
      params,
      paramsSerializer: {
        encode: (value: string) => encodeURIComponent(value)
      }
    })
    return { status: response.status, data: response.data }
  },

  analyzePdfTokens: async (file: File): Promise<AnalyzePdfTokensResponse> => {
    const formData = new FormData()
    formData.append('file', file)

    const response = await api.post('/analyze_pdf_tokens', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return { status: response.status, data: response.data }
  }
}
