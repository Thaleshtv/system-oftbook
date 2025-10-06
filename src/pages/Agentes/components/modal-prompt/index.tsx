import { useState } from 'react'
import { MdOutlineClose, MdEdit, MdSave, MdCancel } from 'react-icons/md'
import { IAgenteResponse } from '../../../../services/agentes'

interface ModalPromptProps {
  onClose: () => void
  agente: IAgenteResponse | null
  onUpdatePrompt: (
    agenteId: string,
    newPrompt: string
  ) => Promise<IAgenteResponse>
  isUpdating: boolean
}

export const ModalPrompt = ({
  onClose,
  agente,
  onUpdatePrompt,
  isUpdating
}: ModalPromptProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editedPrompt, setEditedPrompt] = useState(
    agente?.prompt_template || ''
  )
  const [saveError, setSaveError] = useState<string | null>(null)

  if (!agente) {
    return null
  }

  const handleEdit = () => {
    setIsEditing(true)
    setEditedPrompt(agente.prompt_template)
    setSaveError(null)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setEditedPrompt(agente.prompt_template)
    setSaveError(null)
  }

  const handleSave = async () => {
    try {
      setSaveError(null)
      await onUpdatePrompt(agente.id, editedPrompt)
      setIsEditing(false)
    } catch (error) {
      setSaveError('Erro ao salvar o prompt. Tente novamente.')
      console.error('Erro ao salvar prompt:', error)
    }
  }

  return (
    <div className="fixed inset-0 bg-[#000]/20 flex items-center justify-center z-[9999]">
      <div className="w-[800px] bg-white rounded-[18px] shadow-lg p-[32px] max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-[24px] font-medium">
            Prompt Template - {agente.cod}
          </h2>
          <button
            type="button"
            className="text-[#000]/60 hover:text-[#000]/100"
            onClick={onClose}
            disabled={isUpdating}
          >
            <MdOutlineClose size={24} />
          </button>
        </div>

        {/* Prompt Template */}
        <div className="flex flex-col gap-[4px] mt-[24px]">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[16px] text-[#141414]">
                Template do Prompt
              </div>
              <div className="text-[12px] text-[#141414]/50">
                {isEditing
                  ? 'Edite o template de prompt do agente'
                  : 'Este é o template de prompt usado pelo agente'}
              </div>
            </div>
            {!isEditing && (
              <button
                onClick={handleEdit}
                className="flex items-center gap-2 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                disabled={isUpdating}
              >
                <MdEdit size={16} />
                Editar
              </button>
            )}
          </div>
        </div>

        {/* Error Message */}
        {saveError && (
          <div className="mt-[12px] p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="text-sm text-red-600">{saveError}</div>
          </div>
        )}

        <div className="mt-[12px]">
          {isEditing ? (
            <textarea
              value={editedPrompt}
              onChange={(e) => setEditedPrompt(e.target.value)}
              className="w-full h-[400px] border border-[#CACACA] rounded-[8px] p-[16px] text-[14px] text-[#141414] font-mono leading-relaxed resize-none focus:outline-none focus:border-blue-500"
              placeholder="Digite o template do prompt..."
              disabled={isUpdating}
            />
          ) : (
            <div className="border border-[#CACACA] rounded-[8px] bg-[#FAFAFA] p-[16px] max-h-[400px] overflow-y-auto">
              <pre className="text-[14px] text-[#141414] whitespace-pre-wrap font-mono leading-relaxed">
                {agente.prompt_template}
              </pre>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="mt-[24px] flex items-center justify-end gap-3">
          {isEditing ? (
            <>
              <button
                type="button"
                onClick={handleCancelEdit}
                className="flex items-center gap-2 px-[24px] py-[12px] text-[14px] text-[#141414] rounded-[8px] border border-[#D4D4D4] hover:bg-gray-100 transition-colors"
                disabled={isUpdating}
              >
                <MdCancel size={16} />
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="flex items-center gap-2 px-[24px] py-[12px] text-[14px] text-white bg-blue-600 rounded-[8px] hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isUpdating || !editedPrompt.trim()}
              >
                <MdSave size={16} />
                {isUpdating ? 'Salvando...' : 'Salvar'}
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="px-[24px] py-[12px] text-[14px] text-[#141414] rounded-[8px] border border-[#D4D4D4] hover:bg-gray-100 transition-colors"
              disabled={isUpdating}
            >
              Fechar
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
