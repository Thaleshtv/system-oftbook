import { useState, useEffect } from 'react'
import { HiOutlineUpload, HiOutlineCurrencyDollar } from 'react-icons/hi'
import { MdOutlineClose } from 'react-icons/md'
import { Arquivos } from '../../../../services/arquivos'

interface ModalUploadProps {
  onClose: () => void
  onConfirm: (file: File) => void
  loading?: boolean
}

export const ModalUpload = ({
  onClose,
  onConfirm,
  loading = false
}: ModalUploadProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [tokenData, setTokenData] = useState<{
    num_pages: number
    total_tokens_estimated: { min: number; max: number }
    estimated_cost_estimated: { min: number; max: number }
    infos: {
      if_ocr: string
      if_not_english: string
    }
  } | null>(null)

  useEffect(() => {
    const analyzeFile = async () => {
      if (selectedFile) {
        setAnalyzing(true)
        setTokenData(null)
        try {
          const response = await Arquivos.analyzePdfTokens(selectedFile)
          if (response.status === 200 && response.data) {
            setTokenData(response.data)
          }
        } catch (error) {
          console.error('Erro ao analisar arquivo:', error)
        } finally {
          setAnalyzing(false)
        }
      }
    }

    analyzeFile()
  }, [selectedFile])

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files.length > 0) {
      setSelectedFile(files[0])
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      setSelectedFile(files[0])
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i)) + sizes[i]
  }

  const handleConfirm = () => {
    if (selectedFile && !loading) {
      onConfirm(selectedFile)
    }
  }

  return (
    <div className="fixed inset-0 bg-[#000]/20 flex items-center justify-center z-[9999]">
      <div className="w-[600px] bg-white rounded-[24px] shadow-[0px_4px_50px_0px_rgba(33,33,33,0.08),0px_4px_6px_0px_rgba(33,33,33,0.04)] p-[24px] flex flex-col gap-[16px]">
        {/* Header */}
        <div className="flex items-start justify-between w-full">
          <div className="flex flex-col gap-[12px] flex-1">
            <h2 className="text-[18px] font-bold text-[#0B0B0B] leading-[26px] tracking-[-0.2px]">
              Upload
            </h2>
            <p className="text-[14px] text-[#979797] leading-[20px]">
              Faça upload do seu arquivo
            </p>
          </div>
          <button
            type="button"
            className="text-[#0B0B0B] hover:text-[#0B0B0B]/60 shrink-0"
            onClick={onClose}
            disabled={loading}
          >
            <MdOutlineClose size={24} />
          </button>
        </div>

        {/* Drag & Drop Area */}
        <div
          className={`border-2 border-dashed rounded-[8px] p-[24px] flex flex-col items-center justify-center gap-[12px] transition-colors ${
            isDragging
              ? 'border-[#1849D6] bg-[#1849D6]/5'
              : 'border-[#0F0A49] bg-white'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <HiOutlineUpload size={22} className="text-[#5C5E64]" />
          <div className="flex flex-col gap-[8px] items-center w-full">
            <div className="flex gap-[4px] items-center text-[14px] leading-[20px]">
              <span className="text-[#0B0B0B]">Arraste e solte</span>
              <span className="text-[#1849D6] font-semibold">seu arquivo</span>
            </div>
            <p className="text-[14px] text-[#979797] text-center leading-[20px]">
              Max 10 MB
            </p>
          </div>
          <input
            type="file"
            onChange={handleFileInput}
            className="hidden"
            id="file-input"
          />
          <label
            htmlFor="file-input"
            className="text-[12px] text-[#1849D6] cursor-pointer hover:underline"
          >
            Ou clique para selecionar
          </label>
        </div>

        {/* File Info */}
        {selectedFile && (
          <div className="flex flex-col gap-[6px] w-full">
            <p className="text-[14px] leading-[20px] text-[#979797]">
              Nome do arquivo:{' '}
              <span className="font-semibold text-[#1E1E1E]">
                {selectedFile.name}
              </span>
            </p>
            <p className="text-[14px] leading-[20px] text-[#979797]">
              Tam:{' '}
              <span className="font-medium text-[#1E1E1E]">
                {formatFileSize(selectedFile.size)}
              </span>
            </p>
            <p className="text-[14px] leading-[20px] text-[#979797]">
              Páginas:{' '}
              {analyzing ? (
                <span className="inline-block h-[14px] w-[30px] bg-[#E0E0E0] rounded animate-pulse"></span>
              ) : tokenData ? (
                <span className="font-semibold text-[#1E1E1E]">
                  {tokenData.num_pages}
                </span>
              ) : (
                <span className="font-semibold text-[#979797]">-</span>
              )}
            </p>
            <p className="text-[14px] leading-[20px] text-[#979797]">
              Tokens Estimados:{' '}
              {analyzing ? (
                <span className="inline-block h-[14px] w-[80px] bg-[#E0E0E0] rounded animate-pulse"></span>
              ) : tokenData ? (
                <span className="font-semibold text-[#1E1E1E]">
                  {tokenData.total_tokens_estimated.min.toLocaleString()} - {tokenData.total_tokens_estimated.max.toLocaleString()}
                </span>
              ) : (
                <span className="font-semibold text-[#979797]">-</span>
              )}
            </p>
            <div className="bg-[#071176] rounded-[7px] px-[12px] py-[4px] flex items-center gap-[4px] w-fit">
              <HiOutlineCurrencyDollar size={12} className="text-white" />
              <p className="text-[12px] text-white leading-[20px]">
                Custo Estimado:{' '}
                {analyzing ? (
                  <span className="inline-block h-[12px] w-[70px] bg-white/30 rounded animate-pulse"></span>
                ) : tokenData ? (
                  <span className="font-semibold">
                    R${tokenData.estimated_cost_estimated.min} - R${tokenData.estimated_cost_estimated.max}
                  </span>
                ) : (
                  <span className="font-semibold">R$-</span>
                )}
              </p>
            </div>
            {tokenData && (
              <div className="flex flex-col gap-[4px] text-[12px] text-[#979797] leading-[16px] mt-[4px]">
                <p>• {tokenData.infos.if_ocr}</p>
                <p>• {tokenData.infos.if_not_english}</p>
              </div>
            )}
          </div>
        )}

        {/* Divider */}
        <div className="flex gap-[12px] items-center w-full">
          <div className="flex-1 h-[1px] bg-[#E7E7E7]" />
          <div className="flex-1 h-[1px] bg-[#E7E7E7]" />
        </div>

        {/* File Name Input */}
        <div className="w-full">
          <input
            type="text"
            value={selectedFile?.name || ''}
            placeholder="Nome do arquivo"
            className="w-full px-[16px] py-[10px] border border-[#D9D9D9] rounded-[12px] bg-[#FAFAFA] text-[14px] text-[#0B0B0B] leading-[20px] outline-none focus:border-[#1849D6]"
            readOnly
          />
        </div>

        {/* Confirm Button */}
        <div className="flex items-center justify-end w-full">
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!selectedFile || loading}
            className={`px-[12px] py-[6px] bg-[#1849D6] text-white text-[12px] font-semibold rounded-[8px] leading-[18px] flex items-center justify-center ${
              !selectedFile || loading
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-[#1849D6]/90'
            }`}
          >
            {loading ? (
              <div className="h-[18px] w-[60px] bg-white/30 rounded animate-pulse"></div>
            ) : (
              'Confirmar'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
