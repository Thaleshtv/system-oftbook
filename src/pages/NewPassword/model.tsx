import { useMutation } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { AppRouter } from '../../routes/router'
import { Auth } from '../../services/auth'
import { useAuthStore } from '../../store/userStore'

const newPasswordSchema = z
  .object({
    email: z.string().email({ message: 'E-mail inválido' }),
    temporaryPassword: z.string().min(1, { message: 'Campo obrigatório' }),
    password: z.string().min(6, { message: 'Mínimo 6 caracteres' }),
    confirmPassword: z.string().min(6, { message: 'Mínimo 6 caracteres' }),
    session: z.string().min(1, { message: 'Sessão é obrigatória' })
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword']
  })

type NewPasswordSchema = z.infer<typeof newPasswordSchema>

export const useNewPassword = () => {
  const router = useRouter<AppRouter>()
  const { setToken, setRefreshToken } = useAuthStore((state) => state.dispatch)

  const form = useForm<NewPasswordSchema>({
    resolver: zodResolver(newPasswordSchema)
  })

  const changePasswordMutation = useMutation({
    mutationFn: Auth.changePassword,
    onSuccess: async (response) => {
      try {
        if (response.data?.access_token) {
          await setToken(response.data.access_token)
          setRefreshToken(response.data.refresh_token)
        }

        router.navigate({ to: '/' })
      } catch (error) {
        form.setError('password', {
          message: 'Erro ao processar mudança de senha'
        })
      }
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.detail ||
        'Erro ao alterar senha. Verifique os dados informados.'

      form.setError('password', { message: errorMessage })
    }
  })

  const handleSubmit = form.handleSubmit((data) => {
    changePasswordMutation.mutate({
      email: data.email,
      temporary_password: data.temporaryPassword,
      new_password: data.password,
      session: data.session
    })
  })

  const handleNavigationToLogin = () => {
    router.navigate({ to: '/' })
  }

  return {
    form,
    handleSubmit,
    isLoading: changePasswordMutation.isPending,
    handleNavigationToLogin
  }
}
