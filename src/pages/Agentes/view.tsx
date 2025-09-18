import './style.scss'
import { useAgentes } from './model'
import { PageComponent } from '../../components/page-component'
import {
  MdStorage,
  MdOutlineSettings,
  MdOutlineAutoAwesome,
  MdOutlineCheck,
  MdOutlineCheckBox,
  MdOutlineChat,
  MdOutlineAddChart,
  MdOutlineInsights,
  MdOutlineBarChart
} from 'react-icons/md'
import { AiOutlineConsoleSql } from 'react-icons/ai'

export const AgentesView = (props: ReturnType<typeof useAgentes>) => {
  return (
    <PageComponent topbarIcon={<MdStorage />} topbarTitle="Agentes">
      <div className="flex items-center gap-[18px] flex-wrap">
        <div className="min-w-[506px] h-[116px] rounded-[8px] border border-[#E4E4E7] px-[12px] py-[14px] flex flex-col justify-between">
          <div className="flex items-center gap-[10px]">
            <AiOutlineConsoleSql size={24} />
            <span className="text-[18px] font-medium">
              Agente construtor SQL
            </span>
          </div>
          <div className="flex items-center gap-[10px] justify-end">
            <button>
              <MdOutlineAutoAwesome size={28} className="mr-3 text-[#000]/46" />
            </button>
            <button>
              <MdOutlineSettings size={28} className="text-[#000]/46" />
            </button>
          </div>
        </div>
        <div className="min-w-[506px] h-[116px] rounded-[8px] border border-[#E4E4E7] px-[12px] py-[14px] flex flex-col justify-between">
          <div className="flex items-center gap-[10px]">
            <MdOutlineCheckBox size={24} />
            <span className="text-[18px] font-medium">Agente validador</span>
          </div>
          <div className="flex items-center gap-[10px] justify-end">
            <button>
              <MdOutlineAutoAwesome size={28} className="mr-3 text-[#000]/46" />
            </button>
            <button>
              <MdOutlineSettings size={28} className="text-[#000]/46" />
            </button>
          </div>
        </div>
        <div className="min-w-[506px] h-[116px] rounded-[8px] border border-[#E4E4E7] px-[12px] py-[14px] flex flex-col justify-between">
          <div className="flex items-center gap-[10px]">
            <MdOutlineChat size={24} />
            <span className="text-[18px] font-medium">Agente de resposta</span>
          </div>
          <div className="flex items-center gap-[10px] justify-end">
            <button>
              <MdOutlineAutoAwesome size={28} className="mr-3 text-[#000]/46" />
            </button>
            <button>
              <MdOutlineSettings size={28} className="text-[#000]/46" />
            </button>
          </div>
        </div>

        <div className="min-w-[506px] h-[116px] rounded-[8px] border border-[#E4E4E7] px-[12px] py-[14px] flex flex-col justify-between">
          <div className="flex items-center gap-[10px]">
            <MdOutlineBarChart size={24} />
            <span className="text-[18px] font-medium">Agente de Gráficos</span>
          </div>
          <div className="flex items-center gap-[10px] justify-end">
            <button>
              <MdOutlineAutoAwesome size={28} className="mr-3 text-[#000]/46" />
            </button>
            <button>
              <MdOutlineSettings size={28} className="text-[#000]/46" />
            </button>
          </div>
        </div>
        <div className="min-w-[506px] h-[116px] rounded-[8px] border border-[#E4E4E7] px-[12px] py-[14px] flex flex-col justify-between">
          <div className="flex items-center gap-[10px]">
            <MdOutlineInsights size={24} />
            <span className="text-[18px] font-medium">Agente de Insights</span>
          </div>
          <div className="flex items-center gap-[10px] justify-end">
            <button>
              <MdOutlineAutoAwesome size={28} className="mr-3 text-[#000]/46" />
            </button>
            <button>
              <MdOutlineSettings size={28} className="text-[#000]/46" />
            </button>
          </div>
        </div>
      </div>
    </PageComponent>
  )
}
