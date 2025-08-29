import { useRouter } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { AppRouter } from '../../routes/router'

const newPasswordSchema = z
  .object({
    password: z.string().min(6, { message: 'Mínimo 6 caracteres' }),
    confirmPassword: z.string().min(6, { message: 'Mínimo 6 caracteres' })
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword']
  })

type NewPasswordSchema = z.infer<typeof newPasswordSchema>

export const useNewPassword = () => {
  const router = useRouter<AppRouter>()

  const form = useForm<NewPasswordSchema>({
    resolver: zodResolver(newPasswordSchema)
  })

  const handleSubmit = form.handleSubmit((data) => {
    // Lógica temporária - apenas log dos dados
    console.log('Dados da nova senha:', data)
    // Redireciona após "sucesso"
    router.navigate({ to: '/' })
  })

  const handleNavigationToLogin = () => {
    router.navigate({ to: '/' })
  }

  return {
    form,
    handleSubmit,
    isLoading: false,
    handleNavigationToLogin
  }
}
