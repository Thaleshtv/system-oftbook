import { PageComponent } from '../../components/page-component'
import { useArquivos } from './model'
import { ModalUpload } from './components/modal-upload'
import { ModalCreateFolder } from './components/modal-create-folder'
import {
  HiOutlineSearch,
  HiOutlineFolder,
  HiOutlineDocument,
  HiOutlineUpload,
  HiOutlineChevronLeft,
  HiOutlinePlus,
  HiOutlineEye,
  HiOutlineTrash,
  HiOutlineDownload
} from 'react-icons/hi'

export const ArquivosView = (props: ReturnType<typeof useArquivos>) => {
  return (
    <PageComponent title="Arquivos">
      <div className="grid grid-cols-12 gap-[27px] h-[40px]">
        <div className="relative col-span-4">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <HiOutlineSearch size={20} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Pesquisar"
            className="w-full pl-10 pr-4 py-2 border border-[#D9D9D9] rounded-[16px] focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
        </div>
        <div className="col-span-6"></div>
        <div className="col-span-2 flex justify-end">
          <button
            onClick={props.handleOpenUploadModal}
            className="flex items-center gap-[12px] py-[10px] px-[24px] bg-[#0F0A49] text-white rounded-[16px] hover:bg-[#0F0A49]/80 transition-colors border border-[#D9D9D9] w-fit"
          >
            <span className="text-[14px] font-medium leading-[20px] tracking-[-0.28px] whitespace-nowrap">
              Fazer Upload
            </span>
            <HiOutlineUpload size={12} />
          </button>
        </div>

        {/* Breadcrumb quando está dentro de uma pasta */}
        {props.currentPath && (
          <div className="col-span-12">
            <div className="flex items-center gap-[8px]">
              <button
                onClick={props.navigateBack}
                className="flex items-center gap-[4px] text-[#0F0A49] text-[13px] font-medium hover:underline"
              >
                <HiOutlineChevronLeft size={16} />
                Voltar
              </button>
              <span className="text-[#979797] text-[13px]">
                / {props.currentPath}
              </span>
            </div>
          </div>
        )}

        {/* Seção de Pastas - só mostra na raiz */}
        {!props.currentPath && (
          <div className="col-span-12">
            <div className="flex flex-col gap-[12px]">
              <div className="flex items-center justify-between">
                <div className="text-[#6C7074] font-medium text-[13px]">
                  Pastas
                </div>
                <button
                  onClick={props.handleOpenCreateFolderModal}
                  className="flex items-center gap-[6px] text-[#0F0A49] text-[12px] font-medium hover:underline"
                >
                  <HiOutlinePlus size={14} />
                  Nova Pasta
                </button>
              </div>
              {props.isLoading ? (
                <div className="flex gap-[12px] flex-wrap">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-[128px] h-[48px] bg-[#F5F5F5] rounded-[6px] animate-pulse"
                    />
                  ))}
                </div>
              ) : props.folders.length > 0 ? (
                <div className="flex gap-[12px] flex-wrap">
                  {props.folders.map((folder) => {
                    // Remove a barra final do nome da pasta se existir
                    const folderName = folder.name.endsWith('/')
                      ? folder.name.slice(0, -1)
                      : folder.name

                    return (
                      <button
                        key={folder.name}
                        onClick={() => {
                          console.log('Folder clicked:', folder)
                          console.log('Current path:', props.currentPath)
                          console.log('Folder name:', folderName)

                          // Se folderName já contém o caminho completo, usa ele diretamente
                          const newPath = folderName
                          console.log('New path:', newPath)
                          props.navigateToFolder(newPath)
                        }}
                        className="w-[128px] h-[48px] border border-[#DADCE0] rounded-[6px] hover:bg-[#F5F5F5] transition-colors"
                      >
                        <div className="flex gap-[16px] items-center justify-center h-full">
                          <HiOutlineFolder
                            size={20}
                            className="text-[#5F6367]"
                          />
                          <div className="text-[13px] font-semibold truncate max-w-[70px]">
                            {folderName}
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              ) : (
                <div className="text-[#979797] text-[14px]">
                  Nenhuma pasta encontrada
                </div>
              )}
            </div>
          </div>
        )}
        <div className="col-span-12">
          <div className="flex flex-col gap-[12px]">
            <div className="text-[#6C7074] font-medium text-[13px]">
              Arquivos
            </div>
            {props.isLoading ? (
              <div className="flex gap-[12px] flex-wrap">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="w-[209px] h-[196px] bg-[#F5F5F5] rounded-[6px] animate-pulse"
                  />
                ))}
              </div>
            ) : props.arquivos.length > 0 ? (
              <div className="flex gap-[12px] flex-wrap">
                {props.arquivos.map((arquivo) => {
                  const isImage = /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(
                    arquivo.file_name
                  )
                  const isPdf = /\.pdf$/i.test(arquivo.file_name)

                  return (
                    <div
                      key={arquivo.file_name}
                      className="w-[209px] h-[196px] border border-[#DADCE0] rounded-[6px] flex flex-col overflow-hidden hover:shadow-md transition-shadow group cursor-pointer"
                      onClick={() => window.open(arquivo.signed_url, '_blank')}
                    >
                      {/* Preview Area */}
                      <div className="flex-1 bg-[#F8F9FA] flex items-center justify-center relative">
                        {isImage ? (
                          <img
                            src={arquivo.signed_url}
                            alt={arquivo.file_name}
                            className="max-w-full max-h-full object-contain"
                          />
                        ) : (
                          <div className="flex flex-col items-center gap-2">
                            <HiOutlineDocument
                              size={48}
                              className="text-[#5F6367]"
                            />
                            <span className="text-[10px] text-[#979797] uppercase">
                              {isPdf
                                ? 'PDF'
                                : arquivo.file_name.split('.').pop()}
                            </span>
                          </div>
                        )}

                        {/* Action buttons on hover */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <a
                            href={arquivo.signed_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
                            title="Visualizar"
                          >
                            <HiOutlineEye
                              size={16}
                              className="text-[#0F0A49]"
                            />
                          </a>
                          <a
                            href={arquivo.signed_url}
                            download={arquivo.file_name}
                            onClick={(e) => e.stopPropagation()}
                            className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
                            title="Baixar"
                          >
                            <HiOutlineDownload
                              size={16}
                              className="text-[#0F0A49]"
                            />
                          </a>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              props.deleteArquivo(arquivo.file_name)
                            }}
                            className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-red-100 transition-colors"
                            title="Deletar"
                          >
                            <HiOutlineTrash
                              size={16}
                              className="text-red-600"
                            />
                          </button>
                        </div>
                      </div>

                      {/* File info */}
                      <div className="h-[40px] gap-[6px] flex items-center justify-start px-[12px] bg-white border-t border-[#DADCE0]">
                        <HiOutlineDocument
                          size={16}
                          className="text-[#5F6367]"
                        />
                        <div
                          className="text-[11px] font-medium text-[#5F6367] truncate"
                          title={arquivo.file_name}
                        >
                          {arquivo.file_name}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-[#979797] text-[14px]">
                Nenhum arquivo encontrado
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Upload */}
      {props.showUploadModal && (
        <ModalUpload
          onClose={props.handleCloseUploadModal}
          onConfirm={props.uploadArquivo}
          loading={props.isLoading}
        />
      )}

      {/* Modal de Criar Pasta */}
      {props.showCreateFolderModal && (
        <ModalCreateFolder
          onClose={props.handleCloseCreateFolderModal}
          onConfirm={props.createFolder}
          loading={props.isLoading}
        />
      )}
    </PageComponent>
  )
}
