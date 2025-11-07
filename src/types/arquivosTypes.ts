// Document Types
export interface Document {
  file_name: string
  s3_key: string
  signed_url: string
  size?: number
  last_modified?: string
}

// Folder Types
export interface FolderItem {
  name: string
  type: 'file' | 'folder'
  s3_key?: string
  signed_url?: string
  size?: number
  last_modified?: string
}

// API Response Data Types
export interface UploadDocumentData {
  message: string
  data?: {
    file_name: string
    s3_key: string
    upload_url?: string
  }
}

export interface ListDocumentsData {
  message?: string
  documents?: Document[]
  data?: Document[]
}

export interface DeleteDocumentData {
  message: string
}

export interface CreateFolderData {
  message: string
  data?: {
    folder_name: string
    s3_key: string
  }
}

export interface ListFoldersData {
  message?: string
  contents?: FolderItem[]
  data?: FolderItem[]
}

export interface AnalyzePdfTokensData {
  num_pages: number
  total_tokens_estimated: {
    min: number
    max: number
  }
  estimated_cost_estimated: {
    min: number
    max: number
  }
  infos: {
    if_ocr: string
    if_not_english: string
  }
}

// Response Types (with status and data)
export interface UploadDocumentResponse {
  status: number
  data: UploadDocumentData
}

export interface ListDocumentsResponse {
  status: number
  data: ListDocumentsData
}

export interface DeleteDocumentResponse {
  status: number
  data: DeleteDocumentData
}

export interface CreateFolderResponse {
  status: number
  data: CreateFolderData
}

export interface ListFoldersResponse {
  status: number
  data: ListFoldersData
}

export interface AnalyzePdfTokensResponse {
  status: number
  data: AnalyzePdfTokensData
}
