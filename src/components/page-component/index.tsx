import { ReactNode } from 'react'
import Sidebar from '../sidebar'
import { HiOutlineBell, HiOutlineChat } from 'react-icons/hi'

interface PageComponentProps {
  children: ReactNode
  title: string
}

export function PageComponent({ children, title }: PageComponentProps) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />

      <div className="flex-1 overflow-y-auto bg-[#fff] flex flex-col">
        {/* Mobile header - simplified without hamburger menu */}
        <div className="flex items-center justify-between py-[30px] px-[24px] border-b border-[#D9D9D9]">
          <div className="text-[24px] font-semibold">{title}</div>
          <div className="flex items-center gap-[28px]">
            <div className="flex items-center gap-[16px]">
              <button className="rounded-full hover:bg-gray-200">
                <HiOutlineChat size={20} color="#5C5E64" />
              </button>
              <button className="rounded-full hover:bg-gray-200">
                <HiOutlineBell size={20} color="#5C5E64" />
              </button>
            </div>
            <div className="flex gap-[10px] items-center">
              <div className="w-[40px] h-[40px] rounded-full bg-gray-200"></div>
              <div className="flex flex-col">
                <div className="text-[16px] text-[#5C5E64] font-medium">
                  Nome do Usuário
                </div>
                <div className="text-[12px] text-[#5C5E64] font-regular">
                  Cargo do Usuário
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 px-4 py-6 md:px-4 md:py-[36px]">
          <div className="container mx-auto">{children}</div>
        </div>
      </div>
    </div>
  )
}
