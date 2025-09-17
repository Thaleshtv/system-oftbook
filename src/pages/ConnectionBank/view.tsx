import './style.scss'
import { useConnectionBank } from './model'
import { PageComponent } from '../../components/page-component'
import { MdOutlineStorage } from 'react-icons/md'

export const ConnectionBankView = (
  props: ReturnType<typeof useConnectionBank>
) => {
  return (
    <PageComponent
      topbarTitle="Conexão com o banco"
      topbarIcon={<MdOutlineStorage size={20} />}
    >
      <h1>Connection Bank</h1>
    </PageComponent>
  )
}
