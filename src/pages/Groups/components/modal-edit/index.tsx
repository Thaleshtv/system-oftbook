import { MdOutlineClose } from 'react-icons/md'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { IGroupPayload } from '../../../../services/groups'

const groupSchema = z.object({
  nome: z.string().min(1, 'Digite o nome'),
  ativa: z.boolean()
})

type GroupFormData = z.infer<typeof groupSchema>

interface ModalEditGroupProps {
  data?: IGroupPayload
  onClose: () => void
  onSave: (data: IGroupPayload) => void
  loading?: boolean
  loadingSave?: boolean
}

export const ModalEditGroup = ({
  data,
  onClose,
  onSave,
  loading = false,
  loadingSave = false
}: ModalEditGroupProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<GroupFormData>({
    resolver: zodResolver(groupSchema),
    defaultValues: data
      ? {
          nome: data.nome,
          ativa: data.ativa
        }
      : undefined
  })

  useEffect(() => {
    if (data) {
      reset({
        nome: data.nome,
        ativa: data.ativa
      })
    }
  }, [data, reset])

  const onSubmit = (formData: GroupFormData) => {
    if (!data) return
    const payload: IGroupPayload = {
      ...data, // mantém qtd_tabelas e qtd_usuarios originais
      nome: formData.nome,
      ativa: formData.ativa
    }
    onSave(payload)
  }

  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-[9999]">
      <div className="w-[500px] bg-white rounded-[18px] shadow-lg p-[32px] animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[24px] font-medium">Editar Grupo</h2>
          <button
            type="button"
            className="text-[#000]/60 hover:text-[#000]/100"
            onClick={onClose}
          >
            <MdOutlineClose size={24} />
          </button>
        </div>

        {/* Conteúdo */}
        {loading ? (
          <div className="grid gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex flex-col gap-2">
                <div className="h-4 bg-gray-300 rounded w-1/3 animate-pulse" />
                <div className="h-10 bg-gray-200 rounded animate-pulse" />
              </div>
            ))}
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-4 gap-6">
              {/* Linha 1: Nome e Status */}
              <div className="flex flex-col gap-2 col-span-3">
                <label
                  htmlFor="nome"
                  className="font-medium text-[14px] text-[#1E1E1E]"
                >
                  Nome
                </label>
                <input
                  id="nome"
                  type="text"
                  {...register('nome')}
                  className="border border-[#E4E4E7] bg-[#E6E6E6]/26 rounded-[8px] p-[12px] text-[#0A1B39]"
                />
                {errors.nome && (
                  <span className="text-red-500 text-sm">
                    {errors.nome.message}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-2 col-span-1">
                <label
                  htmlFor="ativa"
                  className="font-medium text-[14px] text-[#1E1E1E]"
                >
                  Status
                </label>
                <select
                  id="ativa"
                  {...register('ativa', { setValueAs: (v) => v === 'true' })}
                  className="border border-[#E4E4E7] bg-[#E6E6E6]/26 rounded-[8px] p-[12px] text-[#0A1B39]"
                >
                  <option value="true">Ativo</option>
                  <option value="false">Inativo</option>
                </select>
              </div>

              {/* Linha 2: Qtd Tabelas e Qtd Usuários */}
              <div className="flex flex-col gap-2 col-span-2">
                <label className="font-medium text-[14px] text-[#1E1E1E]">
                  Quantidade de Tabelas
                </label>
                <input
                  type="number"
                  value={data?.qtd_tabelas ?? 0}
                  disabled
                  className="border border-[#E4E4E7] bg-gray-100 rounded-[8px] p-[12px] text-[#0A1B39]"
                />
              </div>

              <div className="flex flex-col gap-2 col-span-2">
                <label className="font-medium text-[14px] text-[#1E1E1E]">
                  Quantidade de Usuários
                </label>
                <input
                  type="number"
                  value={data?.qtd_usuarios ?? 0}
                  disabled
                  className="border border-[#E4E4E7] bg-gray-100 rounded-[8px] p-[12px] text-[#0A1B39]"
                />
              </div>
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
                disabled={loadingSave}
                className="px-[24px] py-[12px] text-[14px] text-white bg-[#004080] rounded-[8px]"
              >
                {loadingSave ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
