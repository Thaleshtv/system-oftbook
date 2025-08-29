import { useRedefinir } from './model'
import { RedefinirView } from './view'

export const Redefinir = () => {
  const modelRedefinir = useRedefinir()

  return <RedefinirView {...modelRedefinir} />
}
