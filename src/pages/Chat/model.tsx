import { useState, useEffect } from 'react'
import { Conversacoes, IConversacaoResponse } from '../../services/conversacoes'
import { Sessoes, ISessaoResponse } from '../../services/sessoes'
import { Pastas } from '../../services/pastas'
import { useAuthStore } from '../../store/userStore'
import { useToastStore } from '../../store/toastStore'

interface ChatMessage {
  id: string
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
  avaliacao?: string
}

export const useChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [currentMessage, setCurrentMessage] = useState('')
  const [currentSessao, setCurrentSessao] = useState<ISessaoResponse | null>(
    null
  )
  const [sessoes, setSessoes] = useState<ISessaoResponse[]>([])
  const [pastas, setPastas] = useState<string[]>([])
  const [graph, setGraph] = useState<string>('')
  const [insight, setInsight] = useState<string>('')
  const [isLoadingResponse, setIsLoadingResponse] = useState(false)
  const [isLoadingInitialData, setIsLoadingInitialData] = useState(false)
  const [isLoadingSessao, setIsLoadingSessao] = useState(false)
  const [isCreatingSession, setIsCreatingSession] = useState(false)

  const {
    state: { user }
  } = useAuthStore()
  const {
    dispatch: { setOpenToast }
  } = useToastStore()

  const showToast = (
    type: 'info' | 'success' | 'warning' | 'error',
    message: string
  ) => {
    setOpenToast(type, message)
  }

  // Carregar sessões e pastas ao inicializar
  useEffect(() => {
    loadInitialData()
  }, [])

  // Carregar mensagens quando a sessão atual mudar
  useEffect(() => {
    if (currentSessao?.historico) {
      const chatMessages: ChatMessage[] = currentSessao.historico.map(
        (msg) => ({
          id: msg.id,
          text: msg.content,
          sender: msg.role === 'user' ? 'user' : 'bot',
          timestamp: new Date(msg.created_at),
          avaliacao: msg.avaliacao
        })
      )
      setMessages(chatMessages)
    } else {
      // Mensagem de boas-vindas se não houver sessão ativa
      setMessages([
        {
          id: 'welcome',
          text: 'Olá! Como posso ajudá-lo hoje? Crie uma nova sessão para começarmos a conversar.',
          sender: 'bot',
          timestamp: new Date()
        }
      ])
    }
  }, [currentSessao])

  const loadInitialData = async () => {
    try {
      setIsLoadingInitialData(true)
      const [sessoesData, pastasData] = await Promise.all([
        Sessoes.getSessoes(),
        Pastas.getPastas()
      ])
      setSessoes(sessoesData)
      setPastas(pastasData)

      // Se há sessões, selecionar a mais recente não arquivada
      const activeSessoes = sessoesData.filter((s) => !s.arquivada)
      if (activeSessoes.length > 0) {
        const latestSessao = activeSessoes.sort(
          (a, b) =>
            new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        )[0]
        setCurrentSessao(latestSessao)
      }
    } catch (error) {
      console.error('Erro ao carregar dados iniciais:', error)
      showToast('error', 'Erro ao carregar dados do chat')
    } finally {
      setIsLoadingInitialData(false)
    }
  }

  const createNewSessao = async (nome: string, descricao: string = '') => {
    if (!user?.name) {
      showToast('error', 'Usuário não encontrado')
      return
    }

    try {
      setIsCreatingSession(true)
      const newSessao = await Sessoes.createSessao({
        nome,
        descricao,
        usuario_id: user.name // Using name as ID since User type doesn't have id
      })
      setSessoes((prev) => [newSessao, ...prev])
      setCurrentSessao(newSessao)
      showToast('success', 'Nova sessão criada com sucesso!')
    } catch (error) {
      console.error('Erro ao criar sessão:', error)
      showToast('error', 'Erro ao criar nova sessão')
    } finally {
      setIsCreatingSession(false)
    }
  }

  const sendMessage = async (text: string) => {
    if (!text.trim()) return

    if (!currentSessao) {
      showToast('warning', 'Crie uma sessão primeiro para enviar mensagens')
      return
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: text.trim(),
      sender: 'user',
      timestamp: new Date()
    }

    setMessages((prev) => [...prev, userMessage])
    setCurrentMessage('')
    setIsLoadingResponse(true)

    try {
      // Salvar mensagem do usuário
      await Sessoes.addMensagem(currentSessao.id, {
        role: 'user',
        content: text.trim(),
        sessao_id: currentSessao.id
      })

      // Enviar para conversação
      const response: IConversacaoResponse = await Conversacoes.conversar({
        sessao_id: currentSessao.id,
        pergunta: text.trim(),
        graph: true
      })

      // Adicionar resposta do bot
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: response.resposta,
        sender: 'bot',
        timestamp: new Date()
      }

      setMessages((prev) => [...prev, botMessage])

      // Salvar mensagem do bot
      await Sessoes.addMensagem(currentSessao.id, {
        role: 'assistant',
        content: response.resposta,
        sessao_id: currentSessao.id
      })

      // Atualizar gráfico e insights se disponíveis
      if (response.graph) {
        setGraph(response.graph)
      }
      if (response.insight) {
        setInsight(response.insight)
      }

      // Recarregar a sessão atual para obter dados atualizados
      const updatedSessao = await Sessoes.getSessaoById(currentSessao.id)
      setCurrentSessao(updatedSessao)
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error)
      showToast('error', 'Erro ao enviar mensagem. Tente novamente.')
    } finally {
      setIsLoadingResponse(false)
    }
  }

  const selectSessao = async (sessaoId: string) => {
    try {
      setIsLoadingSessao(true)
      const sessao = await Sessoes.getSessaoById(sessaoId)
      setCurrentSessao(sessao)
    } catch (error) {
      console.error('Erro ao carregar sessão:', error)
      showToast('error', 'Erro ao carregar sessão')
    } finally {
      setIsLoadingSessao(false)
    }
  }

  const archiveSessao = async (sessaoId: string) => {
    try {
      await Sessoes.archiveSessao(sessaoId)
      setSessoes((prev) =>
        prev.map((s) => (s.id === sessaoId ? { ...s, arquivada: true } : s))
      )

      if (currentSessao?.id === sessaoId) {
        setCurrentSessao(null)
      }

      showToast('success', 'Sessão arquivada com sucesso!')
    } catch (error) {
      console.error('Erro ao arquivar sessão:', error)
      showToast('error', 'Erro ao arquivar sessão')
    }
  }

  const evaluateMessage = async (messageId: string, avaliacao: string) => {
    try {
      await Sessoes.updateAvaliacaoMensagem(messageId, avaliacao)

      // Atualizar a mensagem local
      setMessages((prev) =>
        prev.map((msg) => (msg.id === messageId ? { ...msg, avaliacao } : msg))
      )

      showToast('success', 'Avaliação registrada!')
    } catch (error) {
      console.error('Erro ao avaliar mensagem:', error)
      showToast('error', 'Erro ao registrar avaliação')
    }
  }

  return {
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
    isLoadingSessao,
    isCreatingSession,
    createNewSessao,
    selectSessao,
    archiveSessao,
    evaluateMessage,
    refreshData: loadInitialData
  }
}
