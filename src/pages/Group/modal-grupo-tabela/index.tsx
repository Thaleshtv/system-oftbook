import { MdOutlineClose } from 'react-icons/md'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { IConnection } from '../../../services/connections'
import { IAssociateTableToGroup } from '../../../services/group-tables'
import { ITableResponse } from '../../../services/tables'

const schema = z.object({
  table_id: z.number().min(1, 'Selecione a tabela'),
  connection_id: z.number().min(1, 'Selecione a conexão')
})

type FormData = z.infer<typeof schema>

interface ModalGrupoTabelaProps {
  onClose: () => void
  connections: IConnection[]
  tables: ITableResponse[]
  onChangeConnection: (connectionId: string) => void
  onSave: (data: Pick<IAssociateTableToGroup, 'tabela_id'>) => void
  loading?: boolean
  loadingSave?: boolean
}

export const ModalGrupoTabela = ({
  onClose,
  connections,
  tables,
  onChangeConnection,
  onSave,
  loading = false,
  loadingSave = false
}: ModalGrupoTabelaProps) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      table_id: 0,
      connection_id: 0
    }
  })

  const connectionId = watch('connection_id')

  useEffect(() => {
    if (connectionId) {
      onChangeConnection(String(connectionId))
      reset((prev) => ({ ...prev, table_id: 0 }))
    }
  }, [connectionId, onChangeConnection, reset])

  const onSubmit = (formData: FormData) => {
    onSave({ tabela_id: formData.table_id })
  }

  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-[9999]">
      <div className="w-[600px] bg-white rounded-[18px] shadow-lg p-[32px] animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[24px] font-medium">Associar Tabela ao Grupo</h2>
          <button
            type="button"
            className="text-[#000]/60 hover:text-[#000]/100"
            onClick={onClose}
          >
            <MdOutlineClose size={24} />
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col gap-4">
            <div className="h-4 bg-gray-300 rounded w-1/3 animate-pulse" />
            <div className="h-10 bg-gray-200 rounded animate-pulse" />
            <div className="h-10 bg-gray-200 rounded animate-pulse" />
          </div>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
            {/* Select Conexão */}
            <div className="flex flex-col gap-2">
              <label className="font-medium text-[14px] text-[#1E1E1E]">
                Conexão
              </label>
              <select
                {...register('connection_id', { valueAsNumber: true })}
                className="border border-[#E4E4E7] bg-[#E6E6E6]/26 rounded-[8px] p-[12px]"
              >
                <option value={0}>Selecione...</option>
                {connections.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nome}
                  </option>
                ))}
              </select>
              {errors.connection_id && (
                <span className="text-red-500 text-sm">
                  {errors.connection_id.message}
                </span>
              )}
            </div>

            {/* Select Tabela */}
            <div className="flex flex-col gap-2">
              <label className="font-medium text-[14px] text-[#1E1E1E]">
                Tabela
              </label>
              <select
                {...register('table_id', { valueAsNumber: true })}
                className="border border-[#E4E4E7] bg-[#E6E6E6]/26 rounded-[8px] p-[12px]"
                disabled={!connectionId}
              >
                <option value={0}>Selecione...</option>
                {tables.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.nome}
                  </option>
                ))}
              </select>
              {errors.table_id && (
                <span className="text-red-500 text-sm">
                  {errors.table_id.message}
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
                disabled={loadingSave}
                className="px-[24px] py-[12px] text-[14px] text-white bg-[#004080] rounded-[8px]"
              >
                {loadingSave ? 'Associando...' : 'Associar'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
