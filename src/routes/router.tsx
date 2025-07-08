import {
  createRouter,
  createRootRouteWithContext,
  Outlet
} from '@tanstack/react-router'
import { publicRoutes } from './publicRoutes'
import { protectedRoutes } from './protectedRoutes'
import { useAuthStore } from '../store/userStore'
import { useToastStore } from '../store/toastStore'

type RouterContext = {
  auth: ReturnType<typeof useAuthStore>
  toast: ReturnType<typeof useToastStore>
}

export const rootRoute = createRootRouteWithContext<RouterContext>()({
  component: () => <Outlet />
})

const routeTree = rootRoute.addChildren([...publicRoutes, ...protectedRoutes])

export const router = createRouter({
  routeTree,
  context: undefined!,
  defaultPreload: 'intent'
})

export type AppRouter = typeof router

declare module '@tanstack/react-router' {
  interface Register {
    router: AppRouter
  }
}
