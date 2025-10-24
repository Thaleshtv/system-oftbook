import { LuFile } from 'react-icons/lu'
import { IoLogOutOutline } from 'react-icons/io5'
import { useRouter } from '@tanstack/react-router'
import { useAuthStore } from '../../store/userStore'
import { Auth } from '../../services/auth'
import logoOfbook from '../../assets/logo-ofbook.png'

export default function Sidebar() {
  const router = useRouter()
  const { dispatch } = useAuthStore()

  const handleLogout = async () => {
    try {
      await Auth.logout()
      dispatch.logOut()
      router.navigate({ to: '/' })
    } catch (error) {
      dispatch.logOut()
      router.navigate({ to: '/' })
    }
  }

  const navLinks = [
    {
      name: 'Arquivos',
      icon: <LuFile size={20} />,
      active: true
    }
  ]

  return (
    <>
      {/* Sidebar - Hidden on mobile since there's only one page */}
      <aside
        className={`
        hidden md:flex
        h-screen w-[276px] flex-col bg-white border-r border-gray-200
      `}
      >
        {/* Header - simplified for desktop only */}
        <div className="flex items-center px-[36px] py-[11px] mt-[7px]">
          <div className="flex items-center space-x-3">
            <img src={logoOfbook} alt="Oftbook Logo" className="h-8 w-auto" />
          </div>
        </div>

        <nav className="flex-1 px-[18px] py-[16px]">
          <ul className="space-y-2">
            {navLinks.map((link) => (
              <li key={link.name}>
                <a
                  href="#"
                  className={`flex items-center py-[12px] px-[12px] font-regular rounded-lg transition-colors duration-200 relative ${
                    link.active
                      ? 'text-white '
                      : 'text-[#918F8F] hover:bg-gray-700 hover:text-white'
                  }`}
                  style={link.active ? { backgroundColor: '#0F0A49' } : {}}
                >
                  <span className="mr-3">{link.icon}</span>
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-3">
          <ul className="space-y-2">
            <li>
              <button
                onClick={handleLogout}
                className="flex items-center py-2 px-3 rounded-lg text-[#1E1E1E] hover:bg-[#0F0A49] hover:text-white transition-colors duration-200 w-full text-left"
              >
                <IoLogOutOutline size={20} className="mr-3" />
                Sair
              </button>
            </li>
          </ul>
        </div>
      </aside>
    </>
  )
}
