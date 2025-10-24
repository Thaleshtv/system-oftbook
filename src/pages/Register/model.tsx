import { useMutation } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { AppRouter } from '../../routes/router'

// Função para validar CPF
const isValidCPF = (cpf: string) => {
  cpf = cpf.replace(/[^\d]+/g, '')

  if (cpf.length !== 11 || !!cpf.match(/(\d)\1{10}/)) {
    return false
  }

  const cpfArray = cpf.split('').map((el) => +el)
  const rest = (count: number) => {
    return (
      ((cpfArray
        .slice(0, count - 1)
        .reduce((soma, el, index) => soma + el * (count - index), 0) *
        10) %
        11) %
      10
    )
  }

  return rest(10) === cpfArray[9] && rest(11) === cpfArray[10]
}

const registerSchema = z
  .object({
    fullName: z
      .string()
      .min(2, { message: 'Nome deve ter pelo menos 2 caracteres' })
      .regex(/^[a-zA-ZÀ-ÿ\s]+$/, {
        message: 'Nome deve conter apenas letras e espaços'
      }),
    email: z.string().email({ message: 'E-mail inválido' }),
    cpf: z
      .string()
      .min(11, { message: 'CPF deve ter 11 dígitos' })
      .refine((cpf) => isValidCPF(cpf), { message: 'CPF inválido' }),
    password: z
      .string()
      .min(8, { message: 'Senha deve ter pelo menos 8 caracteres' })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
        message:
          'Senha deve conter pelo menos 1 letra minúscula, 1 maiúscula e 1 número'
      }),
    confirmPassword: z.string(),
    language: z.string().min(1, { message: 'Selecione uma linguagem' })
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Senhas não coincidem',
    path: ['confirmPassword']
  })

type RegisterSchema = z.infer<typeof registerSchema>

export const useRegister = () => {
  const router = useRouter<AppRouter>()

  const form = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      cpf: '',
      password: '',
      confirmPassword: '',
      language: ''
    }
  })

  // TODO: Implementar a função de cadastro no serviço de autenticação
  const registerMutation = useMutation({
    mutationFn: async (data: RegisterSchema) => {
      // Simular chamada da API por enquanto
      console.log('Dados de cadastro:', data)
      return { status: 200, message: 'Usuário cadastrado com sucesso' }
    },
    onSuccess: (res) => {
      if (res.status === 200) {
        // Redirecionar para login após cadastro bem-sucedido
        router.navigate({ to: '/' })
      } else {
        form.setError('email', { message: res.message })
      }
    }
  })

  const handleSubmit = form.handleSubmit((data) => {
    registerMutation.mutate(data)
  })

  const handleDirectionLogin = () => {
    router.navigate({ to: '/' })
  }

  // Função para formatação do CPF
  const formatCPF = (value: string) => {
    const cleanValue = value.replace(/\D/g, '')
    const formattedValue = cleanValue.replace(
      /(\d{3})(\d{3})(\d{3})(\d{2})/,
      '$1.$2.$3-$4'
    )
    return formattedValue
  }

  const handleCPFChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    const formattedValue = formatCPF(value)
    form.setValue('cpf', formattedValue)
  }

  return {
    form,
    handleSubmit,
    isLoading: registerMutation.isPending,
    handleDirectionLogin,
    handleCPFChange
  }
}
