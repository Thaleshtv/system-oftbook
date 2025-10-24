import { MdOutlineFolder, MdOutlineLogout } from 'react-icons/md'
import { useRouterState } from '@tanstack/react-router'
import { ReactNode, ReactElement } from 'react'
import Logo from '../../assets/logo-ofbook.png'
import { useAuthStore } from '../../store/userStore'
import { isAllowed, defaultAcl } from '../../routes/acl'

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
  const { state } = useAuthStore()

  // Função para extrair apenas o primeiro nome
  const getFirstName = (fullName?: string) => {
    if (!fullName) return ''
    return fullName.split(' ')[0]
  }

  // Função para lidar com o logout
  const handleLogout = () => {
    const token = state.token
    if (token) {
      window.location.href = `https://hub.altona.com.br/Investimentos_18Producao/hubCallback.aspx?${token}`
    }
  }

  const isArquivoPath = location.pathname.startsWith('/arquivo')

  const checkPermission = (path: string, customAcl?: any) => {
    return isAllowed({
      path,
      acl: customAcl || defaultAcl,
      systemRole: state.user?.role || 'usuario'
    })
  }

  const menuPermissions = {
    arquivo: checkPermission('/arquivo', {
      ...defaultAcl
    })
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

          {/* Menu */}
          <ul className="flex flex-col gap-3">
            {/* Arquivo */}
            {menuPermissions.arquivo && (
              <li>
                <div
                  className={`px-[16px] py-[12px] flex items-center gap-[10px] rounded-[18px] cursor-pointer text-[14px] ${
                    isArquivoPath
                      ? 'bg-gray-200 text-[#004080] border border-[#D9D9D9]'
                      : 'hover:bg-gray-200 text-[#0A1B39] border border-[#D9D9D9]'
                  }`}
                >
                  <MdOutlineFolder size={20} />
                  Arquivo
                </div>
              </li>
            )}
          </ul>
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
        <div className="flex items-center gap-3 text-[#1D1D1D]">
          {topbarIcon}
          <span className="text-[24px] font-medium">{topbarTitle}</span>
        </div>
        <img src={Logo} alt="Oftbook" />
      </div>

      {/* Conteúdo */}
      <main className="flex-1 ml-[276px] mt-[88px] h-[calc(100vh-88px)] overflow-y-auto bg-white p-6">
        {children}
      </main>
    </div>
  )
}
