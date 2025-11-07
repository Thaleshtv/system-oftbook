import { useState } from 'react'
import { MdOutlineClose } from 'react-icons/md'
import { HiOutlineFolder } from 'react-icons/hi'

interface ModalCreateFolderProps {
  onClose: () => void
  onConfirm: (folderName: string) => void
  loading?: boolean
}

export const ModalCreateFolder = ({
  onClose,
  onConfirm,
  loading = false
}: ModalCreateFolderProps) => {
  const [folderName, setFolderName] = useState('')

  const handleConfirm = () => {
    if (folderName.trim() && !loading) {
      onConfirm(folderName.trim())
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleConfirm()
    }
  }

  return (
    <div className="fixed inset-0 bg-[#000]/20 flex items-center justify-center z-[9999]">
      <div className="w-[500px] bg-white rounded-[24px] shadow-[0px_4px_50px_0px_rgba(33,33,33,0.08),0px_4px_6px_0px_rgba(33,33,33,0.04)] p-[24px] flex flex-col gap-[16px]">
        {/* Header */}
        <div className="flex items-start justify-between w-full">
          <div className="flex flex-col gap-[12px] flex-1">
            <h2 className="text-[18px] font-bold text-[#0B0B0B] leading-[26px] tracking-[-0.2px]">
              Nova Pasta
            </h2>
            <p className="text-[14px] text-[#979797] leading-[20px]">
              Digite o nome da nova pasta
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

        {/* Folder Icon */}
        <div className="flex justify-center py-[12px]">
          <HiOutlineFolder size={48} className="text-[#5F6367]" />
        </div>

        {/* Input */}
        <div className="w-full">
          <input
            type="text"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Nome da pasta"
            className="w-full px-[16px] py-[10px] border border-[#D9D9D9] rounded-[12px] bg-[#FAFAFA] text-[14px] text-[#0B0B0B] leading-[20px] outline-none focus:border-[#0F0A49]"
            autoFocus
            disabled={loading}
          />
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-[12px] w-full">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-[12px] py-[6px] bg-transparent text-[#979797] text-[12px] font-semibold rounded-[8px] leading-[18px] hover:bg-[#F5F5F5] disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!folderName.trim() || loading}
            className={`px-[12px] py-[6px] bg-[#0F0A49] text-white text-[12px] font-semibold rounded-[8px] leading-[18px] flex items-center justify-center ${
              !folderName.trim() || loading
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-[#0F0A49]/90'
            }`}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Criando...</span>
              </div>
            ) : (
              'Criar Pasta'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
