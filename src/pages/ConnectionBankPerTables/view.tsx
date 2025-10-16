import './styles.scss'
import { useConnectionBankPerTables } from './model'
import { PageComponent } from '../../components/page-component'
import { MdArrowBackIosNew, MdOutlineMoreVert, MdStorage } from 'react-icons/md'
import { Table } from '../../components/ui/table'
import { ActionMenu } from '../../components/ui/action-menu'
import { ModalConfirm } from '../../components/ui/modal-confirmation'
import { ModalEditTable } from './components/modal-edit'
import { TableSkeleton, Skeleton } from '../../components/ui/skeleton'
import { ITableResponse } from '../../services/tables'

type SortableHeader = {
  label: string
  sortKey?: string
}

export const ConnectionBankPerTablesView = (
  props: ReturnType<typeof useConnectionBankPerTables>
) => {
  // Wrapper para a função de ordenação
  const handleSortWrapper = (field: string) => {
    if (field === 'qtd_colunas' || field === 'pendencias' || field === 'ativo') {
      props.handleSort(field as 'qtd_colunas' | 'pendencias' | 'ativo')
    }
  }

  // Definir headers com tipos explícitos
  const tableHeaders: (string | SortableHeader)[] = [
    'Nome da tabela',
    'Descrição ',
    { label: 'Qtd Colunas', sortKey: 'qtd_colunas' },
    { label: 'Pendências ', sortKey: 'pendencias' },
    { label: 'Ativa', sortKey: 'ativo' },
    'Ação'
  ]

  // Função para renderizar cada linha da tabela
  const renderTableRow = (item: ITableResponse) => (
    <tr
      key={item.id}
      className="hover:bg-gray-100 cursor-pointer"
      onClick={() => props.handleDirectToColumn(item.id.toString())}
    >
      <td className="px-4 py-3 text-[#1E1E1E] font-regular text-[14px] border-b border-[#E4E4E7]">
        <div className="truncate" title={item.nome}>
          {item.nome}
        </div>
      </td>
      <td className="px-4 py-3 text-[#1E1E1E] font-regular text-[14px] border-b border-[#E4E4E7]">
        <div className="truncate" title={item.descricao || ''}>
          {item.descricao || 'Sem descrição'}
        </div>
      </td>
      <td className="px-4 py-3 text-[#1E1E1E] font-regular text-[14px] border-b border-[#E4E4E7]">
        {item.qtd_colunas}
      </td>
      <td className="px-4 py-3 text-[#1E1E1E] font-regular text-[12px] border-b border-[#E4E4E7]">
        {item.pendencias === 0 ? (
          <span className="rounded-[26px] px-[10px] py-[4px] bg-[#02D909] text-white">
            Sem pendências
          </span>
        ) : (
          <span className="rounded-[26px] px-[10px] py-[4px] bg-[#FB7373] text-white">
            Pendência: {item.pendencias}
          </span>
        )}
      </td>
      <td className="px-4 py-3 text-[#1E1E1E] font-regular text-[14px] border-b border-[#E4E4E7]">
        {item.descricao ? 'SIM' : 'NÃO'}
      </td>
      <td
        className="px-4 py-3 text-[#1E1E1E] font-regular text-[14px] border-b border-[#E4E4E7]"
        onClick={(e) => e.stopPropagation()}
      >
        <ActionMenu
          trigger={
            <MdOutlineMoreVert size={20} className="mx-auto cursor-pointer" />
          }
        >
          <button
            onClick={() => {
              props.setModalEditOpen(true)
              props.setSelectedTableId(item.id.toString())
            }}
            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
          >
            Editar
          </button>
          <button
            onClick={() => {
              props.setSelectedTableId(item.id.toString())
              props.handleOpenModalConfirm(
                `Tem certeza que deseja apagar a tabela [${item.nome}] ?`
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
  if (
    props.getTablesQuery.isLoading ||
    props.getConnectionByIdQuery.isLoading
  ) {
    return (
      <PageComponent topbarIcon={<MdStorage />} topbarTitle="Carregando...">
        <div className="space-y-6">
          <div className="flex items-center gap-1">
            <Skeleton variant="circular" width="9px" height="9px" />
            <Skeleton width="60px" height="13px" />
          </div>
          <div className="mb-[35px] mt-[24px] flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Skeleton variant="circular" width="14px" height="14px" />
              <Skeleton width="200px" height="24px" />
            </div>
            <Skeleton width="150px" height="12px" />
          </div>
          <TableSkeleton
            headers={[
              'Nome da tabela',
              'Descrição ',
              'Qtd Colunas',
              'Pendências ',
              'Ativa',
              'Ação'
            ]}
            rows={5}
          />
        </div>
      </PageComponent>
    )
  }

  return (
    <PageComponent
      topbarIcon={<MdStorage />}
      topbarTitle={`Conexão: [${props.getConnectionByIdQuery.data?.nome}]`}
    >
      <button
        onClick={props.handleBack}
        className="flex items-center gap-1 cursor-pointer text-[13px] font-medium text-[#121623]"
      >
        <MdArrowBackIosNew size={9} />
        Voltar
      </button>
      <div className="mb-[35px] mt-[24px] flex items-center justify-between">
        <div className="flex items-center gap-1">
          <MdStorage size={14} className="text-[#1D1D1D]" />
          <div className="text-[24px] font-medium text-[#1D1D1D]">
            Tabelas encontradas
          </div>
        </div>
        <div className="text-[12px] text-[#6C6C6C]">Ativar/Desativar todas</div>
      </div>
      <Table
        headers={tableHeaders}
        columnWidths={['20%', '30%', '12%', '18%', '8%', '12%']}
        // Frontend pagination props
        data={props.sortedTables || []}
        renderRow={renderTableRow}
        itemsPerPage={10}
        itemsPerPageOptions={[5, 10, 25, 50]}
        // Search configuration
        searchable={true}
        searchPlaceholder="Buscar por nome ou descrição da tabela..."
        searchFields={['nome', 'descricao']}
        // Sorting configuration
        sortField={props.sortField}
        sortDirection={props.sortDirection}
        onSort={handleSortWrapper}
      >
        {/* Children vazio para frontend pagination */}
        <></>
      </Table>
      {props.modalConfirmOpen && (
        <ModalConfirm
          onCancel={() => props.setModalConfirmOpen(false)}
          onConfirm={async () => {
            props.deleteTableMutation.mutate(props.selectedTableId)
          }}
          question={props.textModalConfirm}
          loading={props.deleteTableMutation.isPending}
        />
      )}

      {props.modalEditOpen && (
        <ModalEditTable
          onClose={() => props.setModalEditOpen(false)}
          data={props.getTableByIdQuery.data}
          onSave={(data) =>
            props.updateTableMutation.mutate({
              tableId: props.selectedTableId,
              data
            })
          }
          loading={props.getTableByIdQuery.isLoading}
          loadingSave={props.updateTableMutation.isPending}
        />
      )}
    </PageComponent>
  )
}
