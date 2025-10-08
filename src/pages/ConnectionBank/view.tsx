import './style.scss'
import { useConnectionBank } from './model'
import { PageComponent } from '../../components/page-component'
import { MdOutlineMoreVert, MdOutlineStorage } from 'react-icons/md'
import { Table } from '../../components/ui/table'
import { ActionMenu } from '../../components/ui/action-menu'
import { ModalConfirm } from '../../components/ui/modal-confirmation'
import { ModalEdit } from './components/modal-edit-connection'
import { ListPageSkeleton } from '../../components/ui/skeleton'

export const ConnectionBankView = (
  props: ReturnType<typeof useConnectionBank>
) => {
  const { form, onSubmit } = props
  const { register, formState } = form
  const { errors } = formState

  if (props.getConnectionsQuery.isLoading) {
    return (
      <PageComponent
        topbarTitle="Conexão com o banco"
        topbarIcon={<MdOutlineStorage size={20} />}
      >
        <ListPageSkeleton
          showForm={true}
          tableHeaders={[
            'Nome',
            'Driver',
            'Server',
            'Database',
            'Schema',
            'Tipo de banco',
            'Catalogo',
            ''
          ]}
          tableRows={5}
        />
      </PageComponent>
    )
  }

  return (
    <PageComponent
      topbarTitle="Conexão com o banco"
      topbarIcon={<MdOutlineStorage size={20} />}
    >
      <form onSubmit={onSubmit}>
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 flex flex-col gap-2">
            <label
              htmlFor="nome"
              className="font-medium text-[14px] text-[#1E1E1E]"
            >
              Nome da Conexão
            </label>
            <input
              type="text"
              id="nome"
              {...register('nome')}
              className="border border-[#E4E4E7] bg-[#E6E6E6]/26 rounded-[8px] p-[12px] text-[#0A1B39]"
            />
            {errors.nome && (
              <span className="text-red-500 text-sm">
                {errors.nome.message}
              </span>
            )}
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
              {...register('driver')}
              className="border border-[#E4E4E7] bg-[#E6E6E6]/26 rounded-[8px] p-[12px] text-[#0A1B39]"
            />
            {errors.driver && (
              <span className="text-red-500 text-sm">
                {errors.driver.message}
              </span>
            )}
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
              {...register('server')}
              className="border border-[#E4E4E7] bg-[#E6E6E6]/26 rounded-[8px] p-[12px] text-[#0A1B39]"
            />
            {errors.server && (
              <span className="text-red-500 text-sm">
                {errors.server.message}
              </span>
            )}
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
              {...register('database')}
              className="border border-[#E4E4E7] bg-[#E6E6E6]/26 rounded-[8px] p-[12px] text-[#0A1B39]"
            />
            {errors.database && (
              <span className="text-red-500 text-sm">
                {errors.database.message}
              </span>
            )}
          </div>

          <div className="col-span-6 flex flex-col gap-2">
            <label
              htmlFor="pwd"
              className="font-medium text-[14px] text-[#1E1E1E]"
            >
              Senha
            </label>
            <input
              type="text"
              id="pwd"
              {...register('pwd')}
              className="border border-[#E4E4E7] bg-[#E6E6E6]/26 rounded-[8px] p-[12px] text-[#0A1B39]"
            />
            {errors.pwd && (
              <span className="text-red-500 text-sm">{errors.pwd.message}</span>
            )}
          </div>

          <div className="col-span-6 flex flex-col gap-2">
            <label
              htmlFor="db_schema"
              className="font-medium text-[14px] text-[#1E1E1E]"
            >
              Schema
            </label>
            <input
              type="text"
              id="db_schema"
              {...register('db_schema')}
              className="border border-[#E4E4E7] bg-[#E6E6E6]/26 rounded-[8px] p-[12px] text-[#0A1B39]"
            />
            {errors.db_schema && (
              <span className="text-red-500 text-sm">
                {errors.db_schema.message}
              </span>
            )}
          </div>

          <div className="col-span-6 flex flex-col gap-2">
            <label
              htmlFor="tipo_banco"
              className="font-medium text-[14px] text-[#1E1E1E]"
            >
              Tipo de banco de dados
            </label>
            <input
              type="text"
              id="tipo_banco"
              {...register('tipo_banco')}
              className="border border-[#E4E4E7] bg-[#E6E6E6]/26 rounded-[8px] p-[12px] text-[#0A1B39]"
            />
            {errors.tipo_banco && (
              <span className="text-red-500 text-sm">
                {errors.tipo_banco.message}
              </span>
            )}
          </div>

          <div className="col-span-6 flex flex-col gap-2">
            <label
              htmlFor="catalogo"
              className="font-medium text-[14px] text-[#1E1E1E]"
            >
              Catálogo
            </label>
            <input
              type="text"
              id="catalogo"
              {...register('catalogo')}
              className="border border-[#E4E4E7] bg-[#E6E6E6]/26 rounded-[8px] p-[12px] text-[#0A1B39]"
            />
            {errors.catalogo && (
              <span className="text-red-500 text-sm">
                {errors.catalogo.message}
              </span>
            )}
          </div>

          <div className="col-span-12 flex flex-col items-end gap-2">
            <button
              disabled={props.createConnectionMutation.isPending}
              type="submit"
              className="bg-[#004080] text-[14px] text-white px-6 py-3 rounded-[8px] hover:bg-[#004080]/80 cursor-pointer transition"
            >
              {props.createConnectionMutation.isPending
                ? 'Salvando...'
                : 'Salvar conexão'}
            </button>
          </div>
        </div>
      </form>

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
            columnWidths={[
              '15%', // Nome
              '12%', // Driver
              '15%', // Server
              '12%', // Database
              '10%', // Schema
              '15%', // Tipo de banco
              '12%', // Catalogo
              '9%' // Ações
            ]}
          >
            {props.getConnectionsQuery.data?.map((item, index) => (
              <tr
                key={index}
                className="hover:bg-gray-100 cursor-pointer"
                onClick={() => props.handleDirectToTable(String(item.id))}
              >
                <td className="px-4 py-3 truncate" title={item.nome}>
                  {item.nome}
                </td>
                <td className="px-4 py-3 truncate" title={item.driver}>
                  {item.driver}
                </td>
                <td className="px-4 py-3 truncate" title={item.server}>
                  {item.server}
                </td>
                <td className="px-4 py-3 truncate" title={item.database}>
                  {item.database}
                </td>
                <td className="px-4 py-3 truncate" title={item.db_schema}>
                  {item.db_schema}
                </td>
                <td className="px-4 py-3 truncate" title={item.tipo_banco}>
                  {item.tipo_banco}
                </td>
                <td className="px-4 py-3 truncate" title={item.catalogo}>
                  {item.catalogo}
                </td>
                <td
                  className="px-4 py-3 text-center"
                  onClick={(e) => e.stopPropagation()} // evita abrir a linha
                >
                  <ActionMenu
                    trigger={
                      <MdOutlineMoreVert
                        size={20}
                        className="mx-auto cursor-pointer"
                      />
                    }
                  >
                    <button
                      onClick={() =>
                        props.handleOpenModalEditConnection(String(item.id))
                      }
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => {
                        props.setConnectionIdSelected(String(item.id))
                        props.handleOpenModalConfirmation(
                          `Tem certeza que deseja apagar a conexao ${item.nome}?`
                        )
                      }}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      Apagar
                    </button>
                  </ActionMenu>
                </td>
              </tr>
            ))}
          </Table>
        </div>
      </div>
      {props.modalConfirmOpen && (
        <ModalConfirm
          question={props.textModal}
          loading={props.loadingModal}
          onConfirm={async () => {
            props.handleDirectToFunction({
              nameAction: 'delete-connection'
            })
          }}
          onCancel={() => props.handleCloseModalConfirmation()}
        />
      )}
      {props.modalEditOpen && (
        <ModalEdit
          onClose={() => props.setModalEditOpen(false)}
          data={props.getConnectionByIdQuery.data}
          onSave={(data) =>
            props.updateConnectionMutation.mutate({
              connectionId: props.connectionIdSelected,
              data
            })
          }
          loading={props.getConnectionByIdQuery.isLoading}
          loadingSave={props.updateConnectionMutation.isPending}
        />
      )}
    </PageComponent>
  )
}
