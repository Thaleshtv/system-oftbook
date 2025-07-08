import { ReactNode } from 'react'
import { useRouter } from '@tanstack/react-router'

interface AccessControlProps {
  allowed?: boolean
  children: ReactNode
}

const AccessControl = ({ allowed = false, children }: AccessControlProps) => {
  const router = useRouter()

  if (!allowed) {
    router.navigate({ to: '/' })
    return null
  }

  return <>{children}</>
}

export { AccessControl }
