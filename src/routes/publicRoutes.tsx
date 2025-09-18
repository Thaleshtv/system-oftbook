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
  path: '/configuracoes/conexao-bancos',
  component: Pages.ConnectionBank
})

const connectionBankPerTablesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/configuracoes/conexao-banco/$tableId',
  component: Pages.ConnectionBankPerTables
})

const connectionBankPerColumnsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/configuracoes/conexao-banco/$tableId/$columnId',
  component: Pages.ConnectionBankPerColumns
})

const groupsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/configuracoes/grupos',
  component: Pages.Groups
})

const groupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/configuracoes/grupo/$groupId',
  component: Pages.Group
})

export const publicRoutes = [
  indexRoute,
  redefinirRoute,
  newPasswordRoute,
  connectionBankRoute,
  connectionBankPerTablesRoute,
  connectionBankPerColumnsRoute,
  groupsRoute,
  groupRoute
]
