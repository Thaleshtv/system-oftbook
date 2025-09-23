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

// Skeleton para mensagem de chat
export const ChatMessageSkeleton: React.FC<{ sender: 'user' | 'bot' }> = ({
  sender
}) => (
  <div
    className={`flex w-full ${
      sender === 'user' ? 'justify-end' : 'justify-start'
    }`}
  >
    <div
      className={`flex flex-col gap-2 max-w-[70%] ${
        sender === 'user' ? 'items-end' : 'items-start'
      }`}
    >
      <Skeleton width="60px" height="12px" />
      <div
        className={`px-4 py-3 ${
          sender === 'user'
            ? 'bg-blue-100 rounded-l-3xl rounded-tr-3xl rounded-br-sm'
            : 'bg-gray-100 rounded-r-3xl rounded-tl-3xl rounded-bl-sm'
        }`}
      >
        <Skeleton width="200px" height="16px" className="mb-2" />
        <Skeleton width="150px" height="16px" />
      </div>
      <Skeleton width="40px" height="10px" />
    </div>
  </div>
)

// Skeleton para lista de sessões na sidebar
export const SessionListSkeleton: React.FC<{ count?: number }> = ({
  count = 3
}) => (
  <div className="flex flex-col gap-2">
    {Array.from({ length: count }).map((_, index) => (
      <div
        key={index}
        className="px-[16px] py-[8px] flex items-center gap-[10px] rounded-[12px]"
      >
        <Skeleton variant="circular" width="18px" height="18px" />
        <div className="flex-1">
          <Skeleton width="80%" height="14px" className="mb-1" />
          <Skeleton width="60%" height="10px" />
        </div>
      </div>
    ))}
  </div>
)

// Skeleton para gráfico
export const GraphSkeleton: React.FC = () => (
  <div className="flex-1 flex flex-col gap-4">
    <Skeleton width="120px" height="14px" />
    <div className="flex-1 bg-gray-50 rounded-xl p-4 flex flex-col gap-3 min-h-[200px]">
      <Skeleton width="100%" height="20px" />
      <div className="flex-1 flex items-end gap-2">
        <Skeleton width="40px" height="60px" />
        <Skeleton width="40px" height="80px" />
        <Skeleton width="40px" height="40px" />
        <Skeleton width="40px" height="100px" />
        <Skeleton width="40px" height="60px" />
      </div>
      <Skeleton width="100%" height="16px" />
    </div>
  </div>
)

// Skeleton para insights
export const InsightSkeleton: React.FC = () => (
  <div className="flex-1 flex flex-col gap-4">
    <Skeleton width="80px" height="14px" />
    <div className="flex-1 bg-blue-50 border border-blue-200 rounded-xl p-4 flex flex-col gap-2 min-h-[200px]">
      <Skeleton width="100%" height="14px" />
      <Skeleton width="90%" height="14px" />
      <Skeleton width="95%" height="14px" />
      <Skeleton width="85%" height="14px" />
      <div className="mt-4">
        <Skeleton width="70%" height="14px" />
        <Skeleton width="80%" height="14px" className="mt-2" />
      </div>
    </div>
  </div>
)
