import './style.scss'
import { useLogin } from './model'
import loginImage from '../../assets/capa-oftbook.png'
import Logo from '../../assets/logo-ofbook.png'
import { MdPerson, MdVpnKey } from 'react-icons/md' // Material Icons

export const LoginView = (props: ReturnType<typeof useLogin>) => {
  const { form, handleSubmit, isLoading } = props

  return (
    <div className="min-h-screen flex">
      {/* Lado Esquerdo - Formulário */}
      <div className="flex flex-col justify-center items-center w-1/2 bg-white">
        <div className="">
          <form onSubmit={handleSubmit} className="space-y-5 w-[410px]">
            <img src={Logo} alt="Logo Oftbook" className="mb-[64px]" />
            <div className="header">
              <div className="title">Login</div>
              <div className="subTitle">Seja bem vindo de volta! </div>
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium text-[#1E1E1E]">
                E-mail
              </label>

              <div className="flex items-center border border-[#CACACA] rounded-[8px]  bg-[#FAFAFA] px-[24px] py-[16px]">
                <MdPerson className="text-gray-400 mr-2" />
                <input
                  type="email"
                  {...form.register('email')}
                  className="w-full outline-none text-[16px] bg-[#FAFAFA]"
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
              <label className="block mb-1 text-sm font-medium text-[#1E1E1E]">
                Senha
              </label>
              <div className="flex items-center border border-[#CACACA] rounded-[8px] bg-[#FAFAFA] px-[24px] py-[16px]">
                <MdVpnKey className="text-gray-400 mr-2" />
                <input
                  type="password"
                  {...form.register('password')}
                  className="w-full outline-none text-[16px] bg-[#FAFAFA]"
                  placeholder="********"
                />
              </div>
              {form.formState.errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>

            <div className="flex align-center justify-end">
              <a
                onClick={props.handleDirectionRedefinir}
                className="text-sm text-[#0F0A49] text-right underline cursor-pointer"
              >
                Esqueceu sua senha?
              </a>
            </div>
            <button
              type="submit"
              className="w-full py-3 mt-5 text-white text-[12px] bg-[#0F0A49] rounded-[8px] hover:bg-[#0A0836]"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Entrando...</span>
                </div>
              ) : (
                'Entrar'
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
