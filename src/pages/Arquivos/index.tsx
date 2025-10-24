import { useArquivos } from './model'
import { ArquivosView } from './view'

export const Arquivos = () => {
  const modelArquivos = useArquivos()

  return <ArquivosView {...modelArquivos} />
}
