import './style.scss'
import { useGroups } from './model'
import { PageComponent } from '../../components/page-component'
import { MdArrowBackIosNew, MdOutlineMoreVert, MdStorage } from 'react-icons/md'
import { Table } from '../../components/ui/table'

export const GroupsView = (props: ReturnType<typeof useGroups>) => {
  const objectExample = [
    {
      name: 'usuarios',
      bank: 'banco de prod',
      qtdColunas: 5,
      qtdUsuarios: 10,
      ativo: true
    },
    {
      name: 'pedidos',
      bank: 'banco de prod',
      qtdColunas: 3,
      qtdUsuarios: 8,
      ativo: false
    },
    {
      name: 'produtos',
      bank: 'banco de prod',
      qtdColunas: 4,
      qtdUsuarios: 12,
      ativo: true
    }
  ]
  return (
    <PageComponent topbarIcon={<MdStorage />} topbarTitle="Grupos">
      <div className="mb-[35px] mt-[27px] flex items-center justify-between">
        <div className="flex items-center gap-[10px]">
          <MdStorage size={14} className="text-[#1D1D1D]" />
          <div className="text-[24px] font-medium text-[#1D1D1D]">
            Grupos encontrados
          </div>
        </div>
        {/* <div className="flex items-center gap-6">
          <button className="text-[14px] px-6 py-3 text-white bg-[#004080] rounded-[12px]">
            Editar grupo
          </button>
          <button className="text-[14px] px-6 py-3 text-[#004080] border border-[#004080] rounded-[12px]">
            Remover
          </button>
          <button className="text-[14px] px-6 py-3 text-white bg-[#004080] rounded-[12px]">
            Adicionar usuários
          </button>
        </div> */}
      </div>
      <Table
        headers={[
          'Nome do grupos',
          'Qtd Colunas',
          'Qtd Usuários',
          'Ativo',
          'Ação'
        ]}
      >
        {objectExample.map((item, index) => (
          <tr
            key={index}
            className="hover:bg-gray-100s cursor-pointer"
            onClick={() => props.handleDirectGroup(item.name)}
          >
            <td className="px-4 py-3 text-[#1E1E1E] font-regular text-[14px] border-b border-[#E4E4E7]">
              {item.name}
            </td>
            <td className="px-4 py-3 text-[#1E1E1E] font-regular text-[14px] border-b border-[#E4E4E7]">
              {item.qtdColunas}
            </td>
            <td className="px-4 py-3 text-[#1E1E1E] font-regular text-[14px] border-b border-[#E4E4E7]">
              {item.qtdUsuarios}
            </td>
            <td className="px-4 py-3 text-[#1E1E1E] font-regular text-[14px] border-b border-[#E4E4E7]">
              {item.ativo ? 'Sim' : 'Não'}
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
