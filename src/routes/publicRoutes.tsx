import { createRoute } from '@tanstack/react-router'
import { rootRoute } from './router'
import * as Pages from '../pages'

export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Pages.Login
})

export const publicRoutes = [indexRoute]
