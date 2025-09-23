import React from 'react'

interface SkeletonProps {
  width?: string
  height?: string
  className?: string
  variant?: 'text' | 'rectangular' | 'circular'
  animation?: boolean
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = '1rem',
  className = '',
  variant = 'text',
  animation = true
}) => {
  const baseClasses = 'bg-gray-200'
  const animationClass = animation ? 'animate-pulse' : ''

  const variantClasses = {
    text: 'rounded',
    rectangular: 'rounded',
    circular: 'rounded-full'
  }

  return (
    <div
      className={`${baseClasses} ${animationClass} ${variantClasses[variant]} ${className}`}
      style={{ width, height }}
    />
  )
}

// Skeleton para cards de agentes
export const AgentCardSkeleton: React.FC = () => (
  <div className="min-w-[506px] h-[116px] rounded-[8px] border border-[#E4E4E7] px-[12px] py-[14px] flex flex-col justify-between">
    <div className="flex items-center gap-[10px]">
      <Skeleton variant="circular" width="24px" height="24px" />
      <Skeleton width="200px" height="18px" />
    </div>
    <div className="flex items-center gap-[10px] justify-between">
      <Skeleton width="150px" height="14px" />
      <div className="flex items-center gap-[10px]">
        <Skeleton variant="circular" width="28px" height="28px" />
        <Skeleton variant="circular" width="28px" height="28px" />
      </div>
    </div>
  </div>
)

// Skeleton para linha de tabela
export const TableRowSkeleton: React.FC<{ columns: number }> = ({
  columns
}) => (
  <tr>
    {Array.from({ length: columns }).map((_, index) => (
      <td key={index} className="px-4 py-3 border-b border-[#E4E4E7]">
        <Skeleton height="14px" />
      </td>
    ))}
  </tr>
)

// Skeleton para tabela completa
export const TableSkeleton: React.FC<{ headers: string[]; rows?: number }> = ({
  headers,
  rows = 5
}) => (
  <div className="w-full">
    <table className="w-full border-collapse">
      <thead>
        <tr className="bg-[#F8F9FA]">
          {headers.map((header, index) => (
            <th
              key={index}
              className="text-left px-4 py-3 text-[#1E1E1E] font-semibold text-[14px] border-b border-[#E4E4E7]"
            >
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: rows }).map((_, index) => (
          <TableRowSkeleton key={index} columns={headers.length} />
        ))}
      </tbody>
    </table>
  </div>
)

// Skeleton para formulário
export const FormSkeleton: React.FC = () => (
  <div className="space-y-6">
    <div className="space-y-2">
      <Skeleton width="120px" height="14px" />
      <Skeleton height="44px" />
    </div>
    <div className="grid grid-cols-2 gap-6">
      <div className="space-y-2">
        <Skeleton width="80px" height="14px" />
        <Skeleton height="44px" />
      </div>
      <div className="space-y-2">
        <Skeleton width="100px" height="14px" />
        <Skeleton height="44px" />
      </div>
    </div>
    <div className="flex justify-end">
      <Skeleton width="120px" height="44px" />
    </div>
  </div>
)

// Skeleton para página de listagem
export const ListPageSkeleton: React.FC<{
  showForm?: boolean
  tableHeaders?: string[]
  tableRows?: number
}> = ({
  showForm = false,
  tableHeaders = ['Coluna 1', 'Coluna 2', 'Coluna 3', ''],
  tableRows = 5
}) => (
  <div>
    <div className="mb-[35px] mt-[27px] flex items-center justify-between">
      <div className="flex items-center gap-[10px]">
        <Skeleton variant="circular" width="14px" height="14px" />
        <Skeleton width="200px" height="24px" />
      </div>
    </div>

    {showForm && (
      <div className="mb-[24px]">
        <FormSkeleton />
      </div>
    )}

    <TableSkeleton headers={tableHeaders} rows={tableRows} />
  </div>
)
