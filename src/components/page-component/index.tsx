import {
  MdOutlineDashboard,
  MdOutlineListAlt,
  MdOutlineSettings,
  MdOutlineArrowDropDown,
  MdOutlineChat,
  MdOutlineLogout
} from 'react-icons/md'
import { Link, useRouterState } from '@tanstack/react-router'
import { ReactNode, ReactElement } from 'react'
import Altona from '../../assets/altona.svg'

interface PageComponentProps {
  children: ReactNode
  topbarTitle: string
  topbarIcon: ReactElement
}

export const PageComponent = ({
  children,
  topbarTitle,
  topbarIcon
}: PageComponentProps) => {
  const { location } = useRouterState()

  const isConfigPath = location.pathname.startsWith('/configuracoes')
  const activeSub = location.pathname
  console.log(isConfigPath)

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
            <div className="flex flex-col">
              <span className="font-bold text-[#0A1B39]">Thales Hipólito</span>
              <span className="text-sm text-[#83899F]">Desenvolvedor</span>
            </div>
          </div>

          {/* Menu */}
          <ul className="flex flex-col gap-3">
            <li>
              <Link
                to="/inicial-page"
                className={`px-[16px] py-[12px] flex items-center gap-[10px] rounded-[18px] cursor-pointer text-[14px] ${
                  location.pathname === '/'
                    ? 'bg-gray-200 text-[#004080]'
                    : 'hover:bg-gray-200 text-[#0A1B39]'
                }`}
              >
                <MdOutlineDashboard size={20} />
                Dashboard
              </Link>
            </li>

            <li>
              <Link
                to="/inicial-page"
                className={`px-[16px] py-[12px] flex items-center gap-[10px] rounded-[18px] cursor-pointer text-[14px] ${
                  location.pathname.startsWith('/relatorios')
                    ? 'bg-gray-200 text-[#004080]'
                    : 'hover:bg-gray-200 text-[#0A1B39]'
                }`}
              >
                <MdOutlineListAlt size={20} />
                Relatórios
              </Link>
            </li>

            {/* Configurações */}
            <li className="flex flex-col">
              <div
                className={`px-[16px] py-[12px] flex items-center gap-[10px] rounded-[18px] cursor-pointer text-[14px] ${
                  isConfigPath
                    ? 'bg-gray-200 text-[#004080] border border-[#D9D9D9]'
                    : 'hover:bg-gray-200 text-[#0A1B39] border border-[#D9D9D9]'
                }`}
              >
                <MdOutlineSettings size={20} />
                Configurações
                <MdOutlineArrowDropDown
                  size={20}
                  className={`ml-auto transition-transform ${
                    isConfigPath ? 'rotate-180' : 'rotate-0'
                  }`}
                />
              </div>

              {isConfigPath && (
                <ul className="ml-[24px] mt-[16px] flex flex-col gap-[16px] relative text-[14px]">
                  <li className="flex items-center gap-3 relative">
                    <span
                      className={`w-2 h-2 rounded-full relative z-10 ${
                        activeSub.startsWith('/configuracoes/conexao-banco')
                          ? 'bg-[#004080]'
                          : 'bg-[#D8DBE4]'
                      }`}
                    />
                    <Link
                      to="/configuracoes/conexao-banco"
                      className={`cursor-pointer ${
                        activeSub.startsWith('/configuracoes/conexao-banco')
                          ? 'text-[#004080] font-medium'
                          : 'text-[#83899F] hover:underline'
                      }`}
                    >
                      Conexão com o banco
                    </Link>
                    <span className="absolute left-[3px] top-2 bottom-[-16px] w-[1px] bg-[#D9D9D9]" />
                  </li>

                  <li className="flex items-center gap-3 relative">
                    <span
                      className={`w-2 h-2 rounded-full relative z-10 ${
                        activeSub === '/configuracoes/grupos'
                          ? 'bg-[#004080]'
                          : 'bg-[#D8DBE4]'
                      }`}
                    />
                    <Link
                      to="/inicial-page"
                      className={`cursor-pointer ${
                        activeSub === '/configuracoes/grupos'
                          ? 'text-[#004080] font-medium'
                          : 'text-[#83899F] hover:underline'
                      }`}
                    >
                      Grupos
                    </Link>
                    <span className="absolute left-[3px] top-2 bottom-[-16px] w-[1px] bg-[#D9D9D9]" />
                  </li>

                  <li className="flex items-center gap-3 relative">
                    <span
                      className={`w-2 h-2 rounded-full relative z-10 ${
                        activeSub === '/configuracoes/agentes'
                          ? 'bg-[#004080]'
                          : 'bg-[#D8DBE4]'
                      }`}
                    />
                    <Link
                      to="/inicial-page"
                      className={`cursor-pointer ${
                        activeSub === '/configuracoes/agentes'
                          ? 'text-[#004080] font-medium'
                          : 'text-[#83899F] hover:underline'
                      }`}
                    >
                      Agentes
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            <li>
              <Link
                to="/redefinir"
                className={`px-[16px] py-[12px] flex items-center gap-[10px] rounded-[18px] cursor-pointer text-[14px] ${
                  location.pathname.startsWith('/chat')
                    ? 'bg-gray-200 text-[#004080]'
                    : 'hover:bg-gray-200 text-[#0A1B39]'
                }`}
              >
                <MdOutlineChat size={20} />
                Chat
              </Link>
            </li>
          </ul>
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
