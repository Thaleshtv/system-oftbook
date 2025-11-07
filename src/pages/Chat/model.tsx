import { useState } from 'react'

export const useChat = () => {
  const [message, setMessage] = useState<string>('')
  const [messages, setMessages] = useState<
    Array<{ id: number; text: string; sender: 'user' | 'ai' }>
  >([])

  const handleMessageChange = (value: string) => {
    setMessage(value)
  }

  const handleSendMessage = () => {
    if (message.trim()) {
      setMessages((prev) => [
        ...prev,
        { id: Date.now(), text: message, sender: 'user' }
      ])
      setMessage('')
      // TODO: Implement AI response logic
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return {
    message,
    messages,
    handleMessageChange,
    handleSendMessage,
    handleKeyPress
  }
}
