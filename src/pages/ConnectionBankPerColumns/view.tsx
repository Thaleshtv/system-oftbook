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
import { ActionMenu } from '../../components/ui/action-menu'
import { TableSkeleton, Skeleton } from '../../components/ui/skeleton'
import { ModalEditColumn } from './components/modal-edit-column'

export const ConnectionBankPerColumnsView = (
  props: ReturnType<typeof useConnectionBankPerColumns>
) => {
  if (
    props.getColumnsQuery.isLoading ||
    props.getTableByIdQuery.isLoading ||
    props.getConnectionByIdQuery.isLoading
  ) {
    return (
      <PageComponent topbarIcon={<MdStorage />} topbarTitle="Carregando...">
        <div className="space-y-6">
          <div className="flex items-center gap-1">
            <Skeleton variant="circular" width="9px" height="9px" />
            <Skeleton width="60px" height="13px" />
          </div>
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-3">
              <div className="w-full h-[139px] px-[24px] py-[12px] bg-[#F0F0F042] rounded-[8px] border border-[#E4E4E7] flex flex-col justify-between">
                <Skeleton width="150px" height="15px" />
                <div className="flex items-center gap-1 justify-end">
                  <Skeleton variant="circular" width="6px" height="6px" />
                  <Skeleton width="30px" height="10px" />
                </div>
              </div>
            </div>
            <div className="col-span-3">
              <div className="w-full h-[139px] px-[24px] py-[12px] bg-[#F0F0F042] rounded-[8px] border border-[#E4E4E7] flex flex-col justify-between">
                <Skeleton width="150px" height="15px" />
                <div className="flex items-center gap-1 justify-end">
                  <Skeleton variant="circular" width="6px" height="6px" />
                  <Skeleton width="30px" height="10px" />
                </div>
              </div>
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
              'Nome da coluna',
              'Descrição',
              'Tipo da coluna',
              'Pendências',
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
      topbarTitle={`Tabela ${props.getTableByIdQuery.data?.nome} | Conexao ${props.getConnectionByIdQuery.data?.nome}`}
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
          ''
        ]}
      >
        {props.getColumnsQuery.data?.map((item, index) => (
          <tr key={index} className="hover:bg-gray-100s ">
            <td className="px-4 py-3 text-[#1E1E1E] font-regular text-[14px] border-b border-[#E4E4E7]">
              {item.nome}
            </td>
            <td className="px-4 py-3 text-[#1E1E1E] font-regular text-[14px] border-b border-[#E4E4E7]">
              {item.descricao}
            </td>
            <td className="px-4 py-3 text-[#1E1E1E] font-regular text-[14px] border-b border-[#E4E4E7]">
              {item.tipo}
            </td>
            {item.descricao ? (
              <span className="rounded-[26px] px-[10px] py-[4px] bg-[#02D909] text-white">
                Sem pendências
              </span>
            ) : (
              <span className="rounded-[26px] px-[10px] py-[4px] bg-[#FB7373] text-white">
                Pendência: {item.descricao ? item.descricao : '1'}
              </span>
            )}

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
                    props.setSelectedColumnId(item.id.toString())
                  }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                >
                  Editar
                </button>
              </ActionMenu>
            </td>
          </tr>
        ))}
      </Table>
      {props.modalEditOpen && (
        <ModalEditColumn
          data={props.getColumnByIdQuery.data}
          onClose={() => props.setModalEditOpen(false)}
          onSave={props.handleEditColumn}
          loading={props.getColumnByIdQuery.isLoading}
          loadingSave={props.updateColumnMutation.isPending}
        />
      )}
    </PageComponent>
  )
}
