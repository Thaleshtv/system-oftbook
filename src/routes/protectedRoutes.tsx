import { createRoute } from '@tanstack/react-router'
import { rootRoute } from './router'
import { AccessControl } from '../utils/accessControl'
import { isAllowed, defaultAcl, Roles } from './acl'
import * as Pages from '../pages'
import { useAuthStore } from '../store/userStore'
import { useToastStore } from '../store/toastStore'

const protectedRoutesConfig = [
  {
    path: '/inicial-page',
    element: Pages.InicialPage,
    acl: {
      ...defaultAcl,
      [Roles.ADMINISTRADOR]: { allow: true },
      [Roles.GERENTE]: { allow: true },
      [Roles.USUARIO]: { allow: false }
    }
  }
]

export const protectedRoutes = protectedRoutesConfig.map(
  ({ path, element: Component, acl }) =>
    createRoute({
      getParentRoute: () => rootRoute,
      path,
      component: () => {
        const { state } = useAuthStore()
        const { dispatch: toast } = useToastStore()

        if (!state.isAuthenticated) {
          toast.setOpenToast('error', 'Sua sessão expirou')
          window.location.href = '/'
          return null
        }

        const allowed = isAllowed({
          path,
          acl,
          systemRole: ''
        })

        return (
          <AccessControl allowed={allowed}>
            <Component />
          </AccessControl>
        )
      }
    })
)
