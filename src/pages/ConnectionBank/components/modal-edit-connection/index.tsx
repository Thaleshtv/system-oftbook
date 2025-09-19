import { MdOutlineClose } from 'react-icons/md'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'

export interface ConnectionPayload {
  nome: string
  driver: string
  server: string
  database: string
  pwd: string
  db_schema: string
  tipo_banco: string
  catalogo: string
}

const connectionSchema = z.object({
  nome: z.string().min(1, 'Digite o nome'),
  driver: z.string().min(1, 'Digite o driver'),
  server: z.string().min(1, 'Digite o servidor'),
  database: z.string().min(1, 'Digite o database'),
  pwd: z.string().min(1, 'Digite a senha'),
  db_schema: z.string().min(1, 'Digite o schema'),
  tipo_banco: z.string().min(1, 'Digite o tipo de banco'),
  catalogo: z.string().min(1, 'Digite o catálogo')
})

type ConnectionFormData = z.infer<typeof connectionSchema>

interface ModalEditProps {
  data?: ConnectionPayload
  onClose: () => void
  onSave: (data: ConnectionFormData) => void
  loading?: boolean
  loadingSave?: boolean
}

export const ModalEdit = ({
  data,
  onClose,
  onSave,
  loading = false,
  loadingSave = false
}: ModalEditProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ConnectionFormData>({
    resolver: zodResolver(connectionSchema),
    defaultValues: data
  })

  useEffect(() => {
    if (data) {
      reset(data)
    }
  }, [data, reset])

  const onSubmit = (formData: ConnectionFormData) => {
    onSave(formData)
  }

  const inputs = [
    { label: 'Nome', key: 'nome', type: 'text' },
    { label: 'Driver', key: 'driver', type: 'text' },
    { label: 'Servidor', key: 'server', type: 'text' },
    { label: 'Database', key: 'database', type: 'text' },
    { label: 'Senha', key: 'pwd', type: 'password' },
    { label: 'Schema', key: 'db_schema', type: 'text' },
    { label: 'Tipo Banco', key: 'tipo_banco', type: 'text' },
    { label: 'Catálogo', key: 'catalogo', type: 'text' }
  ]

  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-[9999]">
      <div className="w-[900px] bg-white rounded-[18px] shadow-lg p-[32px] animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[24px] font-medium">Editar Conexão</h2>
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
                    {...register(input.key as keyof ConnectionFormData)}
                    className="border border-[#E4E4E7] bg-[#E6E6E6]/26 rounded-[8px] p-[12px] text-[#0A1B39]"
                  />
                  {errors[input.key as keyof ConnectionFormData] && (
                    <span className="text-red-500 text-sm">
                      {errors[input.key as keyof ConnectionFormData]?.message}
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
