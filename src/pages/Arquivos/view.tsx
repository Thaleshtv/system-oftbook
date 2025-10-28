import { PageComponent } from '../../components/page-component'
import { useArquivos } from './model'
import {
  HiOutlineSearch,
  HiOutlineFolder,
  HiOutlineDocument,
  HiOutlineCloudUpload,
  HiOutlineUpload
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
          <button className="flex items-center gap-2 py-[10px] px-[24px] bg-[#0F0A49] text-white rounded-[16px] hover:bg-[#0F0A49]/80  transition-colors">
            <span className="text-[14px] font-medium">Fazer upload</span>
            <HiOutlineUpload size={12} />
          </button>
        </div>
        <div className="col-span-12">
          <div className="flex flex-col gap-[12px]">
            <div className="text-[#6C7074] font-medium text-[13px]">Pastas</div>
            <div className="flex gap-[12px]">
              <div className="w-[128px] h-[48px] border border-[#DADCE0] rounded-[6px]">
                <div className="flex gap-[16px] items-center justify-center h-full">
                  <HiOutlineFolder size={20} className="text-[#5F6367]" />
                  <div className="text-[13px] font-semibold">Pasta 1</div>
                </div>
              </div>
              <div className="w-[128px] h-[48px] border border-[#DADCE0] rounded-[6px]">
                <div className="flex gap-[16px] items-center justify-center h-full">
                  <HiOutlineFolder size={20} className="text-[#5F6367]" />
                  <div className="text-[13px] font-semibold">Pasta 1</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-12">
          <div className="flex flex-col gap-[12px]">
            <div className="text-[#6C7074] font-medium text-[13px]">
              Arquivos
            </div>
            <div className="flex gap-[12px]">
              <div className="w-[209px] h-[196px] border border-[#DADCE0] rounded-[6px] flex flex-col">
                <div className="flex-1"></div>
                <div className="h-[40px] gap-[6px] flex items-center justify-start px-[12px]">
                  <HiOutlineDocument size={20} className="text-[#5F6367]" />
                  <div className="text-[12px] font-medium text-[#5F6367] truncate">
                    documento.pdf
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageComponent>
  )
}
