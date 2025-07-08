import './style.scss'
import { FiMail, FiLock } from 'react-icons/fi'
import { useLogin } from './model'

export const LoginView = (props: ReturnType<typeof useLogin>) => {
  const { form, handleSubmit, isLoading } = props

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-semibold text-center mb-6 text-blue-700">
          Bem-vindo de volta
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              E-mail
            </label>
            <div className="flex items-center border rounded px-3 py-2">
              <FiMail className="text-gray-400 mr-2" />
              <input
                type="email"
                {...form.register('email')}
                className="w-full outline-none text-sm"
                placeholder="seu@email.com"
              />
            </div>
            {form.formState.errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Senha
            </label>
            <div className="flex items-center border rounded px-3 py-2">
              <FiLock className="text-gray-400 mr-2" />
              <input
                type="password"
                {...form.register('password')}
                className="w-full outline-none text-sm"
                placeholder="••••••••"
              />
            </div>
            {form.formState.errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {form.formState.errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition"
          >
            {isLoading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  )
}
