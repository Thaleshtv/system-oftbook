import { useConnectionBankPerColumns } from './model'
import { ConnectionBankPerColumnsView } from './view'

export const ConnectionBankPerColumns = () => {
  const modelConnectionBankPerColumns = useConnectionBankPerColumns()

  return <ConnectionBankPerColumnsView {...modelConnectionBankPerColumns} />
}
