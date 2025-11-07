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
  HiOutlinePlus
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
                className="flex items-center gap-[4px] text-[#1849D6] text-[13px] font-medium hover:underline"
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
                  className="flex items-center gap-[6px] text-[#1849D6] text-[12px] font-medium hover:underline"
                >
                  <HiOutlinePlus size={14} />
                  Nova Pasta
                </button>
              </div>
              {props.isLoading ? (
                <div className="text-[#979797] text-[14px]">
                  Carregando pastas...
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
                          <HiOutlineFolder size={20} className="text-[#5F6367]" />
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
              <div className="text-[#979797] text-[14px]">
                Carregando arquivos...
              </div>
            ) : props.arquivos.length > 0 ? (
              <div className="flex gap-[12px] flex-wrap">
                {props.arquivos.map((arquivo) => (
                  <div
                    key={arquivo.s3_key}
                    className="w-[209px] h-[196px] border border-[#DADCE0] rounded-[6px] flex flex-col"
                  >
                    <div className="flex-1"></div>
                    <div className="h-[40px] gap-[6px] flex items-center justify-start px-[12px]">
                      <HiOutlineDocument size={20} className="text-[#5F6367]" />
                      <div className="text-[12px] font-medium text-[#5F6367] truncate">
                        {arquivo.file_name}
                      </div>
                    </div>
                  </div>
                ))}
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
