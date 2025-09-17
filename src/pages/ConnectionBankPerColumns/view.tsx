import './style.scss'
import { useConnectionBankPerColumns } from './model'
import { PageComponent } from '../../components/page-component'
import {
  MdArrowBackIosNew,
  MdDonutLarge,
  MdInfoOutline,
  MdOutlineMoreVert,
  MdStorage
} from 'react-icons/md'
import { Table } from '../../components/ui/table'

export const ConnectionBankPerColumnsView = (
  props: ReturnType<typeof useConnectionBankPerColumns>
) => {
  const objectExample = [
    {
      name: 'id',
      description: 'Identificador único do usuário',
      columnType: 'INTEGER',
      pendingIssues: 0,
      isActive: true
    },
    {
      name: 'username',
      description: 'Nome de usuário para login',
      columnType: 'VARCHAR(50)',
      pendingIssues: 1,
      isActive: true
    },
    {
      name: 'email',
      description: 'Endereço de e-mail do usuário',
      columnType: 'VARCHAR(100)',
      pendingIssues: 0,
      isActive: false
    }
  ]
  return (
    <PageComponent
      topbarIcon={<MdStorage />}
      topbarTitle="Tabela [usuarios] | Conexao [banco de prod]"
    >
      <button
        onClick={props.handleBack}
        className="flex items-center gap-1 cursor-pointer text-[13px] font-medium text-[#121623]"
      >
        <MdArrowBackIosNew size={9} />
        Voltar
      </button>
      <div className="flex gap-[22px] mt-[18px]">
        <div className=" w-[302px] h-[139px] px-[24px] py-[12px] bg-[#F0F0F042] rounded-[8px] border border-[#E4E4E7] flex flex-col justify-between">
          <div className=" flex items-center gap-1 text-[15px] font-medium text-[#1D1D1D]">
            <MdDonutLarge />
            Bloco de status
          </div>
          <div className="flex items-center gap-1 justify-end text-[10px] ">
            <div className="w-[6px] h-[6px] rounded-full bg-[#02D909]"></div>
            34ms
          </div>
        </div>
        <div className="w-[302px] h-[139px] px-[24px] py-[12px] bg-[#F0F0F042] rounded-[8px] border border-[#E4E4E7] flex flex-col justify-between">
          <div className=" flex items-center gap-1 text-[15px] font-medium text-[#1D1D1D]">
            <MdInfoOutline />
            Bloco de notificação
          </div>
          <div className="flex items-center gap-1 justify-end text-[10px] ">
            <div className="w-[6px] h-[6px] rounded-full bg-[#02D909]"></div>
            34ms
          </div>
        </div>
      </div>
      <div className="mb-[35px] mt-[60px] flex items-center justify-between">
        <div className="flex items-center gap-1">
          <MdStorage size={14} className="text-[#1D1D1D]" />
          <div className="text-[24px] font-medium text-[#1D1D1D]">
            Colunas encontradas
          </div>
        </div>
        <div className="text-[12px] text-[#6C6C6C]">Ativar/Desativar todas</div>
      </div>
      <Table
        headers={[
          'Nome da coluna',
          'Descrição ',
          'Tipo de coluna',
          'Pendências ',
          'Ativa',
          ''
        ]}
      >
        {objectExample.map((item, index) => (
          <tr key={index} className="hover:bg-gray-100s ">
            <td className="px-4 py-3 text-[#1E1E1E] font-regular text-[14px] border-b border-[#E4E4E7]">
              {item.name}
            </td>
            <td className="px-4 py-3 text-[#1E1E1E] font-regular text-[14px] border-b border-[#E4E4E7]">
              {item.description}
            </td>
            <td className="px-4 py-3 text-[#1E1E1E] font-regular text-[14px] border-b border-[#E4E4E7]">
              {item.columnType}
            </td>
            <td className="px-4 py-3 text-[#1E1E1E] font-regular text-[12px] border-b border-[#E4E4E7]">
              {item.pendingIssues}
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
