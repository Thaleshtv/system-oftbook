import { ChatPageComponent } from '../../components/chat-page-component'
import { useChat } from './model'
import { PiPaperclip } from 'react-icons/pi'
import { IoSendSharp } from 'react-icons/io5'
import { RiLightbulbLine, RiChatAiLine } from 'react-icons/ri'
import { HiOutlineCode } from 'react-icons/hi'
import { BiMessageSquareEdit } from 'react-icons/bi'
import logoOfbook from '../../assets/logo-ofbook.png'

export const ChatView = (props: ReturnType<typeof useChat>) => {
  return (
    <ChatPageComponent
      topbarTitle="Chat"
      topbarIcon={<RiChatAiLine size={24} className="text-[#071176]" />}
      sessoes={[]}
      pastas={[]}
      currentSessao={null}
      onSelectSessao={() => {}}
      onCreateNewSessao={() => {}}
      onDeleteSessao={() => {}}
      onCreateNewPasta={() => {}}
      isLoadingInitialData={false}
    >
      <div className="flex flex-col h-full">
        {/* Chat content area */}
        <div className="flex-1 flex flex-col items-center justify-center px-4">
          {props.messages.length === 0 ? (
            <>
              {/* Logo */}
              <div className="mb-8">
                <img src={logoOfbook} alt="OftBook" />
              </div>

              {/* Suggestion cards */}
              <div className="flex gap-[14px] items-start">
                <div className="bg-[#FAFAFA] border border-[#D9D9D9] h-[84px] w-[133px] rounded-[13px] p-[8px] flex flex-col gap-[6px] hover:bg-gray-100 transition-colors cursor-pointer">
                  <div className="w-[20px] h-[20px] flex items-center justify-center">
                    <BiMessageSquareEdit size={16} className="text-[#707070]" />
                  </div>
                  <p className="text-[#707070] text-[12px] leading-[1.5] tracking-[0.12px]">
                    Faça perguntas a Ia
                  </p>
                </div>

                <div className="bg-[#FAFAFA] border border-[#D9D9D9] h-[84px] w-[133px] rounded-[13px] p-[8px] flex flex-col gap-[6px] hover:bg-gray-100 transition-colors cursor-pointer">
                  <div className="w-[20px] h-[20px] flex items-center justify-center">
                    <RiLightbulbLine size={16} className="text-[#707070]" />
                  </div>
                  <p className="text-[#707070] text-[12px] leading-[1.5] tracking-[0.12px]">
                    Pedir a Ia para trazer um Insight
                  </p>
                </div>

                <div className="bg-[#FAFAFA] border border-[#D9D9D9] h-[84px] w-[133px] rounded-[13px] p-[8px] flex flex-col gap-[6px] hover:bg-gray-100 transition-colors cursor-pointer">
                  <div className="w-[20px] h-[20px] flex items-center justify-center">
                    <HiOutlineCode size={16} className="text-[#707070]" />
                  </div>
                  <p className="text-[#707070] text-[12px] leading-[1.5] tracking-[0.12px]">
                    Pedir a Ia para gerar um gráfico
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div className="w-full max-w-[1568px]">
              {/* Messages will be displayed here */}
              {props.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`mb-4 ${
                    msg.sender === 'user' ? 'text-right' : 'text-left'
                  }`}
                >
                  <div
                    className={`inline-block p-3 rounded-lg ${
                      msg.sender === 'user'
                        ? 'bg-[#071176] text-white'
                        : 'bg-gray-100 text-[#1E1E1E]'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Input area - fixed at bottom */}
        <div className="w-full px-4 pb-6">
          <div className="max-w-[1568px] mx-auto">
            <div className="relative bg-[rgba(217,217,217,0.12)] border border-[#E4E4E7] rounded-[16px] h-[52px] flex items-center px-[16px]">
              <button className="w-[24px] h-[24px] flex items-center justify-center mr-[8px]">
                <PiPaperclip size={20} className="text-gray-400" />
              </button>
              <input
                type="text"
                placeholder="Digite a mensagem"
                value={props.message}
                onChange={(e) => props.handleMessageChange(e.target.value)}
                onKeyPress={props.handleKeyPress}
                className="flex-1 bg-transparent border-none outline-none text-[12px] text-[#979797] placeholder:text-[#979797] placeholder:opacity-46"
              />
              <button
                onClick={props.handleSendMessage}
                className="w-[24px] h-[24px] flex items-center justify-center ml-[8px]"
              >
                <IoSendSharp size={20} className="text-[#071176]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </ChatPageComponent>
  )
}
