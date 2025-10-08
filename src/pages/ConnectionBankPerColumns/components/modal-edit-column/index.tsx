import { MdOutlineClose } from 'react-icons/md'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { IColumnResponse, IColumnPayload } from '../../../../services/columns'

const columnSchema = z.object({
  descricao: z.string().min(1, 'Digite a descrição')
})

type ColumnFormData = z.infer<typeof columnSchema>

interface ModalEditColumnProps {
  data?: IColumnResponse
  onClose: () => void
  onSave: (data: IColumnPayload) => void
  loading?: boolean
  loadingSave?: boolean
}

export const ModalEditColumn = ({
  data,
  onClose,
  onSave,
  loading = false,
  loadingSave = false
}: ModalEditColumnProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ColumnFormData>({
    resolver: zodResolver(columnSchema),
    defaultValues: data
      ? {
          descricao: data.descricao
        }
      : undefined
  })

  useEffect(() => {
    if (data) {
      reset({
        descricao: data.descricao
      })
    }
  }, [data, reset])

  const onSubmit = (formData: ColumnFormData) => {
    if (!data) return
    const payload: IColumnPayload = {
      nome: data.nome, // mantém o nome original
      descricao: formData.descricao,
      tipo: data.tipo, // mantém o tipo original
      tabela_id: data.tabela_id // mantém a tabela_id original
    }
    onSave(payload)
  }

  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-[9999]">
      <div className="w-[500px] bg-white rounded-[18px] shadow-lg p-[32px] animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[24px] font-medium">Editar Coluna</h2>
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
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex flex-col gap-2">
                <div className="h-4 bg-gray-300 rounded w-1/3 animate-pulse" />
                <div className="h-10 bg-gray-200 rounded animate-pulse" />
              </div>
            ))}
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-6">
              {/* Nome (somente leitura) */}
              <div className="flex flex-col gap-2">
                <label className="font-medium text-[14px] text-[#1E1E1E]">
                  Nome da Coluna
                </label>
                <input
                  type="text"
                  value={data?.nome ?? ''}
                  disabled
                  className="border border-[#E4E4E7] bg-gray-100 rounded-[8px] p-[12px] text-[#0A1B39]"
                />
              </div>

              {/* Tipo (somente leitura) */}
              <div className="flex flex-col gap-2">
                <label className="font-medium text-[14px] text-[#1E1E1E]">
                  Tipo da Coluna
                </label>
                <input
                  type="text"
                  value={data?.tipo ?? ''}
                  disabled
                  className="border border-[#E4E4E7] bg-gray-100 rounded-[8px] p-[12px] text-[#0A1B39]"
                />
              </div>

              {/* Descrição (editável) */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="descricao"
                  className="font-medium text-[14px] text-[#1E1E1E]"
                >
                  Descrição
                </label>
                <textarea
                  id="descricao"
                  {...register('descricao')}
                  rows={4}
                  className="border border-[#E4E4E7] bg-[#E6E6E6]/26 rounded-[8px] p-[12px] text-[#0A1B39] resize-none"
                  placeholder="Digite a descrição da coluna..."
                />
                {errors.descricao && (
                  <span className="text-red-500 text-sm">
                    {errors.descricao.message}
                  </span>
                )}
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
                className="px-[24px] py-[12px] text-[14px] text-white bg-[#004080] rounded-[8px] hover:bg-[#003366] disabled:opacity-50"
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
