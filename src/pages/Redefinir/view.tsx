import './style.scss'
import { useRedefinir } from './model'
import loginImage from '../../assets/login.png'
import Logo from '../../assets/altona.png'
import { MdPerson } from 'react-icons/md' // Material Icons

export const RedefinirView = (props: ReturnType<typeof useRedefinir>) => {
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
                Redefinir sua <br /> senha
              </div>
              <div className="subTitle">Informe o seu email</div>
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

            <div className="flex align-center justify-end">
              <a
                onClick={props.handleNavigationToLogin}
                className="text-sm text-[#004080] text-right underline cursor-pointer"
              >
                Lembrei minha senha
              </a>
            </div>
            <button
              type="submit"
              className="w-full py-3 mt-5 text-white text-[12px] bg-[#004080] rounded-[8px] hover:bg-[#003366]"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Enviando...</span>
                </div>
              ) : (
                'Enviar'
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
