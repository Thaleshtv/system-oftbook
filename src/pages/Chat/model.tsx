import { useState, useEffect, useRef } from 'react'
import { useRouter, useParams, useLocation } from '@tanstack/react-router'
import { Conversacoes, IConversacaoResponse } from '../../services/conversacoes'
import { Sessoes, ISessaoResponse } from '../../services/sessoes'
import { Pastas } from '../../services/pastas'
import { useAuthStore } from '../../store/userStore'
import { useToastStore } from '../../store/toastStore'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { createRoot } from 'react-dom/client'

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
  const [graphEnabled, setGraphEnabled] = useState(true)
  const location = useLocation()
  const previousSessaoId = useRef<string | null>(null)

  const router = useRouter()
  const params = useParams({ from: '/chat/$token' })

  const {
    dispatch: { setToken }
  } = useAuthStore()

  const {
    dispatch: { setOpenToast }
  } = useToastStore()

  // Capturar token da URL e armazenar no store
  useEffect(() => {
    if (params.token) {
      const rawPath = location.pathname

      const rawToken = rawPath.replace(/^\/chat\//, '')

      setToken(rawToken)
    }
  }, [params.token, setToken])

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
    const currentSessaoId = currentSessao?.id || null

    // Só limpar gráficos e insights se for uma mudança real de sessão (não um reload)
    if (previousSessaoId.current !== currentSessaoId) {
      setGraph('')
      setInsight('')
      previousSessaoId.current = currentSessaoId
    }

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
    } else if (currentSessao) {
      // Se há uma sessão ativa mas sem histórico, mostrar mensagem de boas-vindas
      setMessages([
        {
          id: 'welcome',
          text: 'Olá! Como posso ajudá-lo hoje? Estou pronto para responder suas perguntas e gerar insights sobre seus dados.',
          sender: 'bot',
          timestamp: new Date()
        }
      ])
    } else {
      // Se não há sessão ativa
      setMessages([
        {
          id: 'welcome',
          text: 'Olá! Como posso ajudá-lo hoje? Aguarde enquanto preparo uma nova sessão de chat para você.',
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
      } else {
        // Se não há sessões ativas, criar uma automaticamente
        const sessionName = `Chat ${new Date().toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}`

        try {
          const newSessao = await Sessoes.createSessao({
            nome: sessionName,
            descricao: 'Sessão criada automaticamente',
            usuario_id: 'user'
          })
          setSessoes([newSessao])
          setCurrentSessao(newSessao)
        } catch (createError) {
          console.error('Erro ao criar sessão automática:', createError)
          showToast('error', 'Erro ao criar sessão inicial')
        }
      }
    } catch (error) {
      console.error('Erro ao carregar dados iniciais:', error)
      showToast('error', 'Erro ao carregar dados do chat')
    } finally {
      setIsLoadingInitialData(false)
    }
  }

  const createNewSessao = async (nome: string, descricao: string = '') => {
    try {
      setIsCreatingSession(true)
      const newSessao = await Sessoes.createSessao({
        nome,
        descricao,
        usuario_id: 'user' // Usando valor padrão já que não temos mais o objeto user
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

    // Limpar gráficos e insights ao enviar uma nova pergunta
    setGraph('')
    setInsight('')

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
      // Enviar para conversação
      const response: IConversacaoResponse = await Conversacoes.conversar({
        sessao_id: currentSessao.id,
        pergunta: text.trim(),
        graph: graphEnabled
      })

      // Adicionar resposta do bot
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: response.resposta,
        sender: 'bot',
        timestamp: new Date()
      }

      setMessages((prev) => [...prev, botMessage])

      // Atualizar gráfico e insights se disponíveis
      if (response.graph) {
        setGraph(response.graph)
      }
      if (response.insight) {
        setInsight(response.insight)
      }

      // Recarregar a sessão para obter os IDs reais das mensagens
      await reloadCurrentSessao()
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

  const reloadCurrentSessao = async () => {
    if (!currentSessao) return

    try {
      const sessao = await Sessoes.getSessaoById(currentSessao.id)
      setCurrentSessao(sessao)
    } catch (error) {
      console.error('Erro ao recarregar sessão:', error)
    }
  }

  const deleteSessao = async (sessaoId: string) => {
    try {
      await Sessoes.deleteSessao(sessaoId)
      setSessoes((prev) => prev.filter((s) => s.id !== sessaoId))

      if (currentSessao?.id === sessaoId) {
        setCurrentSessao(null)
      }

      showToast('success', 'Sessão deletada com sucesso!')
    } catch (error) {
      console.error('Erro ao deletar sessão:', error)
      showToast('error', 'Erro ao deletar sessão')
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

  const handleBack = () => {
    router.navigate({
      to: '/configuracoes/conexao-bancos'
    })
  }

  // Função auxiliar para renderizar markdown para HTML
  const renderMarkdownToHTML = (markdown: string): Promise<string> => {
    return new Promise((resolve) => {
      // Criar um container temporário
      const tempContainer = document.createElement('div')
      tempContainer.style.position = 'absolute'
      tempContainer.style.top = '-9999px'
      tempContainer.style.left = '-9999px'
      document.body.appendChild(tempContainer)

      // Criar root do React
      const root = createRoot(tempContainer)
      
      // Renderizar o markdown
      root.render(
        <ReactMarkdown 
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ children }) => <h1 style={{ fontSize: '18px', fontWeight: 'bold', margin: '10px 0 5px 0', color: '#333' }}>{children}</h1>,
            h2: ({ children }) => <h2 style={{ fontSize: '16px', fontWeight: 'bold', margin: '8px 0 4px 0', color: '#333' }}>{children}</h2>,
            h3: ({ children }) => <h3 style={{ fontSize: '14px', fontWeight: 'bold', margin: '6px 0 3px 0', color: '#333' }}>{children}</h3>,
            p: ({ children }) => <p style={{ margin: '4px 0', lineHeight: '1.5' }}>{children}</p>,
            ul: ({ children }) => <ul style={{ margin: '4px 0', paddingLeft: '20px' }}>{children}</ul>,
            ol: ({ children }) => <ol style={{ margin: '4px 0', paddingLeft: '20px' }}>{children}</ol>,
            li: ({ children }) => <li style={{ margin: '2px 0' }}>{children}</li>,
            strong: ({ children }) => <strong style={{ fontWeight: 'bold' }}>{children}</strong>,
            em: ({ children }) => <em style={{ fontStyle: 'italic' }}>{children}</em>,
            code: ({ children }) => (
              <code style={{ 
                backgroundColor: '#f5f5f5', 
                padding: '2px 4px', 
                borderRadius: '3px', 
                fontSize: '12px', 
                fontFamily: 'monospace' 
              }}>
                {children}
              </code>
            ),
            pre: ({ children }) => (
              <pre style={{ 
                backgroundColor: '#f5f5f5', 
                padding: '10px', 
                borderRadius: '5px', 
                overflow: 'auto', 
                margin: '8px 0',
                fontSize: '12px',
                fontFamily: 'monospace'
              }}>
                {children}
              </pre>
            ),
            blockquote: ({ children }) => (
              <blockquote style={{ 
                borderLeft: '3px solid #ccc', 
                paddingLeft: '10px', 
                margin: '8px 0', 
                fontStyle: 'italic',
                color: '#666'
              }}>
                {children}
              </blockquote>
            ),
            table: ({ children }) => (
              <table style={{ 
                borderCollapse: 'collapse', 
                width: '100%', 
                margin: '8px 0',
                fontSize: '12px'
              }}>
                {children}
              </table>
            ),
            thead: ({ children }) => <thead style={{ backgroundColor: '#f8f8f8' }}>{children}</thead>,
            th: ({ children }) => (
              <th style={{ 
                border: '1px solid #ddd', 
                padding: '6px 8px', 
                textAlign: 'left', 
                fontWeight: 'bold'
              }}>
                {children}
              </th>
            ),
            td: ({ children }) => (
              <td style={{ 
                border: '1px solid #ddd', 
                padding: '6px 8px' 
              }}>
                {children}
              </td>
            )
          }}
        >
          {markdown}
        </ReactMarkdown>
      )

      // Aguardar um pouco para garantir que o componente foi renderizado
      setTimeout(() => {
        const htmlContent = tempContainer.innerHTML
        root.unmount()
        document.body.removeChild(tempContainer)
        resolve(htmlContent)
      }, 100)
    })
  }

  const generateChatReport = async () => {
    try {
      // Criar um elemento temporário para renderizar o conteúdo do chat
      const reportElement = document.createElement('div')
      reportElement.style.position = 'absolute'
      reportElement.style.top = '-9999px'
      reportElement.style.left = '-9999px'
      reportElement.style.width = '800px'
      reportElement.style.padding = '20px'
      reportElement.style.backgroundColor = 'white'
      reportElement.style.fontFamily = 'Arial, sans-serif'

      // Criar o cabeçalho do relatório
      const header = document.createElement('div')
      header.style.marginBottom = '30px'
      header.style.borderBottom = '2px solid #004080'
      header.style.paddingBottom = '20px'

      const title = document.createElement('h1')
      title.style.color = '#004080'
      title.style.fontSize = '24px'
      title.style.margin = '0 0 10px 0'
      title.textContent = `Relatório de Chat - ${currentSessao?.nome || 'Chat'}`

      const dateInfo = document.createElement('p')
      dateInfo.style.color = '#666'
      dateInfo.style.fontSize = '14px'
      dateInfo.style.margin = '0'
      dateInfo.textContent = `Gerado em: ${new Date().toLocaleString('pt-BR')}`

      header.appendChild(title)
      header.appendChild(dateInfo)

      // Criar área de mensagens
      const messagesContainer = document.createElement('div')
      messagesContainer.style.marginTop = '20px'

      // Processar mensagens uma por uma com markdown
      for (const message of messages) {
        const messageDiv = document.createElement('div')
        messageDiv.style.marginBottom = '20px'
        messageDiv.style.padding = '15px'
        messageDiv.style.borderRadius = '8px'
        messageDiv.style.border = '1px solid #e5e5e5'

        if (message.sender === 'user') {
          messageDiv.style.backgroundColor = '#f0f8ff'
          messageDiv.style.marginLeft = '100px'
        } else {
          messageDiv.style.backgroundColor = '#f9f9f9'
          messageDiv.style.marginRight = '100px'
        }

        // Nome do remetente
        const senderName = document.createElement('div')
        senderName.style.fontWeight = 'bold'
        senderName.style.color = message.sender === 'user' ? '#004080' : '#333'
        senderName.style.marginBottom = '8px'
        senderName.style.fontSize = '14px'
        senderName.textContent =
          message.sender === 'user' ? 'Você' : 'Inteligência Artificial'

        // Conteúdo da mensagem com markdown renderizado
        const messageContent = document.createElement('div')
        messageContent.style.fontSize = '13px'
        messageContent.style.lineHeight = '1.5'
        messageContent.style.color = '#333'
        messageContent.style.marginBottom = '8px'
        
        // Renderizar markdown para HTML
        const htmlContent = await renderMarkdownToHTML(message.text)
        messageContent.innerHTML = htmlContent

        // Timestamp
        const timestamp = document.createElement('div')
        timestamp.style.fontSize = '11px'
        timestamp.style.color = '#666'
        timestamp.style.textAlign = 'right'
        timestamp.textContent = message.timestamp.toLocaleString('pt-BR')

        messageDiv.appendChild(senderName)
        messageDiv.appendChild(messageContent)
        messageDiv.appendChild(timestamp)
        messagesContainer.appendChild(messageDiv)
      }

      // Adicionar elementos ao container principal
      reportElement.appendChild(header)
      reportElement.appendChild(messagesContainer)

      // Adicionar ao DOM temporariamente
      document.body.appendChild(reportElement)

      // Capturar como imagem
      const canvas = await html2canvas(reportElement, {
        backgroundColor: 'white',
        scale: 2,
        useCORS: true,
        allowTaint: true
      })

      // Remover elemento temporário
      document.body.removeChild(reportElement)

      // Criar PDF
      const pdf = new jsPDF('p', 'mm', 'a4')
      const imgData = canvas.toDataURL('image/png')

      const imgWidth = 210 // A4 width in mm
      const pageHeight = 295 // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      let heightLeft = imgHeight

      let position = 0

      // Adicionar primeira página
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight

      // Adicionar páginas adicionais se necessário
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }

      // Fazer download do PDF
      const fileName = `chat-report-${currentSessao?.nome || 'chat'}-${
        new Date().toISOString().split('T')[0]
      }.pdf`
      pdf.save(fileName)

      showToast('success', 'Relatório gerado com sucesso!')
    } catch (error) {
      console.error('Erro ao gerar relatório:', error)
      showToast('error', 'Erro ao gerar relatório. Tente novamente.')
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
    graphEnabled,
    setGraphEnabled,
    createNewSessao,
    selectSessao,
    deleteSessao,
    evaluateMessage,
    refreshData: loadInitialData,
    handleBack,
    generateChatReport
  }
}
