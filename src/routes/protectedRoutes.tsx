import { AccessControl } from '../utils/accessControl'
import { isAllowed, Roles } from './acl'
import { useAuthStore } from '../store/userStore'
import { useToastStore } from '../store/toastStore'
import { useEffect, useState } from 'react'
import { createRoute } from '@tanstack/react-router'
import { rootRoute } from './router'
import * as Pages from '../pages'

const withProtection = (
  Component: React.ComponentType,
  path: string,
  acl: Record<string, { allow: boolean }>
) => {
  return () => {
    const { state, dispatch } = useAuthStore()
    const { dispatch: toast } = useToastStore()
    const [isCheckingAuth, setIsCheckingAuth] = useState(true)

    useEffect(() => {
      setIsCheckingAuth(false)
    }, [path, state.token, dispatch])

    const isAuthenticated = !!state.token

    const allowed = isAllowed({
      path,
      acl,
      systemRole: state.user?.role || 'usuario'
    })

    useEffect(() => {
      if (!isCheckingAuth && !isAuthenticated) {
        toast.setOpenToast('error', 'Sua sessão expirou')
        window.location.href = '/'
      }
    }, [isAuthenticated, toast, isCheckingAuth])

    if (isCheckingAuth) {
      return <div>Carregando...</div>
    }

    if (!isAuthenticated) return null

    if (!allowed) {
      window.location.href = '/not-found'
      return null
    }

    return (
      <AccessControl allowed={allowed}>
        <Component />
      </AccessControl>
    )
  }
}

const arquivosRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/arquivos',
  component: withProtection(Pages.Arquivos, '/arquivos', {
    [Roles.ADMINISTRADOR]: { allow: true },
    [Roles.USUARIO]: { allow: true }
  })
})

const chatRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/chat',
  component: withProtection(Pages.Chat, '/chat', {
    [Roles.ADMINISTRADOR]: { allow: true },
    [Roles.USUARIO]: { allow: true }
  })
})

export const protectedRoutes = [arquivosRoute, chatRoute]
