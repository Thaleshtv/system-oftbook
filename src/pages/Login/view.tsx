import './style.scss'
import { useLogin } from './model'

export const LoginView = (props: ReturnType<typeof useLogin>) => {
  return (
    <div className="container mx-auto">
      Página de login
      <h1>Ola</h1>
    </div>
  )
}
