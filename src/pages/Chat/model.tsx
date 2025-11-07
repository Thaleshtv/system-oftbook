import { useState, useEffect } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Chat as ChatService } from '../../services/chat'
import type { Message, ChatSession } from '../../types/chatTypes'

export const useChat = () => {
  const queryClient = useQueryClient()

  const [message, setMessage] = useState<string>('')
  const [messages, setMessages] = useState<Message[]>([])
  const [currentChatId, setCurrentChatId] = useState<string>('')
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([])

  const generateChatId = () => {
    return `chat-${Date.now()}-${Math.random().toString(36).substring(7)}`
  }
  useEffect(() => {
    const newChatId = generateChatId()
    setCurrentChatId(newChatId)
    const newSession: ChatSession = {
      id: newChatId,
      name: 'Nova Conversa'
    }
    setChatSessions([newSession])
  }, [])

  const { data: allChatIdsData } = useQuery({
    queryKey: ['chatIds'],
    queryFn: () => ChatService.getAllChatIds(),
    enabled: false
  })
  const { data: historyData, refetch: refetchHistory } = useQuery({
    queryKey: ['chatHistory', currentChatId],
    queryFn: () => ChatService.getHistory(currentChatId),
    enabled: !!currentChatId && messages.length === 0,
    retry: false
  })

  useEffect(() => {
    if (historyData?.data) {
      try {
        const parsedHistory =
          typeof historyData.data === 'string'
            ? JSON.parse(historyData.data)
            : historyData.data

        if (Array.isArray(parsedHistory) && parsedHistory.length > 0) {
          const loadedMessages: Message[] = parsedHistory.map(
            (msg: any, index: number) => ({
              id: `${currentChatId}-${index}`,
              text: msg.content || msg.text || msg.message || '',
              sender:
                msg.role === 'user' || msg.sender === 'user' ? 'user' : 'ai',
              timestamp: msg.timestamp || Date.now()
            })
          )
          setMessages(loadedMessages)
        }
      } catch (error) {
        console.error('Error parsing chat history:', error)
      }
    }
  }, [historyData, currentChatId])

  const sendQueryMutation = useMutation({
    mutationFn: (payload: { query: string; chatId: string }) =>
      ChatService.sendMessage(payload.query, payload.chatId),
    onSuccess: (response) => {
      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        text: response.data,
        sender: 'ai',
        timestamp: Date.now()
      }
      setMessages((prev) => [...prev, aiMessage])

      setChatSessions((prev) =>
        prev.map((session) =>
          session.id === currentChatId
            ? {
                ...session,
                lastMessage: response.data.substring(0, 50) + '...',
                lastMessageTime: Date.now()
              }
            : session
        )
      )

      queryClient.invalidateQueries({
        queryKey: ['chatHistory', currentChatId]
      })
    }
  })

  const clearHistoryMutation = useMutation({
    mutationFn: (chatId: string) => ChatService.clearHistory(chatId),
    onSuccess: () => {
      setMessages([])
      queryClient.invalidateQueries({
        queryKey: ['chatHistory', currentChatId]
      })
    }
  })

  const handleMessageChange = (value: string) => {
    setMessage(value)
  }

  const handleSendMessage = () => {
    if (message.trim() && currentChatId) {
      const userMessage: Message = {
        id: `user-${Date.now()}`,
        text: message,
        sender: 'user',
        timestamp: Date.now()
      }
      setMessages((prev) => [...prev, userMessage])

      sendQueryMutation.mutate({
        query: message,
        chatId: currentChatId
      })

      setMessage('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleCreateNewSession = () => {
    const newChatId = generateChatId()
    const newSession: ChatSession = {
      id: newChatId,
      name: `Conversa ${chatSessions.length + 1}`
    }

    setChatSessions((prev) => [newSession, ...prev])
    setCurrentChatId(newChatId)
    setMessages([])
  }

  const handleSelectSession = (sessionId: string) => {
    setCurrentChatId(sessionId)
    setMessages([])
    refetchHistory()
  }

  const handleDeleteSession = (sessionId: string) => {
    clearHistoryMutation.mutate(sessionId)

    setChatSessions((prev) => {
      const filtered = prev.filter((session) => session.id !== sessionId)

      if (sessionId === currentChatId) {
        if (filtered.length > 0) {
          setCurrentChatId(filtered[0].id)
          setMessages([])
        } else {
          const newChatId = generateChatId()
          const newSession: ChatSession = {
            id: newChatId,
            name: 'Nova Conversa'
          }
          setCurrentChatId(newChatId)
          setMessages([])
          return [newSession]
        }
      }

      return filtered
    })
  }

  const handleClearCurrentChat = () => {
    if (currentChatId) {
      clearHistoryMutation.mutate(currentChatId)
    }
  }

  return {
    message,
    messages,
    currentChatId,
    chatSessions,
    isLoading: sendQueryMutation.isPending,
    handleMessageChange,
    handleSendMessage,
    handleKeyPress,
    handleCreateNewSession,
    handleSelectSession,
    handleDeleteSession,
    handleClearCurrentChat
  }
}
