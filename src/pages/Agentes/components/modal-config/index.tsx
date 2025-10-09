import { useState, useEffect } from 'react'
import { MdOutlineClose, MdAdd } from 'react-icons/md'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Modelos, IModeloResponse } from '../../../../services/modelos'
import { ApiKeys, IApiKeyResponse } from '../../../../services/apiKeys'
import { IAgenteResponse } from '../../../../services/agentes'
import { Skeleton } from '../../../../components/ui/skeleton'

// Schema Zod
const configSchema = z.object({
  modelo_id: z.string().min(1, 'Selecione um modelo'),
  api_key_id: z.string().min(1, 'Selecione uma API Key')
})

const createModeloSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  modelo: z.string().min(1, 'Modelo é obrigatório'),
  api_key_id: z.string().min(1, 'Selecione uma API Key')
})

const createApiKeySchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  api_key: z.string().min(1, 'API Key é obrigatória')
})

type ConfigFormData = z.infer<typeof configSchema>
type CreateModeloFormData = z.infer<typeof createModeloSchema>
type CreateApiKeyFormData = z.infer<typeof createApiKeySchema>

interface ModalConfigProps {
  onClose: () => void
  onSave: (data: ConfigFormData) => void | Promise<void>
  agente?: IAgenteResponse // agente opcional para edição
}

export const ModalConfig = ({ onClose, onSave, agente }: ModalConfigProps) => {
  const [modelos, setModelos] = useState<IModeloResponse[]>([])
  const [apiKeys, setApiKeys] = useState<IApiKeyResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showCreateModeloModal, setShowCreateModeloModal] = useState(false)
  const [showCreateApiKeyModal, setShowCreateApiKeyModal] = useState(false)
  const [creatingModelo, setCreatingModelo] = useState(false)
  const [creatingApiKey, setCreatingApiKey] = useState(false)
  const [saving, setSaving] = useState(false)

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

  const createModeloForm = useForm<CreateModeloFormData>({
    resolver: zodResolver(createModeloSchema),
    defaultValues: {
      nome: '',
      modelo: '',
      api_key_id: ''
    }
  })

  const createApiKeyForm = useForm<CreateApiKeyFormData>({
    resolver: zodResolver(createApiKeySchema),
    defaultValues: {
      nome: '',
      api_key: ''
    }
  })

  const selectedModeloId = watch('modelo_id')
  const selectedApiKeyId = watch('api_key_id')

  // Função para lidar com a seleção de modelo e automaticamente selecionar a API key correspondente
  const handleModeloSelect = (modelo: IModeloResponse) => {
    setValue('modelo_id', modelo.id)
    setValue('api_key_id', modelo.api_key_id)
  }

  // Função para criar um novo modelo
  const handleCreateModelo = async (data: CreateModeloFormData) => {
    try {
      setCreatingModelo(true)
      const newModelo = await Modelos.createModelo(data)
      setModelos((prev) => [...prev, newModelo])
      setShowCreateModeloModal(false)
      createModeloForm.reset()
      // Auto-selecionar o modelo recém-criado
      handleModeloSelect(newModelo)
    } catch (error) {
      console.error('Erro ao criar modelo:', error)
      // Aqui você pode adicionar um toast ou notificação de erro
    } finally {
      setCreatingModelo(false)
    }
  }

  // Função para criar uma nova API key
  const handleCreateApiKey = async (data: CreateApiKeyFormData) => {
    try {
      setCreatingApiKey(true)
      const newApiKey = await ApiKeys.createApiKey(data)
      setApiKeys((prev) => [...prev, newApiKey])
      setShowCreateApiKeyModal(false)
      createApiKeyForm.reset()
    } catch (error) {
      console.error('Erro ao criar API key:', error)
      // Aqui você pode adicionar um toast ou notificação de erro
    } finally {
      setCreatingApiKey(false)
    }
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

        // Se há um agente sendo editado, selecionar o modelo correspondente
        if (agente) {
          const agenteModelo = modelosData.find(
            (m) => m.id === agente.modelo_id
          )
          if (agenteModelo) {
            handleModeloSelect(agenteModelo)
          }
        } else {
          // Definir valores padrão se houver dados - seleciona o primeiro modelo e sua API key correspondente
          if (modelosData.length > 0) {
            handleModeloSelect(modelosData[0])
          }
        }
      } catch (err) {
        setError('Erro ao carregar dados')
        console.error('Erro ao buscar dados:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [setValue, agente])

  const onSubmit = async (data: ConfigFormData) => {
    // Se há um agente sendo editado, verificar se houve alteração
    if (agente) {
      if (data.modelo_id !== agente.modelo_id) {
        // Houve alteração, salvar as mudanças
        try {
          setSaving(true)
          await onSave(data)
        } catch (error) {
          console.error('Erro ao salvar configuração:', error)
          // Aqui você pode adicionar um toast ou notificação de erro
          return
        } finally {
          setSaving(false)
        }
      } else {
        // Não houve alteração, apenas fechar o modal
        onSave(data)
      }
    } else {
      // Novo agente ou sem agente especificado
      onSave(data)
    }
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-[#000]/20 flex items-center justify-center z-[9999]">
        <div className="w-[600px] bg-white rounded-[18px] shadow-lg p-[32px]">
          <div className="flex items-center justify-between mb-6">
            <Skeleton width="200px" height="24px" />
            <Skeleton variant="circular" width="24px" height="24px" />
          </div>
          <div className="space-y-6">
            <div className="space-y-2">
              <Skeleton width="120px" height="14px" />
              <Skeleton height="44px" />
            </div>
            <div className="space-y-2">
              <Skeleton width="100px" height="14px" />
              <Skeleton height="44px" />
            </div>
            <div className="space-y-2">
              <Skeleton width="140px" height="14px" />
              <Skeleton height="44px" />
            </div>
            <div className="space-y-2">
              <Skeleton width="160px" height="14px" />
              <Skeleton height="44px" />
            </div>
            <div className="flex justify-end gap-3">
              <Skeleton width="80px" height="44px" />
              <Skeleton width="80px" height="44px" />
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
            <h2 className="text-[24px] font-medium">
              {agente ? `Configurações - ${agente.cod}` : 'Configurações'}
            </h2>
            <button
              type="button"
              className="text-[#000]/60 hover:text-[#000]/100"
              onClick={onClose}
            >
              <MdOutlineClose size={24} />
            </button>
          </div>

          {/* Modelos */}
          <div className="flex items-center justify-between mt-[24px]">
            <div className="flex flex-col gap-[4px]">
              <div className="text-[16px] text-[#141414]">Modelos</div>
              <div className="text-[12px] text-[#141414]/50">
                Selecione o modelo de IA que você deseja usar
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowCreateModeloModal(true)}
              className="flex items-center gap-2 px-3 py-2 text-sm text-[#004080] border border-[#004080] rounded-lg hover:bg-[#004080]/10 transition-colors"
            >
              <MdAdd size={16} />
              Criar Modelo
            </button>
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
                  <div className="font-medium flex items-center gap-2">
                    {modelo.nome}
                    {agente && modelo.id === agente.modelo_id && (
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          selectedModeloId === modelo.id
                            ? 'bg-white/20 text-white'
                            : 'bg-blue-100 text-blue-600'
                        }`}
                      >
                        Atual
                      </span>
                    )}
                  </div>
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
          <div className="flex items-center justify-between mt-[24px]">
            <div className="flex flex-col gap-[4px]">
              <div className="text-[16px] text-[#141414]">API Key</div>
              <div className="text-[12px] text-[#141414]/50">
                API Key selecionada automaticamente baseada no modelo escolhido
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowCreateApiKeyModal(true)}
              className="flex items-center gap-2 px-3 py-2 text-sm text-[#004080] border border-[#004080] rounded-lg hover:bg-[#004080]/10 transition-colors"
            >
              <MdAdd size={16} />
              Criar API Key
            </button>
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
              disabled={saving}
              className="px-[24px] py-[12px] text-[14px] text-white bg-[#004080] rounded-[8px] hover:bg-[#003366] transition-colors disabled:opacity-50"
            >
              {saving ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>

      {/* Modal Criar Modelo */}
      {showCreateModeloModal && (
        <div className="fixed inset-0 bg-[#000]/40 flex items-center justify-center z-[10000]">
          <div className="w-[500px] bg-white rounded-[18px] shadow-lg p-[32px]">
            <form onSubmit={createModeloForm.handleSubmit(handleCreateModelo)}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-[20px] font-medium">Criar Novo Modelo</h3>
                <button
                  type="button"
                  className="text-[#000]/60 hover:text-[#000]/100"
                  onClick={() => setShowCreateModeloModal(false)}
                >
                  <MdOutlineClose size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome do Modelo
                  </label>
                  <input
                    type="text"
                    {...createModeloForm.register('nome')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004080] focus:border-transparent"
                    placeholder="Digite o nome do modelo"
                  />
                  {createModeloForm.formState.errors.nome && (
                    <span className="text-red-500 text-xs">
                      {createModeloForm.formState.errors.nome.message}
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Modelo
                  </label>
                  <input
                    type="text"
                    {...createModeloForm.register('modelo')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004080] focus:border-transparent"
                    placeholder="Ex: gpt-4, claude-3, etc."
                  />
                  {createModeloForm.formState.errors.modelo && (
                    <span className="text-red-500 text-xs">
                      {createModeloForm.formState.errors.modelo.message}
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    API Key
                  </label>
                  <select
                    {...createModeloForm.register('api_key_id')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004080] focus:border-transparent"
                  >
                    <option value="">Selecione uma API Key</option>
                    {apiKeys.map((apiKey) => (
                      <option key={apiKey.id} value={apiKey.id}>
                        {apiKey.nome}
                      </option>
                    ))}
                  </select>
                  {createModeloForm.formState.errors.api_key_id && (
                    <span className="text-red-500 text-xs">
                      {createModeloForm.formState.errors.api_key_id.message}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowCreateModeloModal(false)}
                  className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={creatingModelo}
                  className="px-4 py-2 text-sm text-white bg-[#004080] rounded-lg hover:bg-[#003366] disabled:opacity-50"
                >
                  {creatingModelo ? 'Criando...' : 'Criar Modelo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Criar API Key */}
      {showCreateApiKeyModal && (
        <div className="fixed inset-0 bg-[#000]/40 flex items-center justify-center z-[10000]">
          <div className="w-[500px] bg-white rounded-[18px] shadow-lg p-[32px]">
            <form onSubmit={createApiKeyForm.handleSubmit(handleCreateApiKey)}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-[20px] font-medium">Criar Nova API Key</h3>
                <button
                  type="button"
                  className="text-[#000]/60 hover:text-[#000]/100"
                  onClick={() => setShowCreateApiKeyModal(false)}
                >
                  <MdOutlineClose size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome da API Key
                  </label>
                  <input
                    type="text"
                    {...createApiKeyForm.register('nome')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004080] focus:border-transparent"
                    placeholder="Digite o nome da API Key"
                  />
                  {createApiKeyForm.formState.errors.nome && (
                    <span className="text-red-500 text-xs">
                      {createApiKeyForm.formState.errors.nome.message}
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    API Key
                  </label>
                  <input
                    type="password"
                    {...createApiKeyForm.register('api_key')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004080] focus:border-transparent"
                    placeholder="Cole sua API Key aqui"
                  />
                  {createApiKeyForm.formState.errors.api_key && (
                    <span className="text-red-500 text-xs">
                      {createApiKeyForm.formState.errors.api_key.message}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowCreateApiKeyModal(false)}
                  className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={creatingApiKey}
                  className="px-4 py-2 text-sm text-white bg-[#004080] rounded-lg hover:bg-[#003366] disabled:opacity-50"
                >
                  {creatingApiKey ? 'Criando...' : 'Criar API Key'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
