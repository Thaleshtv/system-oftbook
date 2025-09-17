import './style.scss'
import { useConnectionBankPerColumns } from './model'
import { PageComponent } from '../../components/page-component'
import { Md10K } from 'react-icons/md'

export const ConnectionBankPerColumnsView = (
  props: ReturnType<typeof useConnectionBankPerColumns>
) => {
  return (
    <PageComponent
      topbarIcon={<Md10K />}
      topbarTitle="ConnectionBankPerColumns"
    >
      <h1>ConnectionBankPerColumns</h1>
    </PageComponent>
  )
}
