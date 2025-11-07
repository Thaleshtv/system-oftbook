import { useChat } from './model'
import { ChatView } from './view'

export const Chat = () => {
  const modelChat = useChat()

  return <ChatView {...modelChat} />
}
