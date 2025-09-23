import { useState } from 'react'

export const useChat = () => {
  const [messages, setMessages] = useState<
    Array<{
      id: string
      text: string
      sender: 'user' | 'bot'
      timestamp: Date
    }>
  >([
    {
      id: '1',
      text: 'Olá! Como posso ajudá-lo hoje?',
      sender: 'bot',
      timestamp: new Date()
    }
  ])

  const [currentMessage, setCurrentMessage] = useState('')

  const sendMessage = (text: string) => {
    if (!text.trim()) return

    const newMessage = {
      id: Date.now().toString(),
      text: text.trim(),
      sender: 'user' as const,
      timestamp: new Date()
    }

    setMessages((prev) => [...prev, newMessage])
    setCurrentMessage('')

    // Simular resposta do bot após um delay
    setTimeout(() => {
      const botResponse = {
        id: (Date.now() + 1).toString(),
        text: 'Esta é uma resposta simulada do bot. Em uma implementação real, aqui seria integrada a IA.',
        sender: 'bot' as const,
        timestamp: new Date()
      }
      setMessages((prev) => [...prev, botResponse])
    }, 1000)
  }

  return {
    messages,
    currentMessage,
    setCurrentMessage,
    sendMessage
  }
}
