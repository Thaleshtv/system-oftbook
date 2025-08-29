import { useNewPassword } from './model'
import { NewPasswordView } from './view'

export const NewPassword = () => {
  const modelNewPassword = useNewPassword()

  return <NewPasswordView {...modelNewPassword} />
}
