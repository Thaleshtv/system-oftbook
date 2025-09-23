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
    fetchAgentes
  }
}
