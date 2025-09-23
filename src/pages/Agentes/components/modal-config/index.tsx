import { useState, useEffect } from 'react'
import { MdOutlineClose } from 'react-icons/md'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Modelos, IModeloResponse } from '../../../../services/modelos'
import { ApiKeys, IApiKeyResponse } from '../../../../services/apiKeys'
import { IAgenteResponse } from '../../../../services/agentes'

// Schema Zod
const configSchema = z.object({
  modelo_id: z.string().min(1, 'Selecione um modelo'),
  api_key_id: z.string().min(1, 'Selecione uma API Key')
})

type ConfigFormData = z.infer<typeof configSchema>

interface ModalConfigProps {
  onClose: () => void
  onSave: (data: ConfigFormData) => void
  agente?: IAgenteResponse // agente opcional para edição
}

export const ModalConfig = ({ onClose, onSave, agente }: ModalConfigProps) => {
  const [modelos, setModelos] = useState<IModeloResponse[]>([])
  const [apiKeys, setApiKeys] = useState<IApiKeyResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<ConfigFormData>({
    resolver: zodResolver(configSchema),
    defaultValues: {
      modelo_id: agente?.modelo_id || '',
      api_key_id: ''
    }
  })

  const selectedModeloId = watch('modelo_id')
  const selectedApiKeyId = watch('api_key_id')

  // Função para lidar com a seleção de modelo e automaticamente selecionar a API key correspondente
  const handleModeloSelect = (modelo: IModeloResponse) => {
    setValue('modelo_id', modelo.id)
    setValue('api_key_id', modelo.api_key_id)
  }

  // Buscar dados da API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        const [modelosData, apiKeysData] = await Promise.all([
          Modelos.getModelos(),
          ApiKeys.getApiKeys()
        ])

        setModelos(modelosData)
        setApiKeys(apiKeysData)

        // Definir valores padrão se houver dados - seleciona o primeiro modelo e sua API key correspondente
        if (modelosData.length > 0) {
          handleModeloSelect(modelosData[0])
        }
      } catch (err) {
        setError('Erro ao carregar dados')
        console.error('Erro ao buscar dados:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [setValue])

  const onSubmit = (data: ConfigFormData) => {
    onSave(data)
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-[#000]/20 flex items-center justify-center z-[9999]">
        <div className="w-[600px] bg-white rounded-[18px] shadow-lg p-[32px]">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg text-gray-600">
              Carregando configurações...
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-[#000]/20 flex items-center justify-center z-[9999]">
        <div className="w-[600px] bg-white rounded-[18px] shadow-lg p-[32px]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[24px] font-medium">Erro</h2>
            <button
              type="button"
              className="text-[#000]/60 hover:text-[#000]/100"
              onClick={onClose}
            >
              <MdOutlineClose size={24} />
            </button>
          </div>
          <div className="text-red-600">{error}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-[#000]/20 flex items-center justify-center z-[9999]">
      <div className="w-[600px] bg-white rounded-[18px] shadow-lg p-[32px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-[24px] font-medium">Configurações</h2>
            <button
              type="button"
              className="text-[#000]/60 hover:text-[#000]/100"
              onClick={onClose}
            >
              <MdOutlineClose size={24} />
            </button>
          </div>

          {/* Modelos */}
          <div className="flex flex-col gap-[4px] mt-[24px]">
            <div className="text-[16px] text-[#141414]">Modelos</div>
            <div className="text-[12px] text-[#141414]/50">
              Selecione o modelo de IA que você deseja usar
            </div>
          </div>

          <div className="flex flex-col gap-[12px] mt-[12px]">
            {modelos.length === 0 ? (
              <div className="text-sm text-gray-500 p-4 text-center">
                Nenhum modelo encontrado
              </div>
            ) : (
              modelos.map((modelo) => (
                <div
                  key={modelo.id}
                  onClick={() => handleModeloSelect(modelo)}
                  className={`px-[12px] py-[12px] text-[14px] rounded-[8px] cursor-pointer transition-colors ${
                    selectedModeloId === modelo.id
                      ? 'bg-[#004080BD] text-white'
                      : 'border border-[#E4E4E7] text-[#141414]/80 hover:bg-gray-100'
                  }`}
                >
                  <div className="font-medium">{modelo.nome}</div>
                  <div className="text-xs opacity-75 mt-1">
                    Modelo: {modelo.modelo} | ID: {modelo.id}
                  </div>
                </div>
              ))
            )}
            {errors.modelo_id && (
              <span className="text-red-500 text-xs">
                {errors.modelo_id.message}
              </span>
            )}
          </div>

          {/* API Keys */}
          <div className="flex flex-col gap-[4px] mt-[24px]">
            <div className="text-[16px] text-[#141414]">API Key</div>
            <div className="text-[12px] text-[#141414]/50">
              API Key selecionada automaticamente baseada no modelo escolhido
            </div>
          </div>

          <div className="flex flex-col gap-[12px] mt-[12px]">
            {selectedApiKeyId ? (
              (() => {
                const selectedApiKey = apiKeys.find(
                  (key) => key.id === selectedApiKeyId
                )
                return selectedApiKey ? (
                  <div className="px-[12px] py-[12px] text-[14px] rounded-[8px] bg-[#004080BD] text-white">
                    <div className="font-medium">{selectedApiKey.nome}</div>
                    <div className="text-xs opacity-75 mt-1">
                      ID: {selectedApiKey.id} (Selecionada automaticamente)
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-gray-500 p-4 text-center">
                    API Key não encontrada
                  </div>
                )
              })()
            ) : (
              <div className="text-sm text-gray-500 p-4 text-center">
                Selecione um modelo primeiro
              </div>
            )}
            {errors.api_key_id && (
              <span className="text-red-500 text-xs">
                {errors.api_key_id.message}
              </span>
            )}
          </div>

          {/* Buttons */}
          <div className="mt-[24px] flex items-center justify-end gap-[16px]">
            <button
              type="button"
              onClick={onClose}
              className="px-[24px] py-[12px] text-[14px] text-[#141414] rounded-[8px] border border-[#D4D4D4] hover:bg-gray-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-[24px] py-[12px] text-[14px] text-white bg-[#004080] rounded-[8px] hover:bg-[#003366] transition-colors"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
