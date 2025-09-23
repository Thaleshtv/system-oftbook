import './style.scss'
import { useGroup } from './model'
import { PageComponent } from '../../components/page-component'
import {
  MdAccountBox,
  MdArrowBackIosNew,
  MdOutlineAccountCircle,
  MdOutlineMoreVert,
  MdStorage
} from 'react-icons/md'
import { Table } from '../../components/ui/table'
import { ModalGrupoTabela } from './modal-grupo-tabela'
import { ModalGrupoUsuario } from './modal-grupo-usuario'
import { ActionMenu } from '../../components/ui/action-menu'
import { ModalConfirm } from '../../components/ui/modal-confirmation'

export const GroupView = (props: ReturnType<typeof useGroup>) => {
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
      <Table headers={['Nome da tabela', 'Banco de dados ', '']}>
        {props.getGroupIdQuery.data?.map((item, index) => (
          <tr key={index} className="hover:bg-gray-100">
            <td className="px-4 py-3 text-[#1E1E1E] font-regular text-[14px] border-b border-[#E4E4E7]">
              {item.tabela_nome}
            </td>
            <td className="px-4 py-3 text-[#1E1E1E] font-regular text-[14px] border-b border-[#E4E4E7]">
              {item.conexao_nome}
            </td>

            <td
              className="px-4 py-3 text-center border-b border-[#E4E4E7]"
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
        ))}
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

      <Table headers={['ID do Usuário', 'ID do Grupo', '']}>
        {props.getGroupUsersQuery.data?.map((item, index) => (
          <tr key={index} className="hover:bg-gray-100">
            <td className="px-4 py-3 text-[#1E1E1E] font-regular text-[14px] border-b border-[#E4E4E7]">
              {item.usuario_id}
            </td>
            <td className="px-4 py-3 text-[#1E1E1E] font-regular text-[14px] border-b border-[#E4E4E7]">
              {item.grupo_id}
            </td>
            <td
              className="px-4 py-3 text-center border-b border-[#E4E4E7]"
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
        ))}
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
