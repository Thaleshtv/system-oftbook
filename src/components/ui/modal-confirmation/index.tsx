import { MdOutlineClose } from 'react-icons/md'

interface ModalConfirmProps {
  question: string
  onConfirm: () => void
  onCancel: () => void
  loading?: boolean
}

export const ModalConfirm = ({
  question,
  onConfirm,
  onCancel,
  loading = false
}: ModalConfirmProps) => {
  return (
    <div className="fixed inset-0 bg-[#000]/20 flex items-center justify-center z-[9999]">
      <div className="w-[600px] bg-white rounded-[18px] shadow-lg p-[32px]">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-[24px] font-medium">Confirmação</h2>
          <button
            type="button"
            className="text-[#000]/60 hover:text-[#000]/100"
            onClick={onCancel}
            disabled={loading}
          >
            <MdOutlineClose size={24} />
          </button>
        </div>

        {/* Pergunta */}
        <div className="mt-[24px] text-[16px] text-[#141414]">{question}</div>

        {/* Botões */}
        <div className="mt-[24px] flex items-center justify-end gap-[16px]">
          <button
            type="button"
            onClick={onCancel}
            className="px-[24px] py-[12px] text-[14px] text-[#141414] rounded-[8px] border border-[#D4D4D4] hover:bg-gray-100"
            disabled={loading}
          >
            Não
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-[24px] py-[12px] text-[14px] text-white bg-[#004080] rounded-[8px] flex items-center justify-center ${
              loading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Processando...</span>
              </div>
            ) : (
              'Sim'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
