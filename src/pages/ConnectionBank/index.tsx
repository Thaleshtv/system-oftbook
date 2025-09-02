import { useConnectionBank } from './model'
import { ConnectionBankView } from './view'

export const ConnectionBank = () => {
  const modelConnectionBank = useConnectionBank()

  return <ConnectionBankView {...modelConnectionBank} />
}
