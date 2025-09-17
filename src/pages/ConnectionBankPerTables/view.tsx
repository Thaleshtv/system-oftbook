import './styles.scss'
import { useConnectionBankPerTables } from './model'
import { PageComponent } from '../../components/page-component'
import { MdArrowBackIosNew, MdOutlineMoreVert, MdStorage } from 'react-icons/md'
import { Table } from '../../components/ui/table'

export const ConnectionBankPerTablesView = (
  props: ReturnType<typeof useConnectionBankPerTables>
) => {
  const objectExample = [
    {
      name: 'users',
      description: 'Tabela de usuários do sistema',
      columnCount: 12,
      pendingIssues: 2,
      isActive: true
    },
    {
      name: 'orders',
      description: 'Tabela de pedidos realizados',
      columnCount: 8,
      pendingIssues: 0,
      isActive: true
    },
    {
      name: 'products',
      description: 'Tabela de produtos disponíveis',
      columnCount: 15,
      pendingIssues: 1,
      isActive: false
    }
  ]
  return (
    <PageComponent
      topbarIcon={<MdStorage />}
      topbarTitle="Conexão: [Banco de produção]"
    >
      <button
        onClick={props.handleBack}
        className="flex items-center gap-1 cursor-pointer text-[13px] font-medium text-[#121623]"
      >
        <MdArrowBackIosNew size={9} />
        Voltar
      </button>
      <div className="mt-[18px] w-[302px] h-[139px] px-[24px] py-[12px] bg-[#F0F0F042] rounded-[8px] border border-[#E4E4E7] flex flex-col justify-between">
        <div className="text-[15px] font-medium text-[#1D1D1D]">
          Bloco de status
        </div>
        <div className="flex items-center gap-1 justify-end text-[10px] ">
          <div className="w-[6px] h-[6px] rounded-full bg-[#02D909]"></div>
          34ms
        </div>
      </div>
      <div className="mb-[35px] mt-[60px] flex items-center justify-between">
        <div className="flex items-center gap-1">
          <MdStorage size={14} className="text-[#1D1D1D]" />
          <div className="text-[24px] font-medium text-[#1D1D1D]">
            Tabelas encontradas
          </div>
        </div>
        <div className="text-[12px] text-[#6C6C6C]">Ativar/Desativar todas</div>
      </div>
      <Table
        headers={[
          'Nome da tabela',
          'Descrição ',
          'Qtd Colunas',
          'Pendências ',
          'Ativa',
          'Ação'
        ]}
      >
        {objectExample.map((item, index) => (
          <tr key={index} className="hover:bg-gray-100 cursor-pointer">
            <td className="px-4 py-3 text-[#1E1E1E] font-regular text-[14px] border-b border-[#E4E4E7]">
              {item.name}
            </td>
            <td className="px-4 py-3 text-[#1E1E1E] font-regular text-[14px] border-b border-[#E4E4E7]">
              {item.description}
            </td>
            <td className="px-4 py-3 text-[#1E1E1E] font-regular text-[14px] border-b border-[#E4E4E7]">
              {item.columnCount}
            </td>
            <td className="px-4 py-3 text-[#1E1E1E] font-regular text-[12px] border-b border-[#E4E4E7]">
              <span className="rounded-[26px] px-[10px] py-[4px] bg-[#FB7373] text-white">
                Pendência: {item.pendingIssues}
              </span>
            </td>
            <td className="px-4 py-3 text-[#1E1E1E] font-regular text-[14px] border-b border-[#E4E4E7]">
              {item.isActive ? 'Sim' : 'Não'}
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
