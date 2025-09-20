import { MdOutlineClose } from 'react-icons/md'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'

export interface ITableResponse {
  id: number
  nome: string
  descricao: string
  qtd_colunas: number
  conexao_id: number
}

const tableSchema = z.object({
  nome: z.string().min(1, 'Digite o nome'),
  descricao: z.string().min(1, 'Digite a descrição'),
  qtd_colunas: z.number({ invalid_type_error: 'Digite um número válido' }),
  conexao_id: z
    .number({ invalid_type_error: 'Digite um número válido' })
    .min(1, 'Digite o ID da conexão')
})

type TableFormData = z.infer<typeof tableSchema>

interface ModalEditTableProps {
  data?: ITableResponse
  onClose: () => void
  onSave: (data: TableFormData) => void
  loading?: boolean
  loadingSave?: boolean
}

export const ModalEditTable = ({
  data,
  onClose,
  onSave,
  loading = false,
  loadingSave = false
}: ModalEditTableProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<TableFormData>({
    resolver: zodResolver(tableSchema),
    defaultValues: data
      ? {
          nome: data.nome,
          descricao: data.descricao,
          qtd_colunas: data.qtd_colunas,
          conexao_id: data.conexao_id
        }
      : undefined
  })

  useEffect(() => {
    if (data) {
      reset({
        nome: data.nome,
        descricao: data.descricao,
        qtd_colunas: data.qtd_colunas,
        conexao_id: data.conexao_id
      })
    }
  }, [data, reset])

  const onSubmit = (formData: TableFormData) => {
    onSave(formData)
  }

  const inputs = [
    { label: 'Nome', key: 'nome', type: 'text' },
    { label: 'Descrição', key: 'descricao', type: 'text' },
    { label: 'Qtd. Colunas', key: 'qtd_colunas', type: 'number' },
    { label: 'Conexão ID', key: 'conexao_id', type: 'number' }
  ]

  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-[9999]">
      <div className="w-[700px] bg-white rounded-[18px] shadow-lg p-[32px] animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[24px] font-medium">Editar Tabela</h2>
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
          <div className="grid grid-cols-2 gap-6">
            {inputs.map((input) => (
              <div key={input.key} className="flex flex-col gap-2">
                <div className="h-4 bg-gray-300 rounded w-1/3 animate-pulse" />
                <div className="h-10 bg-gray-200 rounded animate-pulse" />
              </div>
            ))}
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-2 gap-6">
              {inputs.map((input) => (
                <div key={input.key} className="flex flex-col gap-2">
                  <label
                    htmlFor={input.key}
                    className="font-medium text-[14px] text-[#1E1E1E]"
                  >
                    {input.label}
                  </label>
                  <input
                    id={input.key}
                    type={input.type}
                    {...register(input.key as keyof TableFormData, {
                      valueAsNumber: input.type === 'number'
                    })}
                    className="border border-[#E4E4E7] bg-[#E6E6E6]/26 rounded-[8px] p-[12px] text-[#0A1B39]"
                  />
                  {errors[input.key as keyof TableFormData] && (
                    <span className="text-red-500 text-sm">
                      {errors[input.key as keyof TableFormData]?.message}
                    </span>
                  )}
                </div>
              ))}
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
