import { useChat } from './model'
import { ChatPageComponent } from '../../components/chat-page-component'
import { useEffect, useRef } from 'react'
import {
  MdOutlineChat,
  MdOutlineSend,
  MdOutlineInsights,
  MdOutlineBarChart,
  MdOutlineLightbulb,
  MdThumbUp,
  MdThumbDown
} from 'react-icons/md'
import { GraphSkeleton, InsightSkeleton } from '../../components/ui/skeleton'
import { ChartComponent } from '../../components/ui/chart'
import { MarkdownRenderer } from '../../components/ui/markdown-renderer'

export const ChatView = (props: ReturnType<typeof useChat>) => {
  const {
    messages,
    currentMessage,
    setCurrentMessage,
    sendMessage,
    currentSessao,
    sessoes,
    pastas,
    graph,
    insight,
    isLoadingResponse,
    isLoadingInitialData,
    graphEnabled,
    setGraphEnabled,
    createNewSessao,
    selectSessao,
    archiveSessao,
    evaluateMessage
  } = props
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    sendMessage(currentMessage)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleCreateNewSession = () => {
    const sessionName = `Nova Sessão ${new Date().toLocaleDateString('pt-BR')}`
    createNewSessao(sessionName, 'Sessão criada automaticamente')
  }

  return (
    <ChatPageComponent
      topbarTitle={currentSessao ? `Chat - ${currentSessao.nome}` : 'Chat'}
      topbarIcon={<MdOutlineChat size={24} />}
      sessoes={sessoes}
      pastas={pastas}
      currentSessao={currentSessao}
      onSelectSessao={selectSessao}
      onCreateNewSessao={handleCreateNewSession}
      onArchiveSessao={archiveSessao}
      isLoadingInitialData={isLoadingInitialData}
    >
      <div className="h-full flex flex-col lg:flex-row">
        {/* Coluna esquerda: Gráficos e Insights - com padding */}
        <div className="flex-1 p-6 flex flex-col gap-6 lg:flex-col md:flex-row md:h-[300px] lg:h-auto">
          {/* Seção de Gráficos */}
          <div className="flex-1 bg-white rounded-2xl border border-gray-200 flex flex-col overflow-hidden min-h-0 min-h-[250px] md:min-h-0">
            <div className="flex-1 p-6 flex flex-col gap-4 overflow-y-auto">
              {isLoadingResponse && !graph ? (
                <GraphSkeleton />
              ) : graph ? (
                <div className="flex-1 flex flex-col gap-4">
                  <h3 className="text-sm font-medium text-gray-700 m-0">
                    Gráfico Gerado
                  </h3>
                  <div className="flex-1 bg-gray-50 rounded-xl p-4 overflow-auto">
                    <ChartComponent chartData={graph} />
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center gap-3 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 min-h-[200px]">
                  <MdOutlineBarChart size={48} />
                  <span className="text-sm">Gráfico será exibido aqui</span>
                  <span className="text-xs text-center px-4">
                    Faça uma pergunta que requeira visualização de dados
                  </span>
                </div>
              )}
            </div>
          </div>{' '}
          {/* Seção de Insights */}
          <div className="flex-1 bg-white rounded-2xl border border-gray-200 flex flex-col overflow-hidden min-h-0 min-h-[250px] md:min-h-0">
            <div className="flex-1 p-6 flex flex-col gap-4 overflow-y-auto">
              <h3 className="text-sm font-medium text-gray-700 m-0">
                Insights
              </h3>
              {isLoadingResponse && !insight ? (
                <InsightSkeleton />
              ) : insight ? (
                <div className="flex-1 bg-blue-50 border border-blue-200 rounded-xl p-4 overflow-auto">
                  <MarkdownRenderer 
                    content={insight} 
                    variant="insight"
                    className="text-sm text-blue-800 leading-relaxed"
                  />
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center gap-3 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 min-h-[200px]">
                  <MdOutlineInsights size={48} />
                  <span className="text-sm">Insights serão exibidos aqui</span>
                  <span className="text-xs text-center px-4">
                    Os insights aparecerão automaticamente com as respostas da
                    IA
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Coluna direita: Chat - sem padding superior/inferior, com borda esquerda */}
        <div className="flex-1 border-t border-gray-200 lg:border-t-0 lg:border-l lg:border-gray-200 flex flex-col min-h-0 h-[400px] md:h-[500px] lg:h-auto">
          <div className="h-full flex flex-col bg-white lg:rounded-r-2xl overflow-hidden">
            {/* Área de mensagens */}
            <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-4 min-h-0">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex w-full ${
                    message.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.sender === 'user' ? (
                    <div className="flex flex-col gap-2 max-w-[70%] items-end">
                      {/* Nome do usuário */}
                      <span className="text-xs text-gray-500">Você</span>
                      {/* Balão do usuário */}
                      <div
                        className="bg-blue-800 text-white px-4 py-3"
                        style={{
                          borderRadius: '12px 0 12px 12px'
                        }}
                      >
                        <p className="text-sm leading-normal m-0">
                          {message.text}
                        </p>
                      </div>
                      {/* Horário fora do balão - canto esquerdo */}
                      <span className="text-xs opacity-70 text-gray-500 self-start">
                        {message.timestamp.toLocaleTimeString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2 max-w-[70%]">
                      {/* Nome da IA */}
                      <span className="text-xs text-gray-500 ">
                        Inteligência Artificial
                      </span>
                      {/* Balão da IA */}
                      <div className="flex flex-col gap-2">
                        <div
                          className="border border-[#E4E4E7] text-gray-800 px-4 py-3"
                          style={{
                            backgroundColor: 'rgba(230, 230, 230, 0.26)',
                            borderRadius: '0 12px 12px 12px'
                          }}
                        >
                          <MarkdownRenderer 
                            content={message.text} 
                            variant="chat"
                            className="text-sm leading-normal m-0"
                          />
                        </div>
                        {/* Botões de avaliação para mensagens do bot */}
                        <div className="flex items-center gap-2 ml-2">
                          <button
                            onClick={() =>
                              evaluateMessage(message.id, 'positive')
                            }
                            className={`p-1 rounded-full transition-colors ${
                              message.avaliacao === 'positive'
                                ? 'bg-green-100 text-green-600'
                                : 'text-gray-400 hover:text-green-600 hover:bg-green-50'
                            }`}
                            title="Avaliar positivamente"
                          >
                            <MdThumbUp size={16} />
                          </button>
                          <button
                            onClick={() =>
                              evaluateMessage(message.id, 'negative')
                            }
                            className={`p-1 rounded-full transition-colors ${
                              message.avaliacao === 'negative'
                                ? 'bg-red-100 text-red-600'
                                : 'text-gray-400 hover:text-red-600 hover:bg-red-50'
                            }`}
                            title="Avaliar negativamente"
                          >
                            <MdThumbDown size={16} />
                          </button>
                        </div>
                      </div>
                      {/* Horário fora do balão - canto direito */}
                      <span className="text-xs opacity-70 text-gray-500 self-end mr-4">
                        {message.timestamp.toLocaleTimeString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  )}
                </div>
              ))}
              {/* Indicador de carregamento */}
              {isLoadingResponse && (
                <div className="flex justify-start">
                  <div className="flex flex-col gap-2 max-w-[70%]">
                    <span className="text-xs text-gray-500">
                      Inteligência Artificial
                    </span>
                    <div
                      className="border border-[#E4E4E7] text-gray-800 px-4 py-3"
                      style={{
                        backgroundColor: 'rgba(230, 230, 230, 0.26)',
                        borderRadius: '0 12px 12px 12px'
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: '0.1s' }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: '0.2s' }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">
                          Pensando...
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {/* Elemento invisível para scroll automático */}
              <div ref={messagesEndRef} />
            </div>

            {/* Área de input - novo design */}
            <div className="p-6">
              <div
                className="flex items-center gap-3 px-4 py-3 rounded-2xl border border-[#E4E4E7]"
                style={{ backgroundColor: 'rgba(217, 217, 217, 0.12)' }}
              >
                {/* Ícone da lâmpada - clicável para toggle do graph */}
                <button
                  onClick={() => setGraphEnabled(!graphEnabled)}
                  className={`flex-shrink-0 p-1 rounded-full transition-all duration-200 ${
                    graphEnabled
                      ? 'text-yellow-500 bg-yellow-50 shadow-lg'
                      : 'text-gray-400 hover:text-yellow-500'
                  }`}
                  title={`${
                    graphEnabled ? 'Desabilitar' : 'Habilitar'
                  } geração de gráficos e insights`}
                >
                  <MdOutlineLightbulb
                    size={20}
                    className={`transition-all duration-200 ${
                      graphEnabled ? 'transform scale-110' : ''
                    }`}
                  />
                </button>

                {/* Input */}
                <input
                  type="text"
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Digite a mensagem"
                  className="flex-1 bg-transparent border-none outline-none text-sm text-gray-800 placeholder:text-gray-500"
                />

                {/* Ícone de enviar */}
                <button
                  onClick={handleSendMessage}
                  disabled={!currentMessage.trim() || isLoadingResponse}
                  className="flex-shrink-0 p-1 bg-transparent border-none cursor-pointer transition-colors duration-200 disabled:cursor-not-allowed"
                >
                  <MdOutlineSend
                    size={20}
                    className={`${
                      !currentMessage.trim() || isLoadingResponse
                        ? 'text-gray-400'
                        : 'text-[#004080]'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ChatPageComponent>
  )
}
