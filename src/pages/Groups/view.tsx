import './style.scss'
import { useGroups } from './model'
import { PageComponent } from '../../components/page-component'
import { MdOutlineMoreVert, MdStorage } from 'react-icons/md'
import { Table } from '../../components/ui/table'
import { ActionMenu } from '../../components/ui/action-menu'
import { ModalEditGroup } from './components/modal-edit'
import { ModalConfirm } from '../../components/ui/modal-confirmation'
import { ListPageSkeleton } from '../../components/ui/skeleton'

export const GroupsView = (props: ReturnType<typeof useGroups>) => {
  const { form, onSubmit } = props
  const { register, formState } = form
  const { errors } = formState

  // Função para renderizar cada linha da tabela
  const renderGroupRow = (item: any) => (
    <tr
      key={item.id}
      className="hover:bg-gray-100 cursor-pointer"
      onClick={() => props.handleDirectGroup(item.id.toString())}
    >
      <td className="px-4 py-3 text-[#1E1E1E] font-regular text-[14px] border-b border-[#E4E4E7]">
        {item.nome}
      </td>
      <td className="px-4 py-3 text-[#1E1E1E] font-regular text-[14px] border-b border-[#E4E4E7]">
        {item.qtd_tabelas}
      </td>
      <td className="px-4 py-3 text-[#1E1E1E] font-regular text-[14px] border-b border-[#E4E4E7]">
        {item.qtd_usuarios}
      </td>
      <td className="px-4 py-3 text-[#1E1E1E] font-regular text-[14px] border-b border-[#E4E4E7]">
        {item.ativa ? 'Sim' : 'Não'}
      </td>
      <td
        className="px-4 py-3 text-[#1E1E1E] font-regular text-[14px] border-b border-[#E4E4E7]"
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
              props.setSelectedGroupId(item.id.toString())
              props.setModalEditOpen(true)
            }}
            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
          >
            Editar
          </button>
          <button
            onClick={() => {
              props.setSelectedGroupId(item.id.toString())
              props.handleOpenModalConfirm(
                `Tem certeza que deseja apagar o grupo [${item.nome}]?`
              )
            }}
            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
          >
            Apagar
          </button>
        </ActionMenu>
      </td>
    </tr>
  )

  if (props.getGroupsQuery.isLoading) {
    return (
      <PageComponent topbarIcon={<MdStorage />} topbarTitle="Grupos">
        <ListPageSkeleton
          showForm={true}
          tableHeaders={[
            'Nome do grupos',
            'Qtd Tabelas',
            'Qtd Usuários',
            'Ativo',
            ''
          ]}
          tableRows={5}
        />
      </PageComponent>
    )
  }

  return (
    <PageComponent topbarIcon={<MdStorage />} topbarTitle="Grupos">
      <div className="mb-[35px] mt-[27px] flex items-center justify-between">
        <div className="flex items-center gap-[10px]">
          <MdStorage size={14} className="text-[#1D1D1D]" />
          <div className="text-[24px] font-medium text-[#1D1D1D]">
            Grupos encontrados
          </div>
        </div>
      </div>
      <form className="mb-[24px]" onSubmit={onSubmit}>
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 flex flex-col gap-2">
            <label
              htmlFor="nome"
              className="font-medium text-[14px] text-[#1E1E1E]"
            >
              Nome do grupo
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

          <div className="col-span-12 flex flex-col items-end gap-2">
            <button
              type="submit"
              disabled={props.createGroupMutation.isPending}
              className="bg-[#004080] text-[14px] text-white px-6 py-3 rounded-[8px] hover:bg-[#004080]/80 cursor-pointer transition"
            >
              {props.createGroupMutation.isPending
                ? 'Criando...'
                : 'Criar grupo'}
            </button>
          </div>
        </div>
      </form>
      <Table
        headers={['Nome do grupos', 'Qtd Tabelas', 'Qtd Usuários', 'Ativo', '']}
        // Frontend pagination props
        data={props.getGroupsQuery.data || []}
        renderRow={renderGroupRow}
        itemsPerPage={10}
        itemsPerPageOptions={[5, 10, 25, 50]}
        // Search configuration
        searchable={true}
        searchPlaceholder="Buscar por nome do grupo..."
        searchFields={['nome']}
      >
        {/* Children vazio para frontend pagination */}
        <></>
      </Table>
      {props.modalConfirmOpen && (
        <ModalConfirm
          onCancel={() => props.setModalConfirmOpen(false)}
          onConfirm={async () => {
            props.deleteGroupMutation.mutate(props.selectedGroupId)
          }}
          question={props.textModalConfirm}
          loading={props.deleteGroupMutation.isPending}
        />
      )}
      {props.modalEditOpen && (
        <ModalEditGroup
          onClose={() => props.setModalEditOpen(false)}
          onSave={(data) =>
            props.updateGroupMutation.mutate({
              groupId: props.selectedGroupId,
              data
            })
          }
          data={props.getGroupDetailQuery.data}
          loading={props.getGroupDetailQuery.isLoading}
          loadingSave={props.updateGroupMutation.isPending}
        />
      )}
    </PageComponent>
  )
}
