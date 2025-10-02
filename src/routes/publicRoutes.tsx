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

const notFoundRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/not-found',
  component: Pages.NotFound
})

const chatRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/chat/$token',
  component: Pages.Chat
})

const catchAllRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '*',
  component: Pages.NotFound
})

export const publicRoutes = [
  indexRoute,
  redefinirRoute,
  newPasswordRoute,
  notFoundRoute,
  chatRoute,
  catchAllRoute
]
