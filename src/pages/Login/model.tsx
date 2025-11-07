import { useMutation } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { AppRouter } from '../../routes/router'
import { Auth } from '../../services/auth'
import { useAuthStore } from '../../store/userStore'

const loginSchema = z.object({
  email: z.string().email({ message: 'E-mail inválido' }),
  password: z.string().min(1, { message: 'Campo obrigatório' })
})

type LoginSchema = z.infer<typeof loginSchema>

export const useLogin = () => {
  const router = useRouter<AppRouter>()
  const { setToken, setRefreshToken, setUser } = useAuthStore(
    (state) => state.dispatch
  )

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema)
  })

  const loginMutation = useMutation({
    mutationFn: Auth.loginUser,
    onSuccess: async (response) => {
      try {
        // Store tokens
        setToken(response.access_token)
        setRefreshToken(response.refresh_token)

        // Store user data from login response
        if (response.user) {
          const role = response.user.groups[0] as 'administrador' | 'usuario'
          setUser({
            name: response.user.name,
            role: role
          })
        }

        // Navigate to Arquivos page on successful login
        router.navigate({ to: '/arquivos' })
      } catch (error) {
        console.error('Erro ao processar login:', error)
        form.setError('email', {
          message: 'Erro ao processar autenticação'
        })
      }
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.detail || 'E-mail ou senha inválidos'

      form.setError('email', { message: errorMessage })
    }
  })

  const handleSubmit = form.handleSubmit((data) => {
    loginMutation.mutate(data)
  })

  const handleDirectionRedefinir = () => {
    router.navigate({ to: '/redefinir' })
  }

  const handleDirectionRegister = () => {
    router.navigate({ to: '/cadastro' })
  }

  return {
    form,
    handleSubmit,
    isLoading: loginMutation.isPending,
    handleDirectionRedefinir,
    handleDirectionRegister
  }
}
