import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface MarkdownRendererProps {
  content: string
  className?: string
  variant?: 'default' | 'chat' | 'insight'
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ 
  content, 
  className = '',
  variant = 'default'
}) => {
  // Estilos baseados na variante
  const getVariantStyles = () => {
    switch (variant) {
      case 'chat':
        return {
          h1: 'text-lg font-bold mb-2 text-inherit',
          h2: 'text-base font-semibold mb-2 text-inherit',
          h3: 'text-sm font-medium mb-1 text-inherit',
          p: 'mb-1 leading-relaxed text-inherit',
          ul: 'list-disc pl-4 mb-1 space-y-0.5',
          ol: 'list-decimal pl-4 mb-1 space-y-0.5',
          li: 'text-sm text-inherit'
        }
      case 'insight':
        return {
          h1: 'text-lg font-bold mb-2 text-blue-900',
          h2: 'text-base font-semibold mb-2 text-blue-900',
          h3: 'text-sm font-medium mb-1 text-blue-800',
          p: 'mb-2 leading-relaxed text-inherit',
          ul: 'list-disc pl-4 mb-2 space-y-1',
          ol: 'list-decimal pl-4 mb-2 space-y-1',
          li: 'text-sm text-inherit'
        }
      default:
        return {
          h1: 'text-xl font-bold mb-3 text-gray-800',
          h2: 'text-lg font-semibold mb-2 text-gray-800',
          h3: 'text-base font-medium mb-2 text-gray-800',
          p: 'mb-2 leading-relaxed',
          ul: 'list-disc pl-4 mb-2 space-y-1',
          ol: 'list-decimal pl-4 mb-2 space-y-1',
          li: 'text-sm'
        }
    }
  }

  const styles = getVariantStyles()

  return (
    <div className={`markdown-content ${className}`}>
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
        components={{
          // Customização dos elementos HTML gerados
          h1: ({children}) => <h1 className={styles.h1}>{children}</h1>,
          h2: ({children}) => <h2 className={styles.h2}>{children}</h2>,
          h3: ({children}) => <h3 className={styles.h3}>{children}</h3>,
          p: ({children}) => <p className={styles.p}>{children}</p>,
          ul: ({children}) => <ul className={styles.ul}>{children}</ul>,
          ol: ({children}) => <ol className={styles.ol}>{children}</ol>,
          li: ({children}) => <li className={styles.li}>{children}</li>,
          strong: ({children}) => <strong className="font-semibold">{children}</strong>,
          em: ({children}) => <em className="italic">{children}</em>,
          code: ({children}) => (
            <code className="bg-gray-100 bg-opacity-70 px-1 py-0.5 rounded text-sm font-mono">
              {children}
            </code>
          ),
          pre: ({children}) => (
            <pre className="bg-gray-100 bg-opacity-70 p-3 rounded-md overflow-x-auto mb-2 text-sm">
              {children}
            </pre>
          ),
          blockquote: ({children}) => (
            <blockquote className="border-l-3 border-current pl-3 ml-2 italic opacity-80 mb-2">
              {children}
            </blockquote>
          ),
          table: ({children}) => (
            <div className="overflow-x-auto mb-2">
              <table className="min-w-full border-collapse border border-gray-300 border-opacity-50 text-sm">
                {children}
              </table>
            </div>
          ),
          thead: ({children}) => (
            <thead className="bg-gray-50 bg-opacity-50">{children}</thead>
          ),
          th: ({children}) => (
            <th className="border border-gray-300 border-opacity-50 px-2 py-1 text-left font-medium">
              {children}
            </th>
          ),
          td: ({children}) => (
            <td className="border border-gray-300 border-opacity-50 px-2 py-1">{children}</td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}

export default MarkdownRenderer