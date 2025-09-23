import {
  MdOutlineFolder,
  MdOutlineChat,
  MdOutlineHistory,
  MdOutlineAdd,
  MdOutlineLogout
} from 'react-icons/md'
import { useRouterState } from '@tanstack/react-router'
import { ReactNode, ReactElement } from 'react'
import Altona from '../../assets/altona.svg'

interface ChatPageComponentProps {
  children: ReactNode
  topbarTitle: string
  topbarIcon: ReactElement
}

export const ChatPageComponent = ({
  children,
  topbarTitle,
  topbarIcon
}: ChatPageComponentProps) => {
  const { location } = useRouterState()

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
              <span className="font-bold text-[#0A1B39]">Thales Hipólito</span>
              <span className="text-sm text-[#83899F]">Desenvolvedor</span>
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
                <button className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-gray-200 text-[#83899F]">
                  <MdOutlineAdd size={16} />
                </button>
              </div>
              <ul className="flex flex-col gap-2">
                <li>
                  <div className="px-[16px] py-[8px] flex items-center gap-[10px] rounded-[12px] cursor-pointer text-[14px] hover:bg-gray-100 text-[#83899F]">
                    <MdOutlineFolder size={18} />
                    Trabalho
                  </div>
                </li>
                <li>
                  <div className="px-[16px] py-[8px] flex items-center gap-[10px] rounded-[12px] cursor-pointer text-[14px] hover:bg-gray-100 text-[#83899F]">
                    <MdOutlineFolder size={18} />
                    Pessoal
                  </div>
                </li>
                <li>
                  <div className="px-[16px] py-[8px] flex items-center gap-[10px] rounded-[12px] cursor-pointer text-[14px] hover:bg-gray-100 text-[#83899F]">
                    <MdOutlineFolder size={18} />
                    Projetos
                  </div>
                </li>
              </ul>
            </div>

            {/* Chats */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[14px] font-medium text-[#0A1B39]">
                  Chats
                </h3>
                <button className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-gray-200 text-[#83899F]">
                  <MdOutlineAdd size={16} />
                </button>
              </div>
              <ul className="flex flex-col gap-2">
                <li>
                  <div
                    className={`px-[16px] py-[8px] flex items-center gap-[10px] rounded-[12px] cursor-pointer text-[14px] ${
                      location.pathname === '/chat/1'
                        ? 'bg-gray-200 text-[#004080]'
                        : 'hover:bg-gray-100 text-[#83899F]'
                    }`}
                  >
                    <MdOutlineChat size={18} />
                    Chat sobre React
                  </div>
                </li>
                <li>
                  <div
                    className={`px-[16px] py-[8px] flex items-center gap-[10px] rounded-[12px] cursor-pointer text-[14px] ${
                      location.pathname === '/chat/2'
                        ? 'bg-gray-200 text-[#004080]'
                        : 'hover:bg-gray-100 text-[#83899F]'
                    }`}
                  >
                    <MdOutlineChat size={18} />
                    Dúvidas TypeScript
                  </div>
                </li>
                <li>
                  <div
                    className={`px-[16px] py-[8px] flex items-center gap-[10px] rounded-[12px] cursor-pointer text-[14px] ${
                      location.pathname === '/chat/3'
                        ? 'bg-gray-200 text-[#004080]'
                        : 'hover:bg-gray-100 text-[#83899F]'
                    }`}
                  >
                    <MdOutlineChat size={18} />
                    Arquitetura Sistema
                  </div>
                </li>
              </ul>
            </div>

            {/* Chats Recentes */}
            <div>
              <div className="flex items-center mb-3">
                <h3 className="text-[14px] font-medium text-[#0A1B39]">
                  Chats Recentes
                </h3>
              </div>
              <ul className="flex flex-col gap-2">
                <li>
                  <div className="px-[16px] py-[8px] flex items-center gap-[10px] rounded-[12px] cursor-pointer text-[14px] hover:bg-gray-100 text-[#83899F]">
                    <MdOutlineHistory size={18} />
                    Configuração Docker
                  </div>
                </li>
                <li>
                  <div className="px-[16px] py-[8px] flex items-center gap-[10px] rounded-[12px] cursor-pointer text-[14px] hover:bg-gray-100 text-[#83899F]">
                    <MdOutlineHistory size={18} />
                    API REST Tutorial
                  </div>
                </li>
                <li>
                  <div className="px-[16px] py-[8px] flex items-center gap-[10px] rounded-[12px] cursor-pointer text-[14px] hover:bg-gray-100 text-[#83899F]">
                    <MdOutlineHistory size={18} />
                    Git Commands
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Sair */}
        <div className="mt-6">
          <div className="px-[16px] py-[12px] flex items-center gap-[10px] rounded-[18px] hover:bg-red-100 cursor-pointer text-[14px] text-[#676E85] font-medium">
            <MdOutlineLogout size={20} />
            Sair
          </div>
        </div>
      </div>

      {/* Topbar */}
      <div className="fixed left-[276px] top-0 right-0 h-[88px] border-b border-[#D9D9D9] bg-white flex items-center justify-between px-6 z-20">
        <div className="flex items-center gap-3 text-[#1D1D1D]">
          {topbarIcon}
          <span className="text-[24px] font-medium">{topbarTitle}</span>
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
