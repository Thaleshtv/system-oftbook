import './style.scss'
import { useAgentes } from './model'
import { PageComponent } from '../../components/page-component'
import {
  MdStorage,
  MdOutlineSettings,
  MdOutlineAutoAwesome,
  MdOutlineCheckBox,
  MdOutlineChat,
  MdOutlineInsights,
  MdOutlineBarChart,
  MdOutlineSmartToy
} from 'react-icons/md'
import { AiOutlineConsoleSql } from 'react-icons/ai'
import { ModalConfig } from './components/modal-config'
import { ModalPrompt } from './components/modal-prompt'
import { AgentCardSkeleton } from '../../components/ui/skeleton'

// Função para obter ícone baseado no nome do agente
const getIconForAgente = (nome: string) => {
  const nomeNormalizado = nome.toLowerCase()

  if (
    nomeNormalizado.includes('sql') ||
    nomeNormalizado.includes('construtor')
  ) {
    return <AiOutlineConsoleSql size={24} />
  }
  if (
    nomeNormalizado.includes('validador') ||
    nomeNormalizado.includes('valida')
  ) {
    return <MdOutlineCheckBox size={24} />
  }
  if (
    nomeNormalizado.includes('resposta') ||
    nomeNormalizado.includes('chat')
  ) {
    return <MdOutlineChat size={24} />
  }
  if (
    nomeNormalizado.includes('gráfico') ||
    nomeNormalizado.includes('grafico')
  ) {
    return <MdOutlineBarChart size={24} />
  }
  if (nomeNormalizado.includes('insight')) {
    return <MdOutlineInsights size={24} />
  }

  // Ícone padrão para agentes não categorizados
  return <MdOutlineSmartToy size={24} />
}

export const AgentesView = (props: ReturnType<typeof useAgentes>) => {
  if (props.loading) {
    return (
      <PageComponent topbarIcon={<MdStorage />} topbarTitle="Agentes">
        <div className="flex items-center gap-[18px] flex-wrap">
          {Array.from({ length: 6 }).map((_, index) => (
            <AgentCardSkeleton key={index} />
          ))}
        </div>
      </PageComponent>
    )
  }

  if (props.error) {
    return (
      <PageComponent topbarIcon={<MdStorage />} topbarTitle="Agentes">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-red-600">{props.error}</div>
        </div>
      </PageComponent>
    )
  }

  return (
    <PageComponent topbarIcon={<MdStorage />} topbarTitle="Agentes">
      <div className="flex items-center gap-[18px] flex-wrap">
        {props.agentes.length === 0 ? (
          <div className="w-full flex items-center justify-center h-64">
            <div className="text-lg text-gray-600">
              Nenhum agente encontrado
            </div>
          </div>
        ) : (
          props.agentes.map((agente) => (
            <div
              key={agente.id}
              className="min-w-[506px] h-[116px] rounded-[8px] border border-[#E4E4E7] px-[12px] py-[14px] flex flex-col justify-between"
            >
              <div className="flex items-center gap-[10px]">
                {getIconForAgente(agente.cod)}
                <span className="text-[18px] font-medium">{agente.cod}</span>
              </div>
              <div className="flex items-center gap-[10px] justify-between">
                <div className="text-sm text-gray-500">
                  Código: {agente.nome}
                </div>
                <div className="flex items-center gap-[10px]">
                  <button
                    onClick={() => {
                      props.setSelectedAgente(agente)
                      props.setModalPrompt(true)
                    }}
                  >
                    <MdOutlineAutoAwesome
                      size={28}
                      className="mr-3 text-[#000]/46"
                    />
                  </button>
                  <button
                    onClick={() => {
                      props.setModalConfig(true)
                    }}
                  >
                    <MdOutlineSettings size={28} className="text-[#000]/46" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      {props.modalConfig && (
        <ModalConfig
          onClose={() => props.setModalConfig(false)}
          onSave={() => {}}
        />
      )}
      {props.modalPrompt && (
        <ModalPrompt
          onClose={() => props.setModalPrompt(false)}
          agente={props.selectedAgente}
          onUpdatePrompt={props.updateAgentePrompt}
          isUpdating={props.updatingPrompt}
        />
      )}
    </PageComponent>
  )
}
