import { useState } from 'react'

export const useAgentes = () => {
  const [modalConfig, setModalConfig] = useState(false)

  return { modalConfig, setModalConfig }
}
