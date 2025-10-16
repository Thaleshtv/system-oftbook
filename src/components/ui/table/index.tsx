import React, { ReactNode, useState, useMemo } from 'react'
import {
  MdArrowBackIos,
  MdSearch,
  MdKeyboardArrowUp,
  MdKeyboardArrowDown
} from 'react-icons/md'

interface SortableHeader {
  label: string
  sortKey?: string
}

interface TableProps {
  headers: (string | SortableHeader)[]
  children: ReactNode
  // Frontend pagination props
  data?: any[]
  itemsPerPage?: number
  itemsPerPageOptions?: number[]
  renderRow?: (item: any, index: number) => ReactNode
  // Legacy props for external pagination (optional)
  currentPage?: number
  totalPages?: number
  onPrevPage?: () => void
  onNextPage?: () => void
  searchable?: boolean
  searchPlaceholder?: string
  onSearch?: (searchTerm: string) => void
  columnWidths?: string[]
  // Search filtering
  searchFields?: string[]
  // Sorting props
  sortField?: string | null
  sortDirection?: 'asc' | 'desc'
  onSort?: (field: any) => void
}

export const Table: React.FC<TableProps> = ({
  headers,
  children,
  // Frontend pagination props
  data,
  itemsPerPage = 10,
  itemsPerPageOptions = [5, 10, 25, 50],
  renderRow,
  // Legacy props for external pagination (optional)
  currentPage: externalCurrentPage,
  totalPages: externalTotalPages,
  onPrevPage: externalOnPrevPage,
  onNextPage: externalOnNextPage,
  searchable = false,
  searchPlaceholder = 'Buscar...',
  onSearch,
  columnWidths,
  searchFields = [],
  // Sorting props
  sortField,
  sortDirection,
  onSort
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [internalCurrentPage, setInternalCurrentPage] = useState(1)
  const [internalItemsPerPage, setInternalItemsPerPage] = useState(itemsPerPage)

  // Use frontend pagination if data is provided, otherwise fall back to external pagination
  const isFrontendPagination = !!data && !!renderRow

  // Filter data based on search term
  const filteredData = useMemo(() => {
    if (!isFrontendPagination || !data) return []
    if (!searchTerm.trim()) return data

    return data.filter((item) => {
      if (searchFields.length === 0) {
        // If no search fields specified, search all string values
        return Object.values(item).some((value) =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      }

      // Search only in specified fields
      return searchFields.some((field) => {
        const value = item[field]
        return (
          value &&
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      })
    })
  }, [data, searchTerm, searchFields, isFrontendPagination])

  // Calculate pagination for frontend mode
  const actualItemsPerPage = isFrontendPagination
    ? internalItemsPerPage
    : itemsPerPage
  const totalPages = isFrontendPagination
    ? Math.ceil(filteredData.length / actualItemsPerPage)
    : externalTotalPages || 1
  const currentPage = isFrontendPagination
    ? internalCurrentPage
    : externalCurrentPage || 1

  // Get current page data for frontend pagination
  const currentPageData = useMemo(() => {
    if (!isFrontendPagination) return []
    const startIndex = (internalCurrentPage - 1) * actualItemsPerPage
    const endIndex = startIndex + actualItemsPerPage
    return filteredData.slice(startIndex, endIndex)
  }, [
    filteredData,
    internalCurrentPage,
    actualItemsPerPage,
    isFrontendPagination
  ])

  // Pagination handlers
  const handlePrevPage = () => {
    if (isFrontendPagination) {
      setInternalCurrentPage((prev) => Math.max(1, prev - 1))
    } else if (externalOnPrevPage) {
      externalOnPrevPage()
    }
  }

  const handleNextPage = () => {
    if (isFrontendPagination) {
      setInternalCurrentPage((prev) => Math.min(totalPages, prev + 1))
    } else if (externalOnNextPage) {
      externalOnNextPage()
    }
  }

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setInternalItemsPerPage(newItemsPerPage)
    setInternalCurrentPage(1) // Reset to first page when changing items per page
  }

  // For frontend pagination, use the filtered rows. For external, use children
  const rows = isFrontendPagination
    ? currentPageData
    : React.Children.toArray(children)
  const hasData = rows.length > 0

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    if (onSearch) {
      onSearch(value)
    }
  }

  return (
    <div className="w-full">
      {searchable && (
        <div className="mb-4 relative">
          <div className="relative">
            <MdSearch
              size={20}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#71717A]"
            />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-[#E4E4E7] rounded-[8px] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#004080] focus:border-transparent"
            />
          </div>
        </div>
      )}
      <table className="w-full border border-[#E4E4E7] rounded-[8px] border-separate border-spacing-0 table-fixed">
        <thead>
          <tr>
            {headers.map((col, idx) => {
              const isString = typeof col === 'string'
              const label = isString ? col : col.label
              const sortKey = isString ? null : col.sortKey
              const isSortable = sortKey && onSort
              const isCurrentSort = sortKey === sortField

              return (
                <th
                  key={isString ? col : col.label}
                  style={{ width: columnWidths?.[idx] || 'auto' }}
                  className={`px-4 py-2.5 text-[14px] font-medium border-b border-[#E4E4E7] text-[#004080] ${
                    idx === headers.length - 1 ? 'text-right' : 'text-left'
                  } ${isSortable ? 'cursor-pointer hover:bg-gray-50' : ''}`}
                  onClick={() => isSortable && onSort(sortKey)}
                >
                  <div className="flex items-center gap-1">
                    {label}
                    {isSortable && (
                      <div className="flex flex-col">
                        <MdKeyboardArrowUp
                          size={16}
                          className={`${
                            isCurrentSort && sortDirection === 'asc'
                              ? 'text-[#004080]'
                              : 'text-gray-300'
                          }`}
                        />
                        <MdKeyboardArrowDown
                          size={16}
                          className={`-mt-1 ${
                            isCurrentSort && sortDirection === 'desc'
                              ? 'text-[#004080]'
                              : 'text-gray-300'
                          }`}
                        />
                      </div>
                    )}
                  </div>
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody>
          {hasData ? (
            isFrontendPagination ? (
              // Render frontend pagination data
              currentPageData.map((item, index) => renderRow!(item, index))
            ) : (
              // Render external pagination children
              children
            )
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
          <div className="flex items-center gap-4">
            <span className="text-[#71717A]">
              {isFrontendPagination
                ? `${Math.min(
                    (currentPage - 1) * actualItemsPerPage + 1,
                    filteredData.length
                  )} - ${Math.min(
                    currentPage * actualItemsPerPage,
                    filteredData.length
                  )} de ${filteredData.length} linhas`
                : `${rows.length} de ${rows.length} linhas nesta página`}
            </span>

            {isFrontendPagination && itemsPerPageOptions.length > 1 && (
              <div className="flex items-center gap-2">
                <span className="text-[#71717A] text-sm">
                  Linhas por página:
                </span>
                <select
                  value={internalItemsPerPage}
                  onChange={(e) =>
                    handleItemsPerPageChange(Number(e.target.value))
                  }
                  className="border border-[#E4E4E7] rounded-[4px] px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#004080] focus:border-transparent"
                >
                  {itemsPerPageOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="p-[10px] border border-[#D9D9D9] rounded-[8px] hover:bg-gray-200 transition flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <MdArrowBackIos size={10} />
            </button>

            <span>
              Página {currentPage} de {totalPages}
            </span>

            <button
              onClick={handleNextPage}
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
