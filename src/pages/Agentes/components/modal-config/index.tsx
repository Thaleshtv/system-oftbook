import { useState } from 'react'
import { MdAutoAwesome, MdKey, MdOutlineClose } from 'react-icons/md'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

// Arrays fixos
const providers = ['OpenAi', 'Groq', 'Gemini'] as const

const modelsByProvider: Record<(typeof providers)[number], string[]> = {
  OpenAi: ['GPT 4o', 'GPT o3-mini', 'GPT 4.5', 'GPT 5'],
  Groq: ['Mixtral-8x7B', 'LLaMA-3-70B', 'Gemma-7B'],
  Gemini: ['Gemini 1.5 Flash', 'Gemini 1.5 Pro']
}

// Schema Zod
const configSchema = z.object({
  provider: z.enum(providers),
  model: z.string().min(1, 'Selecione um modelo'),
  name: z.string().min(1, 'Digite um nome'),
  apiKey: z.string().min(6, 'Api Key inválida')
})

type ConfigFormData = z.infer<typeof configSchema>

interface ModalConfigProps {
  onClose: () => void
  onSave: (data: ConfigFormData) => void
}

export const ModalConfig = ({ onClose, onSave }: ModalConfigProps) => {
  const [selectedProvider, setSelectedProvider] =
    useState<(typeof providers)[number]>('OpenAi')

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<ConfigFormData>({
    resolver: zodResolver(configSchema),
    defaultValues: {
      provider: 'OpenAi',
      model: modelsByProvider['OpenAi'][0],
      name: '',
      apiKey: ''
    }
  })

  const currentModels = modelsByProvider[selectedProvider]
  const selectedModel = watch('model')

  const handleProviderChange = (p: (typeof providers)[number]) => {
    setSelectedProvider(p)
    setValue('provider', p)
    setValue('model', modelsByProvider[p][0]) // reset model
  }

  const onSubmit = (data: ConfigFormData) => {
    onSave(data)
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

          {/* Providers */}
          <div className="flex items-center mt-[24px] gap-2">
            {providers.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => handleProviderChange(p)}
                className={`text-[14px] px-[32px] py-[12px] font-medium rounded-[18px] ${
                  selectedProvider === p
                    ? 'text-[#3730A3] bg-[#E0E7FF]'
                    : 'text-[#737373]'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Modelos */}
          <div className="flex flex-col gap-[4px] mt-[24px]">
            <div className="text-[16px] text-[#141414]">Modelos</div>
            <div className="text-[12px] text-[#141414]/50">
              Selecione o modelo de IA que você deseja
            </div>
          </div>

          <div className="flex flex-col gap-[12px] mt-[12px]">
            {currentModels.map((m) => (
              <div
                key={m}
                onClick={() => setValue('model', m)}
                className={`px-[12px] py-[12px] text-[14px] rounded-[8px] cursor-pointer ${
                  selectedModel === m
                    ? 'bg-[#004080BD] text-white'
                    : 'border border-[#E4E4E7] text-[#141414]/50 hover:bg-gray-100'
                }`}
              >
                {m}
              </div>
            ))}
            {errors.model && (
              <span className="text-red-500 text-xs">
                {errors.model.message}
              </span>
            )}
          </div>

          {/* Nome */}
          <div className="mt-[24px]">
            <label className="block text-[14px] mb-[12px] text-[#1E1E1E]">
              Nome
            </label>
            <div className="flex items-center border border-[#CACACA] rounded-[8px] bg-[#FAFAFA] px-[12px] py-[10px]">
              <MdAutoAwesome className="text-gray-400 mr-2" />
              <input
                type="text"
                {...register('name')}
                className="w-full outline-none text-[12px] bg-[#FAFAFA]"
                placeholder="Nome do agente"
              />
            </div>
            {errors.name && (
              <span className="text-red-500 text-xs">
                {errors.name.message}
              </span>
            )}
          </div>

          {/* Api Key */}
          <div className="mt-[24px]">
            <label className="block text-[14px] mb-[12px] text-[#1E1E1E]">
              Api Key
            </label>
            <div className="flex items-center border border-[#CACACA] rounded-[8px] bg-[#FAFAFA] px-[12px] py-[10px]">
              <MdKey className="text-gray-400 mr-2" />
              <input
                type="password"
                {...register('apiKey')}
                className="w-full outline-none text-[12px] bg-[#FAFAFA]"
                placeholder="*******"
              />
            </div>
            {errors.apiKey && (
              <span className="text-red-500 text-xs">
                {errors.apiKey.message}
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
              className="px-[24px] py-[12px] text-[14px] text-white bg-[#004080] rounded-[8px]"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
