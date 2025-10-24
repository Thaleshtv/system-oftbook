import { useNewPassword } from './model'
import loginImage from '../../assets/capa-oftbook.png'
import Logo from '../../assets/logo-ofbook.png'
import { MdVpnKey } from 'react-icons/md' // Material Icons

export const NewPasswordView = (props: ReturnType<typeof useNewPassword>) => {
  const { form, handleSubmit, isLoading } = props

  return (
    <div className="min-h-screen flex">
      {/* Lado Esquerdo - Formulário */}
      <div className="flex flex-col justify-center items-center w-1/2 bg-white">
        <div className="">
          <form onSubmit={handleSubmit} className="space-y-5 w-[410px]">
            <img src={Logo} alt="Logo Oftbook" className="mb-[64px]" />
            <div className="flex flex-col items-start">
              <div className="text-5xl font-medium">
                Digite sua nova <br /> senha
              </div>
              <div className="text-base font-light text-[#CACACA]">
                Informa a sua nova senha
              </div>
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
              className="w-full py-3 mt-5 text-white text-[12px] bg-[#0F0A49] rounded-[8px] hover:bg-[#0A0836]"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Redefinindo...</span>
                </div>
              ) : (
                'Redefinir'
              )}
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
