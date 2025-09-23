import { MdOutlineClose } from 'react-icons/md'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { IAssociateUserToGroup } from '../../../services/group-user'

const schema = z.object({
  usuario_id: z.string().min(1, 'Digite o ID do usuário')
})

type FormData = z.infer<typeof schema>

interface ModalGrupoUsuarioProps {
  onClose: () => void
  onSave: (data: Pick<IAssociateUserToGroup, 'usuario_id'>) => void
  loading?: boolean
  loadingSave?: boolean
}

export const ModalGrupoUsuario = ({
  onClose,
  onSave,
  loading = false,
  loadingSave = false
}: ModalGrupoUsuarioProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      usuario_id: ''
    }
  })

  const onSubmit = (formData: FormData) => {
    onSave({ usuario_id: formData.usuario_id })
  }

  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-[9999]">
      <div className="w-[600px] bg-white rounded-[18px] shadow-lg p-[32px] animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[24px] font-medium">Associar Usuário ao Grupo</h2>
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
          </div>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
            {/* Input ID do Usuário */}
            <div className="flex flex-col gap-2">
              <label className="font-medium text-[14px] text-[#1E1E1E]">
                ID do Usuário
              </label>
              <input
                {...register('usuario_id')}
                type="text"
                placeholder="Digite o ID do usuário"
                className="border border-[#E4E4E7] bg-[#E6E6E6]/26 rounded-[8px] p-[12px] focus:outline-none focus:ring-2 focus:ring-[#004080] focus:border-transparent"
              />
              {errors.usuario_id && (
                <span className="text-red-500 text-sm">
                  {errors.usuario_id.message}
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
                className="px-[24px] py-[12px] text-[14px] text-white bg-[#004080] rounded-[8px] disabled:opacity-50"
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
