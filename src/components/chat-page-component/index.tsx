import {
  MdOutlineFolder,
  MdOutlineChat,
  MdOutlineAdd,
  MdOutlineLogout,
  MdDelete,
  MdArrowBackIosNew
} from 'react-icons/md'

import { ReactNode, ReactElement } from 'react'
import Altona from '../../assets/altona.svg'
import { ISessaoResponse } from '../../services/sessoes'
import { SessionListSkeleton } from '../ui/skeleton'
import { useAuthStore } from '../../store/userStore'

interface ChatPageComponentProps {
  children: ReactNode
  topbarTitle: string
  topbarIcon: ReactElement
  sessoes?: ISessaoResponse[]
  pastas?: string[]
  currentSessao?: ISessaoResponse | null
  onSelectSessao?: (sessaoId: string) => void
  onCreateNewSessao?: () => void
  onDeleteSessao?: (sessaoId: string) => void
  onCreateNewPasta?: () => void
  onBack?: () => void
  isLoadingInitialData?: boolean
}

export const ChatPageComponent = ({
  children,
  topbarTitle,
  topbarIcon,
  sessoes = [],
  pastas = [],
  currentSessao,
  onSelectSessao,
  onCreateNewSessao,
  onDeleteSessao,
  onCreateNewPasta,
  onBack,
  isLoadingInitialData = false
}: ChatPageComponentProps) => {
  const { state } = useAuthStore()

  // Função para extrair apenas o primeiro nome
  const getFirstName = (fullName?: string) => {
    if (!fullName) return ''
    return fullName.split(' ')[0]
  }

  const handleLogout = () => {
    const token = state.token
    if (token) {
      window.location.href = `https://hub.altona.com.br/Investimentos_18Producao/hubCallback.aspx?${token}`
    }
  }

  return (
    <div className="flex w-full h-screen">
      {/* Sidebar fixo */}
      <div className="w-[276px] h-screen border-r border-[#D9D9D9] pt-[33px] px-[18px] flex flex-col justify-between fixed left-0 top-0">
        <div>
          {/* Perfil */}
          <div className="flex px-[16px] py-[16px] rounded-[16px] border border-[#D9D9D9] items-center gap-[16px] mb-6">
            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white text-lg">
              A
            </div>
            <div className="flex flex-col leading-[1]">
              <span className="font-bold text-[#0A1B39]">
                {getFirstName(state.user?.name)}
              </span>
              <span className="text-sm text-[#83899F]">{state.user?.role}</span>
            </div>
          </div>

          {/* Menu do Chat */}
          <div className="flex flex-col gap-6">
            {/* Pastas */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[14px] font-medium text-[#0A1B39]">
                  Pastas
                </h3>
                <button
                  onClick={onCreateNewPasta}
                  className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-gray-200 text-[#83899F]"
                >
                  <MdOutlineAdd size={16} />
                </button>
              </div>
              <ul className="flex flex-col gap-2">
                {pastas.length > 0 ? (
                  pastas.map((pasta, index) => (
                    <li key={index}>
                      <div className="px-[16px] py-[8px] flex items-center gap-[10px] rounded-[12px] cursor-pointer text-[14px] hover:bg-gray-100 text-[#83899F]">
                        <MdOutlineFolder size={18} />
                        {pasta}
                      </div>
                    </li>
                  ))
                ) : (
                  <li>
                    <div className="px-[16px] py-[8px] text-[12px] text-[#83899F] italic">
                      Nenhuma pasta encontrada
                    </div>
                  </li>
                )}
              </ul>
            </div>

            {/* Chats Ativos */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[14px] font-medium text-[#0A1B39]">
                  Chats
                </h3>
                <button
                  onClick={onCreateNewSessao}
                  className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-gray-200 text-[#83899F]"
                >
                  <MdOutlineAdd size={16} />
                </button>
              </div>
              <ul className="flex flex-col gap-2 max-h-48 overflow-y-auto">
                {isLoadingInitialData ? (
                  <SessionListSkeleton count={3} />
                ) : sessoes.filter((s) => !s.arquivada).length > 0 ? (
                  sessoes
                    .filter((s) => !s.arquivada)
                    .map((sessao) => (
                      <li key={sessao.id}>
                        <div className="group relative">
                          <div
                            onClick={() => onSelectSessao?.(sessao.id)}
                            className={`px-[16px] py-[8px] flex items-center gap-[10px] rounded-[12px] cursor-pointer text-[14px] ${
                              currentSessao?.id === sessao.id
                                ? 'bg-gray-200 text-[#004080]'
                                : 'hover:bg-gray-100 text-[#83899F]'
                            }`}
                          >
                            <MdOutlineChat size={18} />
                            <span className="flex-1 truncate">
                              {sessao.nome}
                            </span>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              onDeleteSessao?.(sessao.id)
                            }}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-600 rounded transition-all"
                            title="Deletar sessão"
                          >
                            <MdDelete size={12} />
                          </button>
                        </div>
                      </li>
                    ))
                ) : (
                  <li>
                    <div className="px-[16px] py-[8px] text-[12px] text-[#83899F] italic">
                      Nenhum chat ativo
                    </div>
                  </li>
                )}
              </ul>
            </div>


          </div>
        </div>

        {/* Sair */}
        <div className="mt-6">
          <div
            onClick={handleLogout}
            className="px-[16px] py-[12px] flex items-center gap-[10px] rounded-[18px] hover:bg-red-100 cursor-pointer text-[14px] text-[#676E85] font-medium"
          >
            <MdOutlineLogout size={20} />
            Sair
          </div>
        </div>
      </div>

      {/* Topbar */}
      <div className="fixed left-[276px] top-0 right-0 h-[88px] border-b border-[#D9D9D9] bg-white flex items-center justify-between px-6 z-20">
        <div className="flex flex-col text-[#1D1D1D]">
          <div className="flex items-center gap-3">
            {topbarIcon}
            <span className="text-[24px] font-medium">{topbarTitle}</span>
          </div>
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center gap-1 cursor-pointer text-[13px] font-medium text-[#121623] mt-1"
            >
              <MdArrowBackIosNew size={9} />
              Voltar
            </button>
          )}
        </div>
        <img src={Altona} alt="Altona" />
      </div>

      {/* Conteúdo */}
      <main className="flex-1 ml-[276px] mt-[88px] h-[calc(100vh-88px)] overflow-y-auto bg-white p-6">
        {children}
      </main>
    </div>
  )
}
