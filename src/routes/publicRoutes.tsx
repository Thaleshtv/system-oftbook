import { createRoute } from '@tanstack/react-router'
import { rootRoute } from './router'
import * as Pages from '../pages'

export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Pages.Login
})

export const redefinirRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/redefinir',
  component: Pages.Redefinir
})

const newPasswordRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/nova-senha',
  component: Pages.NewPassword
})

const connectionBankRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/configuracoes/conexao-banco',
  component: Pages.ConnectionBank
})

export const publicRoutes = [
  indexRoute,
  redefinirRoute,
  newPasswordRoute,
  connectionBankRoute
]
