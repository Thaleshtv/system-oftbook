import React, { ReactNode } from 'react'
import { MdArrowBackIos } from 'react-icons/md'

interface TableProps {
  headers: string[]
  children: ReactNode
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
  const rows = React.Children.toArray(children)
  const hasData = rows.length > 0

  return (
    <div className="w-full">
      <table className="w-full border border-[#E4E4E7] rounded-[8px] border-separate border-spacing-0">
        <thead>
          <tr>
            {headers.map((col, idx) => (
              <th
                key={col}
                className={`px-4 py-2.5 text-[14px] font-medium border-b border-[#E4E4E7] text-[#004080] ${
                  idx === headers.length - 1 ? 'text-right' : 'text-left'
                }`}
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {hasData ? (
            children
          ) : (
            <tr>
              <td
                colSpan={headers.length}
                className="px-4 py-2.5 text-center font-light text-[#71717A]"
              >
                Nenhum item encontrado
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {hasData && (
        <div className="flex items-center justify-between mt-4 text-[14px] text-[#0A1B39]">
          <span className="text-[#71717A]">
            {rows.length} de {rows.length} linhas nesta página
          </span>

          <div className="flex items-center gap-3">
            <button
              onClick={onPrevPage}
              disabled={currentPage === 1}
              className="p-[10px] border border-[#D9D9D9] rounded-[8px] hover:bg-gray-200 transition flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <MdArrowBackIos size={10} />
            </button>

            <span>
              Página {currentPage} de {totalPages}
            </span>

            <button
              onClick={onNextPage}
              disabled={currentPage === totalPages}
              className="p-[10px] border border-[#D9D9D9] rounded-[8px] bg-[#004080] hover:bg-gray-200 transition flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <MdArrowBackIos size={10} className="rotate-180" color="#fff" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
