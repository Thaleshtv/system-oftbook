import { useConnectionBankPerTables } from './model'
import { ConnectionBankPerTablesView } from './view'

export const ConnectionBankPerTables = () => {
  const modelConnectionBankPerTables = useConnectionBankPerTables()

  return <ConnectionBankPerTablesView {...modelConnectionBankPerTables} />
}
