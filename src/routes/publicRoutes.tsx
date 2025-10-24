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

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/cadastro',
  component: Pages.Register
})

const newPasswordRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/nova-senha',
  component: Pages.NewPassword
})

const arquivosRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/arquivos',
  component: Pages.Arquivos
})

const notFoundRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/not-found',
  component: Pages.NotFound
})

const catchAllRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '*',
  component: Pages.NotFound
})

export const publicRoutes = [
  indexRoute,
  redefinirRoute,
  registerRoute,
  newPasswordRoute,
  arquivosRoute,
  notFoundRoute,
  catchAllRoute
]
