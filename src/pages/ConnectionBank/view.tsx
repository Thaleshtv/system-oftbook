import './style.scss'
import { useConnectionBank } from './model'
import { PageComponent } from '../../components/page-component'
import { MdOutlineMoreVert, MdOutlineStorage } from 'react-icons/md'
import { Table } from '../../components/ui/table'

export const ConnectionBankView = (
  props: ReturnType<typeof useConnectionBank>
) => {
  const objectExample = [
    {
      name: 'Banco de Teste',
      driver: 'PostgreSQL',
      server: 'localhost',
      database: 'test_db',
      schema: 'public',
      dataType: 'Relacional',
      catalog: 'default',
      actions: 'Editar | Excluir'
    },
    {
      name: 'Banco de Produção',
      driver: 'MySQL',
      server: 'prod_server',
      database: 'prod_db',
      schema: 'public',
      dataType: 'Relacional',
      catalog: 'default',
      actions: 'Editar | Excluir'
    },
    {
      name: 'Banco de Desenvolvimento',
      driver: 'SQLite',
      server: 'dev_server',
      database: 'dev_db',
      schema: 'public',
      dataType: 'Relacional',
      catalog: 'default',
      actions: 'Editar | Excluir'
    },
    {
      name: 'Banco de Análise',
      driver: 'Oracle',
      server: 'analytics_server',
      database: 'analytics_db',
      schema: 'public',
      dataType: 'Relacional',
      catalog: 'default',
      actions: 'Editar | Excluir'
    }
  ]

  return (
    <PageComponent
      topbarTitle="Conexão com o banco"
      topbarIcon={<MdOutlineStorage size={20} />}
    >
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 flex flex-col gap-2">
          <label
            htmlFor="nomeDaConexao"
            className="font-medium text-[14px] text-[#1E1E1E]"
          >
            Nome da Conexão
          </label>
          <input
            type="text"
            id="nomeDaConexao"
            className="border border-[#E4E4E7] bg-[#E6E6E6]/26 rounded-[8px] p-[12px] text-[#0A1B39]"
          />
        </div>
        <div className="col-span-6 flex flex-col gap-2">
          <label
            htmlFor="driver"
            className="font-medium text-[14px] text-[#1E1E1E]"
          >
            Driver
          </label>
          <input
            type="text"
            id="driver"
            className="border border-[#E4E4E7] bg-[#E6E6E6]/26 rounded-[8px] p-[12px] text-[#0A1B39]"
          />
        </div>
        <div className="col-span-6 flex flex-col gap-2">
          <label
            htmlFor="server"
            className="font-medium text-[14px] text-[#1E1E1E]"
          >
            Server
          </label>
          <input
            type="text"
            id="server"
            className="border border-[#E4E4E7] bg-[#E6E6E6]/26 rounded-[8px] p-[12px] text-[#0A1B39]"
          />
        </div>
        <div className="col-span-12 flex flex-col gap-2">
          <label
            htmlFor="database"
            className="font-medium text-[14px] text-[#1E1E1E]"
          >
            Database
          </label>
          <input
            type="text"
            id="database"
            className="border border-[#E4E4E7] bg-[#E6E6E6]/26 rounded-[8px] p-[12px] text-[#0A1B39]"
          />
        </div>
        <div className="col-span-4 flex flex-col gap-2">
          <label
            htmlFor="schema"
            className="font-medium text-[14px] text-[#1E1E1E]"
          >
            Schema
          </label>
          <input
            type="text"
            id="schema"
            className="border border-[#E4E4E7] bg-[#E6E6E6]/26 rounded-[8px] p-[12px] text-[#0A1B39]"
          />
        </div>
        <div className="col-span-4 flex flex-col gap-2">
          <label
            htmlFor="tipo"
            className="font-medium text-[14px] text-[#1E1E1E]"
          >
            Tipo de banco de dados
          </label>
          <input
            type="text"
            id="tipo"
            className="border border-[#E4E4E7] bg-[#E6E6E6]/26 rounded-[8px] p-[12px] text-[#0A1B39]"
          />
        </div>
        <div className="col-span-4 flex flex-col gap-2">
          <label
            htmlFor="catalogo"
            className="font-medium text-[14px] text-[#1E1E1E]"
          >
            Catálogo
          </label>
          <input
            type="text"
            id="catalogo"
            className="border border-[#E4E4E7] bg-[#E6E6E6]/26 rounded-[8px] p-[12px] text-[#0A1B39]"
          />
        </div>
        <div className="col-span-12 flex flex-col items-end gap-2">
          <button className="bg-[#004080] text-[14px] text-white px-6 py-3 rounded-[8px] hover:bg-[#004080]/80 cursor-pointer transition">
            Adicionar conexão
          </button>
        </div>
      </div>
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 flex gap-2 items-center mb-8 mt-[42px] text-[24px] font-medium text-[#1D1D1D]">
          <MdOutlineStorage size={20} />
          Conexões cadastradas
        </div>
        <div className="col-span-12">
          <Table
            headers={[
              'Nome',
              'Driver',
              'Server',
              'Database',
              'Schema',
              'Tipo de banco',
              'Catalogo',
              ''
            ]}
          >
            {objectExample.map((item, index) => (
              <tr
                key={index}
                className="hover:bg-gray-100 cursor-pointer"
                onClick={() => props.handleDirectToTable(item.name)}
              >
                <td className="px-4 py-3 text-[#1E1E1E] font-regular text-[14px] border-b border-[#E4E4E7]">
                  {item.name}
                </td>
                <td className="px-4 py-3 text-[#1E1E1E] font-regular text-[14px] border-b border-[#E4E4E7]">
                  {item.driver}
                </td>
                <td className="px-4 py-3 text-[#1E1E1E] font-regular text-[14px] border-b border-[#E4E4E7]">
                  {item.server}
                </td>
                <td className="px-4 py-3 text-[#1E1E1E] font-regular text-[14px] border-b border-[#E4E4E7]">
                  {item.database}
                </td>
                <td className="px-4 py-3 text-[#1E1E1E] font-regular text-[14px] border-b border-[#E4E4E7]">
                  {item.schema}
                </td>
                <td className="px-4 py-3 text-[#1E1E1E] font-regular text-[14px] border-b border-[#E4E4E7]">
                  {item.dataType}
                </td>
                <td className="px-4 py-3 text-[#1E1E1E] font-regular text-[14px] border-b border-[#E4E4E7]">
                  {item.catalog}
                </td>
                <td className="px-4 py-3 text-[#1E1E1E] font-regular text-[14px] border-b border-[#E4E4E7]">
                  <MdOutlineMoreVert size={20} className="cursor-pointer" />
                </td>
              </tr>
            ))}
          </Table>
        </div>
      </div>
    </PageComponent>
  )
}
