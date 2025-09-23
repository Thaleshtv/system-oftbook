import { useChat } from './model'
import { ChatPageComponent } from '../../components/chat-page-component'
import { useEffect, useRef } from 'react'
import {
  MdOutlineChat,
  MdOutlineSend,
  MdOutlineInsights,
  MdOutlineBarChart,
  MdOutlineLightbulb
} from 'react-icons/md'

export const ChatView = (props: ReturnType<typeof useChat>) => {
  const { messages, currentMessage, setCurrentMessage, sendMessage } = props
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

  return (
    <ChatPageComponent
      topbarTitle="Chat"
      topbarIcon={<MdOutlineChat size={24} />}
    >
      <div className="h-full flex flex-col lg:flex-row">
        {/* Coluna esquerda: Gráficos e Insights - com padding */}
        <div className="flex-1 p-6 flex flex-col gap-6 lg:flex-col md:flex-row md:h-[300px] lg:h-auto">
          {/* Seção de Gráficos */}
          <div className="flex-1 bg-white rounded-2xl border border-gray-200 flex flex-col overflow-hidden min-h-0 min-h-[250px] md:min-h-0">
            <div className="flex-1 p-6 flex flex-col gap-4 overflow-y-auto">
              {/* Placeholder para gráficos */}
              <div className="flex-1 flex flex-col items-center justify-center gap-3 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 min-h-[200px]">
                <MdOutlineBarChart size={48} />
                <span className="text-sm">Gráfico será exibido aqui</span>
              </div>
            </div>
          </div>

          {/* Seção de Insights */}
          <div className="flex-1 bg-white rounded-2xl border border-gray-200 flex flex-col overflow-hidden min-h-0 min-h-[250px] md:min-h-0">
            <div className="flex-1 p-6 flex flex-col gap-4 overflow-y-auto">
              {/* Título simples para insights */}
              <h3 className="text-sm font-medium text-gray-700 m-0">
                Insights
              </h3>
              {/* Placeholder para insights */}
              <div className="flex-1 flex flex-col items-center justify-center gap-3 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 min-h-[200px]">
                <MdOutlineInsights size={48} />
                <span className="text-sm">Insights serão exibidos aqui</span>
              </div>
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
                      <div
                        className="border border-[#E4E4E7] text-gray-800 px-4 py-3"
                        style={{
                          backgroundColor: 'rgba(230, 230, 230, 0.26)',
                          borderRadius: '0 12px 12px 12px'
                        }}
                      >
                        <p className="text-sm leading-normal m-0">
                          {message.text}
                        </p>
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
              {/* Elemento invisível para scroll automático */}
              <div ref={messagesEndRef} />
            </div>

            {/* Área de input - novo design */}
            <div className="p-6">
              <div
                className="flex items-center gap-3 px-4 py-3 rounded-2xl border border-[#E4E4E7]"
                style={{ backgroundColor: 'rgba(217, 217, 217, 0.12)' }}
              >
                {/* Ícone da lâmpada */}
                <MdOutlineLightbulb
                  size={20}
                  className="text-[#004080] flex-shrink-0"
                />

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
                  disabled={!currentMessage.trim()}
                  className="flex-shrink-0 p-1 bg-transparent border-none cursor-pointer transition-colors duration-200 disabled:cursor-not-allowed"
                >
                  <MdOutlineSend
                    size={20}
                    className="text-[#004080] disabled:text-gray-400"
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
