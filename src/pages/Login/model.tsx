import { useMutation } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { AppRouter } from '../../routes/router'

import { Auth } from '../../services/auth'

const loginSchema = z.object({
  email: z.string().email({ message: 'E-mail inválido' }),
  password: z.string().min(1, { message: 'Campo obrigatório' })
})

type LoginSchema = z.infer<typeof loginSchema>

export const useLogin = () => {
  const router = useRouter<AppRouter>()

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema)
  })

  const loginMutation = useMutation({
    mutationFn: Auth.loginUser,
    onSuccess: (res) => {
      if (res.status === 200) {
        router.navigate({ to: '/' })
      } else {
        form.setError('email', { message: res.message })
      }
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
