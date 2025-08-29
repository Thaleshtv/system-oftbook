import { useNewPassword } from './model'
import './styles.scss'
import loginImage from '../../assets/login.png'
import Logo from '../../assets/altona.png'
import { MdPerson, MdVpnKey } from 'react-icons/md' // Material Icons

export const NewPasswordView = (props: ReturnType<typeof useNewPassword>) => {
  const { form, handleSubmit, isLoading } = props

  return (
    <div className="min-h-screen flex">
      {/* Lado Esquerdo - Formulário */}
      <div className="flex flex-col justify-center items-center w-1/2 bg-white">
        <div className="">
          <form onSubmit={handleSubmit} className="space-y-5 form">
            <div className="header">
              <img src={Logo} alt="Logo Altona" />
              <div className="title">
                Digite sua nova <br /> senha
              </div>
              <div className="subTitle">Informa a sua nova senha</div>
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-[#1E1E1E]">
                Nova Senha
              </label>

              <div className="flex items-center border border-[#CACACA] rounded-[8px]  bg-[#FAFAFA] px-[24px] py-[16px]">
                <MdVpnKey className="text-gray-400 mr-2" />
                <input
                  type="password"
                  {...form.register('password')}
                  className="w-full outline-none text-[16px] bg-[#FAFAFA]"
                  placeholder="Digite sua nova senha"
                />
              </div>
              {form.formState.errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>
            {/* Confirmar nova senha */}
            <div>
              <label className="block mb-1 text-sm font-medium text-[#1E1E1E]">
                Confirme a senha
              </label>

              <div className="flex items-center border border-[#CACACA] rounded-[8px]  bg-[#FAFAFA] px-[24px] py-[16px]">
                <MdVpnKey className="text-gray-400 mr-2" />
                <input
                  type="password"
                  {...form.register('confirmPassword')}
                  className="w-full outline-none text-[16px] bg-[#FAFAFA]"
                  placeholder="Confirme sua nova senha"
                />
              </div>
              {form.formState.errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {form.formState.errors.confirmPassword.message}
                </p>
              )}
            </div>
            <button
              type="submit"
              className="w-full py-3 mt-5 text-white text-[12px] bg-[#004080] rounded-[8px] hover:bg-[#003366]"
              disabled={isLoading}
            >
              {isLoading ? 'Carregando...' : 'Redefinir'}
            </button>
          </form>
        </div>
      </div>

      {/* Lado Direito - Imagem */}
      {/* Lado Direito - Imagem */}
      <div className="w-1/2 h-screen">
        <img
          src={loginImage}
          alt="Tela de Login"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  )
}
