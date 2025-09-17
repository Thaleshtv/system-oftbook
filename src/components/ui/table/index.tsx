import React, { ReactNode } from 'react'
import { MdArrowBackIos } from 'react-icons/md'

interface TableProps {
  headers: string[]
  children: ReactNode // As linhas <tr>
  currentPage?: number
  totalPages?: number
  onPrevPage?: () => void
  onNextPage?: () => void
}

export const Table: React.FC<TableProps> = ({
  headers,
  children,
  currentPage = 1,
  totalPages = 1,
  onPrevPage,
  onNextPage
}) => {
  const childrenArray = React.Children.toArray(children)
  const rowsCount = childrenArray.length

  return (
    <div className="w-full">
      <table className="w-full border border-[#E4E4E7] rounded-[8px] border-separate border-spacing-0">
        <thead>
          <tr>
            {headers.map((col) => (
              <th
                key={col}
                className="px-4 py-2.5 text-[#004080] font-medium text-[14px] text-left border-b border-[#E4E4E7]"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>

      <div className="flex items-center justify-between mt-4 text-[#0A1B39] text-[14px]">
        <div className="text-[14px] font-regular text-[#71717A]">
          {rowsCount} de {rowsCount} linhas nesta página
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onPrevPage}
            className="p-[10px] border border-[#D9D9D9] rounded-[8px] hover:bg-gray-200 transition flex items-center justify-center"
          >
            <MdArrowBackIos size={10} />
          </button>
          <div>
            Página {currentPage} de {totalPages}
          </div>
          <button
            onClick={onNextPage}
            className="p-[10px] border border-[#D9D9D9] rounded-[8px] bg-[#004080] hover:bg-gray-200 transition flex items-center justify-center"
          >
            <MdArrowBackIos size={10} className="rotate-180" color="#fff" />
          </button>
        </div>
      </div>
    </div>
  )
}
