import { AccessControl } from '../utils/accessControl'
import { isAllowed } from './acl'
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

export const protectedRoutes = [
  // createRoute({
  //   getParentRoute: () => rootRoute,
  //   path: '/inicial-page',
  //   component: withProtection(Pages.InicialPage, '/inicial-page', {
  //     ...defaultAcl,
  //     [Roles.ADMINISTRADOR]: { allow: true },
  //     [Roles.USUARIO]: { allow: false }
  //   })
  // })
]
