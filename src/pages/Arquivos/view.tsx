import { PageComponent } from '../../components/page-component'
import { useArquivos } from './model'

export const ArquivosView = (props: ReturnType<typeof useArquivos>) => {
  return (
    <PageComponent title="Arquivos">
      <div className="space-y-6"></div>
    </PageComponent>
  )
}
