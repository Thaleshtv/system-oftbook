import { useAgentes } from './model'
import { AgentesView } from './view'

export const Agentes = () => {
  const modelAgentes = useAgentes()

  return <AgentesView {...modelAgentes} />
}
