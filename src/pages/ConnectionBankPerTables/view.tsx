import './styles.scss'
import { useConnectionBankPerTables } from './model'
import { PageComponent } from '../../components/page-component'
import { MdArrowBackIosNew, MdOutlineMoreVert, MdStorage } from 'react-icons/md'
import { Table } from '../../components/ui/table'
import { ActionMenu } from '../../components/ui/action-menu'
import { ModalConfirm } from '../../components/ui/modal-confirmation'
import { ModalEditTable } from './components/modal-edit'
import { TableSkeleton, Skeleton } from '../../components/ui/skeleton'

export const ConnectionBankPerTablesView = (
  props: ReturnType<typeof useConnectionBankPerTables>
) => {
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
          <div className="w-[302px] h-[139px] px-[24px] py-[12px] bg-[#F0F0F042] rounded-[8px] border border-[#E4E4E7] flex flex-col justify-between">
            <Skeleton width="150px" height="15px" />
            <div className="flex items-center gap-1 justify-end">
              <Skeleton variant="circular" width="6px" height="6px" />
              <Skeleton width="30px" height="10px" />
            </div>
          </div>
          <div className="mb-[35px] mt-[60px] flex items-center justify-between">
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
        searchable={true}
        searchPlaceholder="Buscar por nome ou descrição da tabela..."
        onSearch={props.handleSearch}
      >
        {props.filteredTables?.map((item, index) => (
          <tr
            key={index}
            className="hover:bg-gray-100 cursor-pointer"
            onClick={() => props.handleDirectToColumn(item.id.toString())}
          >
            <td className="px-4 py-3 text-[#1E1E1E] font-regular text-[14px] border-b border-[#E4E4E7]">
              {item.nome}
            </td>
            <td className="px-4 py-3 text-[#1E1E1E] font-regular text-[14px] border-b border-[#E4E4E7]">
              {item.descricao}
            </td>
            <td className="px-4 py-3 text-[#1E1E1E] font-regular text-[14px] border-b border-[#E4E4E7]">
              {item.qtd_colunas}
            </td>
            <td className="px-4 py-3 text-[#1E1E1E] font-regular text-[12px] border-b border-[#E4E4E7]">
              {item.descricao ? (
                <span className="rounded-[26px] px-[10px] py-[4px] bg-[#02D909] text-white">
                  Sem pendências
                </span>
              ) : (
                <span className="rounded-[26px] px-[10px] py-[4px] bg-[#FB7373] text-white">
                  Pendência: {item.descricao ? item.descricao : '1'}
                </span>
              )}
            </td>
            <td className="px-4 py-3 text-[#1E1E1E] font-regular text-[14px] border-b border-[#E4E4E7]">
              SIM
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
        ))}
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
