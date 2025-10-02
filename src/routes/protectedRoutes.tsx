import { createRoute } from '@tanstack/react-router'
import { rootRoute } from './router'
import { AccessControl } from '../utils/accessControl'
import { isAllowed, defaultAcl, Roles } from './acl'
import * as Pages from '../pages'
import { useAuthStore } from '../store/userStore'
import { useToastStore } from '../store/toastStore'
import { useEffect, useState } from 'react'

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
      systemRole: 'administrador-geral' // Temporário: usar role de admin para desenvolvimento
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

export const protectedRoutes = [
  createRoute({
    getParentRoute: () => rootRoute,
    path: '/inicial-page',
    component: withProtection(Pages.InicialPage, '/inicial-page', {
      ...defaultAcl,
      [Roles.ADMINISTRADOR]: { allow: true },
      [Roles.GERENTE]: { allow: true },
      [Roles.USUARIO]: { allow: false }
    })
  }),
  createRoute({
    getParentRoute: () => rootRoute,
    path: '/configuracoes/conexao-bancos',
    component: withProtection(
      Pages.ConnectionBank,
      '/configuracoes/conexao-bancos',
      {
        ...defaultAcl,
        [Roles.ADMINISTRADOR]: { allow: true },
        [Roles.GERENTE]: { allow: true },
        [Roles.USUARIO]: { allow: true }
      }
    )
  }),
  createRoute({
    getParentRoute: () => rootRoute,
    path: '/configuracoes/conexao-banco/$connectionId',
    component: withProtection(
      Pages.ConnectionBankPerTables,
      '/configuracoes/conexao-banco/$connectionId',
      {
        ...defaultAcl,
        [Roles.ADMINISTRADOR]: { allow: true },
        [Roles.GERENTE]: { allow: true },
        [Roles.USUARIO]: { allow: true }
      }
    )
  }),
  createRoute({
    getParentRoute: () => rootRoute,
    path: '/configuracoes/conexao-banco/$connectionId/$tableId',
    component: withProtection(
      Pages.ConnectionBankPerColumns,
      '/configuracoes/conexao-banco/$connectionId/$tableId',
      {
        ...defaultAcl,
        [Roles.ADMINISTRADOR]: { allow: true },
        [Roles.GERENTE]: { allow: true },
        [Roles.USUARIO]: { allow: true }
      }
    )
  }),
  createRoute({
    getParentRoute: () => rootRoute,
    path: '/configuracoes/grupos',
    component: withProtection(Pages.Groups, '/configuracoes/grupos', {
      ...defaultAcl,
      [Roles.ADMINISTRADOR]: { allow: true },
      [Roles.GERENTE]: { allow: true },
      [Roles.USUARIO]: { allow: true }
    })
  }),
  createRoute({
    getParentRoute: () => rootRoute,
    path: '/configuracoes/grupo/$groupId',
    component: withProtection(Pages.Group, '/configuracoes/grupo/$groupId', {
      ...defaultAcl,
      [Roles.ADMINISTRADOR]: { allow: true },
      [Roles.GERENTE]: { allow: true },
      [Roles.USUARIO]: { allow: true }
    })
  }),
  createRoute({
    getParentRoute: () => rootRoute,
    path: '/configuracoes/agentes',
    component: withProtection(Pages.Agentes, '/configuracoes/agentes', {
      ...defaultAcl,
      [Roles.ADMINISTRADOR]: { allow: true },
      [Roles.GERENTE]: { allow: true },
      [Roles.USUARIO]: { allow: true }
    })
  })
]
