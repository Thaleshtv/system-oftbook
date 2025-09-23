import { MdOutlineClose } from 'react-icons/md'
import { IAgenteResponse } from '../../../../services/agentes'

interface ModalPromptProps {
  onClose: () => void
  agente: IAgenteResponse | null
}

export const ModalPrompt = ({ onClose, agente }: ModalPromptProps) => {
  if (!agente) {
    return null
  }

  return (
    <div className="fixed inset-0 bg-[#000]/20 flex items-center justify-center z-[9999]">
      <div className="w-[800px] bg-white rounded-[18px] shadow-lg p-[32px]">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-[24px] font-medium">Prompt Template</h2>
          <button
            type="button"
            className="text-[#000]/60 hover:text-[#000]/100"
            onClick={onClose}
          >
            <MdOutlineClose size={24} />
          </button>
        </div>

        {/* Prompt Template */}
        <div className="flex flex-col gap-[4px] mt-[24px]">
          <div className="text-[16px] text-[#141414]">Template do Prompt</div>
          <div className="text-[12px] text-[#141414]/50">
            Este é o template de prompt usado pelo agente
          </div>
        </div>

        <div className="mt-[12px]">
          <div className="border border-[#CACACA] rounded-[8px] bg-[#FAFAFA] p-[16px] max-h-[400px] overflow-y-auto">
            <pre className="text-[14px] text-[#141414] whitespace-pre-wrap font-mono leading-relaxed">
              {agente.prompt_template}
            </pre>
          </div>
        </div>

        {/* Button */}
        <div className="mt-[24px] flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-[24px] py-[12px] text-[14px] text-[#141414] rounded-[8px] border border-[#D4D4D4] hover:bg-gray-100"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  )
}
