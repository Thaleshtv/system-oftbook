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
  const { data: allChatIdsData, isLoading: isLoadingInitialData } = useQuery({
    queryKey: ['chatIds'],
    queryFn: () => ChatService.getAllChatIds(),
    enabled: true
  })

  useEffect(() => {
    console.log('useEffect triggered, allChatIdsData:', allChatIdsData)

    if (allChatIdsData?.data?.chat_ids) {
      try {
        // The API returns an object with chat_ids property containing the array
        const chatIds = allChatIdsData.data.chat_ids
        console.log('Chat IDs from API:', chatIds)

        if (Array.isArray(chatIds) && chatIds.length > 0) {
          const sessions: ChatSession[] = chatIds.map(
            (chatId: string, index: number) => ({
              id: chatId,
              name: `Chat ${index + 1}`
            })
          )
          console.log('Generated sessions:', sessions)
          setChatSessions(sessions)

          // Set the first chat as current if no current chat is set
          if (!currentChatId) {
            console.log('Setting current chat ID to:', sessions[0].id)
            setCurrentChatId(sessions[0].id)
          }
        } else {
          console.log('No chat IDs found or invalid format')
          // If no existing chats, create a new one only if we don't have sessions
          if (chatSessions.length === 0) {
            const newChatId = generateChatId()
            setCurrentChatId(newChatId)
            const newSession: ChatSession = {
              id: newChatId,
              name: 'Nova Conversa'
            }
            setChatSessions([newSession])
          }
        }
      } catch (error) {
        console.error('Error processing all chat IDs:', error)
        // Fallback to creating a new chat only if we don't have sessions
        if (chatSessions.length === 0) {
          const newChatId = generateChatId()
          setCurrentChatId(newChatId)
          const newSession: ChatSession = {
            id: newChatId,
            name: 'Nova Conversa'
          }
          setChatSessions([newSession])
        }
      }
    } else {
      console.log(
        'No allChatIdsData.data.chat_ids available, chatSessions.length:',
        chatSessions.length
      )
      if (chatSessions.length === 0) {
        // If no data, create a new chat only if we don't have sessions
        const newChatId = generateChatId()
        setCurrentChatId(newChatId)
        const newSession: ChatSession = {
          id: newChatId,
          name: 'Nova Conversa'
        }
        setChatSessions([newSession])
      }
    }
  }, [allChatIdsData])
  const { data: historyData } = useQuery({
    queryKey: ['chatHistory', currentChatId],
    queryFn: () => ChatService.getHistory(currentChatId),
    enabled: !!currentChatId,
    retry: false
  })

  useEffect(() => {
    console.log('History effect triggered, historyData:', historyData, 'currentChatId:', currentChatId)
    if (historyData?.data && currentChatId) {
      try {
        console.log('Raw history data:', historyData.data)
        let parsedHistory =
          typeof historyData.data === 'string'
            ? JSON.parse(historyData.data)
            : historyData.data

        // Check if the data has a 'history' property
        if (parsedHistory && parsedHistory.history) {
          parsedHistory = parsedHistory.history
        }

        console.log('Parsed history:', parsedHistory)
        if (Array.isArray(parsedHistory) && parsedHistory.length > 0) {
          const loadedMessages: Message[] = []
          
          parsedHistory.forEach((conversation: any, index: number) => {
            // Add user message
            if (conversation.user) {
              loadedMessages.push({
                id: `${currentChatId}-user-${index}`,
                text: conversation.user,
                sender: 'user',
                timestamp: conversation.timestamp ? new Date(conversation.timestamp).getTime() : Date.now()
              })
            }
            
            // Add AI message
            if (conversation.ai) {
              loadedMessages.push({
                id: `${currentChatId}-ai-${index}`,
                text: conversation.ai,
                sender: 'ai',
                timestamp: conversation.timestamp ? new Date(conversation.timestamp).getTime() : Date.now()
              })
            }
          })
          
          // Sort messages by timestamp to maintain order
          loadedMessages.sort((a, b) => a.timestamp - b.timestamp)
          
          console.log('Loaded messages:', loadedMessages)
          setMessages(loadedMessages)
        } else {
          console.log('No valid history found or empty array')
          setMessages([])
        }
      } catch (error) {
        console.error('Error parsing chat history:', error)
        setMessages([])
      }
    } else if (currentChatId && !historyData?.data) {
      console.log('No history data for chat, setting empty messages')
      setMessages([])
    }
  }, [historyData, currentChatId])

  const sendQueryMutation = useMutation({
    mutationFn: (payload: { query: string; chatId: string }) =>
      ChatService.sendMessage(payload.query, payload.chatId),
    onSuccess: (response) => {
      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        text: response.data.answer,
        sender: 'ai',
        timestamp: Date.now(),
        references: response.data.references
      }
      setMessages((prev) => [...prev, aiMessage])

      setChatSessions((prev) =>
        prev.map((session) =>
          session.id === currentChatId
            ? {
                ...session,
                lastMessage: response.data.answer.substring(0, 50) + '...',
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

    // Invalidate chat IDs query to refresh the list
    queryClient.invalidateQueries({
      queryKey: ['chatIds']
    })
  }

  const handleSelectSession = (sessionId: string) => {
    console.log('handleSelectSession called with:', sessionId)
    setCurrentChatId(sessionId)
    setMessages([])
    console.log('About to refetch history for chat:', sessionId)
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

    // Invalidate chat IDs query to refresh the list
    queryClient.invalidateQueries({
      queryKey: ['chatIds']
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
    isLoadingInitialData,
    handleMessageChange,
    handleSendMessage,
    handleKeyPress,
    handleCreateNewSession,
    handleSelectSession,
    handleDeleteSession,
    handleClearCurrentChat
  }
}
