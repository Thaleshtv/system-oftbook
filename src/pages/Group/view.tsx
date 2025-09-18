import './style.scss'
import { useGroup } from './model'
import { PageComponent } from '../../components/page-component'
import {
  Md10K,
  MdArrowBackIosNew,
  MdOutlineMoreVert,
  MdStorage
} from 'react-icons/md'
import { Table } from '../../components/ui/table'

export const GroupView = (props: ReturnType<typeof useGroup>) => {
  const objectExample = [
    {
      name: 'usuarios',
      bank: 'banco de prod'
    },
    {
      name: 'pedidos',
      bank: 'banco de prod'
    },
    {
      name: 'produtos',
      bank: 'banco de prod'
    }
  ]
  return (
    <PageComponent topbarIcon={<Md10K />} topbarTitle="Group">
      <button
        onClick={props.handleBack}
        className="flex items-center gap-1 cursor-pointer text-[13px] font-medium text-[#121623]"
      >
        <MdArrowBackIosNew size={9} />
        Voltar
      </button>
      <div className="mb-[35px] mt-[27px] flex items-center justify-between">
        <div className="flex items-center gap-[10px]">
          <MdStorage size={14} className="text-[#1D1D1D]" />
          <div className="text-[24px] font-medium text-[#1D1D1D]">
            Mapa de associação
          </div>
        </div>
        <div className="flex items-center gap-6">
          <button className="text-[14px] px-6 py-3 text-white bg-[#004080] rounded-[12px]">
            Editar grupo
          </button>
          <button className="text-[14px] px-6 py-3 text-[#004080] border border-[#004080] rounded-[12px]">
            Remover
          </button>
          <button className="text-[14px] px-6 py-3 text-white bg-[#004080] rounded-[12px]">
            Adicionar usuários
          </button>
        </div>
      </div>
      <Table headers={['', 'Nome da tabela', 'Banco de dados ', 'Ação']}>
        {objectExample.map((item, index) => (
          <tr key={index} className="hover:bg-gray-100">
            <td className="px-4 py-3 text-[#1E1E1E] font-regular text-[14px] border-b border-[#E4E4E7]">
              <input type="checkbox" className="w-4 h-4" />
            </td>
            <td className="px-4 py-3 text-[#1E1E1E] font-regular text-[14px] border-b border-[#E4E4E7]">
              {item.name}
            </td>
            <td className="px-4 py-3 text-[#1E1E1E] font-regular text-[14px] border-b border-[#E4E4E7]">
              {item.bank}
            </td>

            <td className="px-4 py-3 text-[#1E1E1E] font-regular text-[14px] border-b border-[#E4E4E7]">
              <MdOutlineMoreVert size={20} className="cursor-pointer" />
            </td>
          </tr>
        ))}
      </Table>
    </PageComponent>
  )
}
