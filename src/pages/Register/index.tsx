import { useRegister } from './model'
import { RegisterView } from './view'

export const Register = () => {
  const modelRegister = useRegister()

  return <RegisterView {...modelRegister} />
}
