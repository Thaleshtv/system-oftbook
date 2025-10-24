import { ReactNode } from 'react'
import Sidebar from '../sidebar'

interface PageComponentProps {
  children: ReactNode
}

export function PageComponent({ children }: PageComponentProps) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />

      <div className="flex-1 overflow-y-auto bg-[#fff] flex flex-col">
        {/* Mobile header - simplified without hamburger menu */}
        <div className="md:hidden flex items-center justify-center p-4 border-b border-[#2D2D2D]">
          <h1 className="text-white text-lg font-medium">CompreEmCasa</h1>
        </div>

        {/* Main content */}
        <div className="flex-1 px-4 py-6 md:px-4 md:py-[36px]">
          <div className="container mx-auto">{children}</div>
        </div>
      </div>
    </div>
  )
}
