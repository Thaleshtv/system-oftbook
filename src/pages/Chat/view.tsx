import './style.scss'
import { useChat } from './model'
import { ChatPageComponent } from '../../components/chat-page-component'
import { MdOutlineChat, MdOutlineSend } from 'react-icons/md'

export const ChatView = (props: ReturnType<typeof useChat>) => {
  const { messages, currentMessage, setCurrentMessage, sendMessage } = props

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
      <div className="chat-page">
        <div className="chat-container">
          {/* Área de mensagens */}
          <div className="messages-area">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`message ${
                  message.sender === 'user' ? 'message-user' : 'message-bot'
                }`}
              >
                <div className="message-content">
                  <p>{message.text}</p>
                  <span className="message-time">
                    {message.timestamp.toLocaleTimeString('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Área de input */}
          <div className="input-area">
            <div className="input-container">
              <textarea
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Digite sua mensagem..."
                className="message-input"
                rows={1}
              />
              <button
                onClick={handleSendMessage}
                disabled={!currentMessage.trim()}
                className="send-button"
              >
                <MdOutlineSend size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </ChatPageComponent>
  )
}
