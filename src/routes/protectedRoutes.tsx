import { createRoute } from '@tanstack/react-router'
import { rootRoute } from './router'
import { AccessControl } from '../utils/accessControl'
import { isAllowed, defaultAcl, Roles } from './acl'
import * as Pages from '../pages'
import { useAuthStore } from '../store/userStore'
import { useToastStore } from '../store/toastStore'
import { useEffect } from 'react'

const withProtection = (
  Component: React.ComponentType,
  path: string,
  acl: Record<string, { allow: boolean }>
) => {
  return () => {
    const { state } = useAuthStore()
    const { dispatch: toast } = useToastStore()
    const isAuthenticated = state.isAuthenticated

    const allowed = isAllowed({
      path,
      acl,
      systemRole: state.user?.role || ''
    })

    useEffect(() => {
      if (!isAuthenticated) {
        toast.setOpenToast('error', 'Sua sessão expirou')
        window.location.href = '/'
      }
    }, [isAuthenticated, toast])

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
    path: '/connection-bank',
    component: withProtection(Pages.ConnectionBank, '/conexao-banco', {
      ...defaultAcl,
      [Roles.ADMINISTRADOR]: { allow: true },
      [Roles.GERENTE]: { allow: true },
      [Roles.USUARIO]: { allow: false }
    })
  })
]
