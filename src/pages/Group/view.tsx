import './style.scss'
import { useGroup } from './model'
import { PageComponent } from '../../components/page-component'
import {
  MdAccountBox,
  MdArrowBackIosNew,
  MdOutlineMoreVert,
  MdStorage
} from 'react-icons/md'
import { Table } from '../../components/ui/table'
import { ModalGrupoTabela } from './modal-grupo-tabela'
import { ModalGrupoUsuario } from './modal-grupo-usuario'
import { ActionMenu } from '../../components/ui/action-menu'
import { ModalConfirm } from '../../components/ui/modal-confirmation'
import { TableSkeleton, Skeleton } from '../../components/ui/skeleton'

export const GroupView = (props: ReturnType<typeof useGroup>) => {
  // Função para renderizar cada linha da tabela de tabelas
  const renderTableRow = (item: any) => (
    <tr key={item.tabela_id} className="hover:bg-gray-100">
      <td className="px-4 py-3 text-[#1E1E1E] font-regular text-[14px] border-b border-[#E4E4E7]">
        {item.tabela_nome}
      </td>
      <td className="px-4 py-3 text-[#1E1E1E] font-regular text-[14px] border-b border-[#E4E4E7]">
        {item.conexao_nome}
      </td>
      <td
        className="px-4 py-3 text-center border-b border-[#E4E4E7]"
        onClick={(e) => e.stopPropagation()}
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
            onClick={() => {
              props.setSelectedTableId(item.tabela_id.toString())
              props.handleOpenModalConfirmation(
                `Tem certeza que deseja desfazer a associação da tabela [${item.tabela_nome}]?`,
                { nameAction: 'dissociate-table' }
              )
            }}
            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
          >
            Desassociar
          </button>
        </ActionMenu>
      </td>
    </tr>
  )

  // Função para renderizar cada linha da tabela de usuários
  const renderUserRow = (item: any) => (
    <tr key={item.usuario_id} className="hover:bg-gray-100">
      <td className="px-4 py-3 text-[#1E1E1E] font-regular text-[14px] border-b border-[#E4E4E7]">
        {item.usuario_id}
      </td>
      <td className="px-4 py-3 text-[#1E1E1E] font-regular text-[14px] border-b border-[#E4E4E7]">
        {item.grupo_id}
      </td>
      <td
        className="px-4 py-3 text-center border-b border-[#E4E4E7]"
        onClick={(e) => e.stopPropagation()}
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
            onClick={() => {
              props.setSelectedUserId(item.usuario_id)
              props.handleOpenModalConfirmation(
                `Tem certeza que deseja desfazer a associação do usuário [${item.usuario_id}]?`,
                { nameAction: 'dissociate-user' }
              )
            }}
            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
          >
            Desassociar
          </button>
        </ActionMenu>
      </td>
    </tr>
  )
  if (props.getGroupIdQuery.isLoading || props.getGroupUsersQuery.isLoading) {
    return (
      <PageComponent topbarIcon={<MdStorage />} topbarTitle="Grupo">
        <div className="space-y-6">
          <div className="flex items-center gap-1">
            <Skeleton variant="circular" width="9px" height="9px" />
            <Skeleton width="60px" height="13px" />
          </div>
          <div className="mb-[35px] mt-[27px] flex items-center justify-between">
            <div className="flex items-center gap-[10px]">
              <Skeleton variant="circular" width="14px" height="14px" />
              <Skeleton width="200px" height="24px" />
            </div>
            <Skeleton width="150px" height="44px" />
          </div>
          <TableSkeleton
            headers={['Nome da tabela', 'Banco de dados ', '']}
            rows={5}
          />

          <div className="mb-[35px] mt-[60px] flex items-center justify-between">
            <div className="flex items-center gap-[10px]">
              <Skeleton variant="circular" width="14px" height="14px" />
              <Skeleton width="200px" height="24px" />
            </div>
            <Skeleton width="150px" height="44px" />
          </div>
          <TableSkeleton headers={['Nome do usuário', 'E-mail', '']} rows={5} />
        </div>
      </PageComponent>
    )
  }

  return (
    <PageComponent topbarIcon={<MdStorage />} topbarTitle="Grupo">
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
          <button
            className="text-[14px] px-6 py-3 text-white bg-[#004080] rounded-[12px]"
            onClick={() => props.handleControlModalAssociateTable()}
          >
            Associar tabelas
          </button>
        </div>
      </div>
      <Table 
        headers={['Nome da tabela', 'Banco de dados ', '']}
        // Frontend pagination props
        data={props.getGroupIdQuery.data || []}
        renderRow={renderTableRow}
        itemsPerPage={10}
        itemsPerPageOptions={[5, 10, 25, 50]}
        // Search configuration
        searchable={true}
        searchPlaceholder="Buscar por nome da tabela ou banco..."
        searchFields={['tabela_nome', 'conexao_nome']}
      >
        {/* Children vazio para frontend pagination */}
        <></>
      </Table>

      {/* Seção de Usuários */}
      <div className="mt-[50px] mb-[35px] flex items-center justify-between">
        <div className="flex items-center gap-[10px]">
          <MdAccountBox size={14} className="text-[#1D1D1D]" />
          <div className="text-[24px] font-medium text-[#1D1D1D]">
            Usuários Associados
          </div>
        </div>
        <div className="flex items-center gap-6">
          <button
            className="text-[14px] px-6 py-3 text-[#004080] bg-[#fff] border border-[#004080] rounded-[12px]"
            onClick={() => props.handleControlModalAssociateUser()}
          >
            Associar usuários
          </button>
        </div>
      </div>

      <Table 
        headers={['ID do Usuário', 'ID do Grupo', '']}
        // Frontend pagination props
        data={props.getGroupUsersQuery.data || []}
        renderRow={renderUserRow}
        itemsPerPage={10}
        itemsPerPageOptions={[5, 10, 25, 50]}
        // Search configuration
        searchable={true}
        searchPlaceholder="Buscar por ID do usuário..."
        searchFields={['usuario_id']}
      >
        {/* Children vazio para frontend pagination */}
        <></>
      </Table>

      {props.modalAssociateUserOpen && (
        <ModalGrupoUsuario
          onSave={(data) =>
            props.associateUserToGroupMutation.mutate(data.usuario_id)
          }
          onClose={() => props.handleControlModalAssociateUser()}
          loadingSave={props.associateUserToGroupMutation.isPending}
          loading={false}
        />
      )}
      {props.modalAssociateTableOpen && (
        <ModalGrupoTabela
          connections={props.getConnectionsQuery.data || []}
          tables={props.getAvailableTables()}
          onChangeConnection={(id) => props.setConnectionId(id)}
          onSave={(data) =>
            props.associateTableToGroupMutation.mutate(
              data.tabela_id.toString()
            )
          }
          onClose={() => props.handleControlModalAssociateTable()}
          loadingSave={props.associateTableToGroupMutation.isPending}
          loading={false}
        />
      )}
      {props.modalConfirmOpen && (
        <ModalConfirm
          question={props.textModal}
          loading={props.loadingModal}
          onConfirm={async () => {
            props.handleDirectToFunction()
          }}
          onCancel={() => props.handleCloseModalConfirmation()}
        />
      )}
    </PageComponent>
  )
}
