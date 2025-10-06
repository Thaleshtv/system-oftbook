import { useState, useEffect } from 'react'
import { Agentes, IAgenteResponse } from '../../services/agentes'

export const useAgentes = () => {
  const [modalConfig, setModalConfig] = useState(false)
  const [modalPrompt, setModalPrompt] = useState(false)
  const [selectedAgente, setSelectedAgente] = useState<IAgenteResponse | null>(
    null
  )
  const [agentes, setAgentes] = useState<IAgenteResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updatingPrompt, setUpdatingPrompt] = useState(false)

  const fetchAgentes = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await Agentes.getAgentes()
      setAgentes(data)
    } catch (err) {
      setError('Erro ao carregar agentes')
      console.error('Erro ao buscar agentes:', err)
    } finally {
      setLoading(false)
    }
  }

  const updateAgentePrompt = async (agenteId: string, newPrompt: string) => {
    try {
      setUpdatingPrompt(true)
      setError(null)
      
      // Buscar os dados atuais do agente
      const currentAgente = agentes.find(agente => agente.id === agenteId)
      if (!currentAgente) {
        throw new Error('Agente não encontrado')
      }

      // Atualizar o agente com o novo prompt
      const updatedAgente = await Agentes.updateAgente(agenteId, {
        nome: currentAgente.nome,
        modelo_id: currentAgente.modelo_id,
        cod: currentAgente.cod,
        prompt_template: newPrompt
      })

      // Atualizar a lista local de agentes
      setAgentes(prevAgentes => 
        prevAgentes.map(agente => 
          agente.id === agenteId ? updatedAgente : agente
        )
      )

      // Atualizar o agente selecionado se for o mesmo
      if (selectedAgente?.id === agenteId) {
        setSelectedAgente(updatedAgente)
      }

      return updatedAgente
    } catch (err) {
      setError('Erro ao atualizar prompt do agente')
      console.error('Erro ao atualizar prompt:', err)
      throw err
    } finally {
      setUpdatingPrompt(false)
    }
  }

  useEffect(() => {
    fetchAgentes()
  }, [])

  return {
    modalConfig,
    setModalConfig,
    modalPrompt,
    setModalPrompt,
    selectedAgente,
    setSelectedAgente,
    agentes,
    loading,
    error,
    fetchAgentes,
    updateAgentePrompt,
    updatingPrompt
  }
}
