import { useRegister } from './model'
import loginImage from '../../assets/capa-oftbook.png'
import Logo from '../../assets/logo-ofbook.png'
import {
  MdPerson,
  MdEmail,
  MdVpnKey,
  MdLanguage,
  MdAssignmentInd
} from 'react-icons/md'

export const RegisterView = (props: ReturnType<typeof useRegister>) => {
  const {
    form,
    handleSubmit,
    isLoading,
    handleDirectionLogin,
    handleCPFChange
  } = props

  return (
    <div className="min-h-screen flex">
      {/* Lado Esquerdo - Formulário */}
      <div className="flex flex-col justify-center items-center w-1/2 bg-white">
        <div className="">
          <form onSubmit={handleSubmit} className="space-y-5 w-[410px]">
            <img src={Logo} alt="Logo Oftbook" className="mb-[px]" />
            <div className="flex flex-col items-start">
              <div className="text-[48px] font-medium">Cadastre-se</div>
            </div>

            {/* Nome Completo */}
            <div>
              <label className="block mb-1 text-sm font-medium text-[#1E1E1E]">
                Nome Completo
              </label>
              <div className="flex items-center border border-[#CACACA] rounded-[8px] bg-[#FAFAFA] px-[24px] py-[16px]">
                <MdPerson className="text-gray-400 mr-2" />
                <input
                  type="text"
                  {...form.register('fullName')}
                  className="w-full outline-none text-[16px] bg-[#FAFAFA]"
                  placeholder="Digite seu nome completo"
                />
              </div>
              {form.formState.errors.fullName && (
                <p className="text-red-500 text-sm mt-1">
                  {form.formState.errors.fullName.message}
                </p>
              )}
            </div>

            {/* E-mail */}
            <div>
              <label className="block mb-1 text-sm font-medium text-[#1E1E1E]">
                E-mail
              </label>
              <div className="flex items-center border border-[#CACACA] rounded-[8px] bg-[#FAFAFA] px-[24px] py-[16px]">
                <MdEmail className="text-gray-400 mr-2" />
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

            {/* CPF */}
            <div>
              <label className="block mb-1 text-sm font-medium text-[#1E1E1E]">
                CPF
              </label>
              <div className="flex items-center border border-[#CACACA] rounded-[8px] bg-[#FAFAFA] px-[24px] py-[16px]">
                <MdAssignmentInd className="text-gray-400 mr-2" />
                <input
                  type="text"
                  {...form.register('cpf')}
                  onChange={handleCPFChange}
                  maxLength={14}
                  className="w-full outline-none text-[16px] bg-[#FAFAFA]"
                  placeholder="000.000.000-00"
                />
              </div>
              {form.formState.errors.cpf && (
                <p className="text-red-500 text-sm mt-1">
                  {form.formState.errors.cpf.message}
                </p>
              )}
            </div>

            {/* Senha */}
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
                  placeholder="Digite sua senha"
                />
              </div>
              {form.formState.errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>

            {/* Confirmar Senha */}
            <div>
              <label className="block mb-1 text-sm font-medium text-[#1E1E1E]">
                Confirmar Senha
              </label>
              <div className="flex items-center border border-[#CACACA] rounded-[8px] bg-[#FAFAFA] px-[24px] py-[16px]">
                <MdVpnKey className="text-gray-400 mr-2" />
                <input
                  type="password"
                  {...form.register('confirmPassword')}
                  className="w-full outline-none text-[16px] bg-[#FAFAFA]"
                  placeholder="Confirme sua senha"
                />
              </div>
              {form.formState.errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {form.formState.errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Escolha sua Linguagem */}
            <div>
              <label className="block mb-1 text-sm font-medium text-[#1E1E1E]">
                Escolha sua Linguagem
              </label>
              <div className="flex items-center border border-[#CACACA] rounded-[8px] bg-[#FAFAFA] px-[24px] py-[16px]">
                <MdLanguage className="text-gray-400 mr-2" />
                <select
                  {...form.register('language')}
                  className="w-full outline-none text-[16px] bg-[#FAFAFA]"
                >
                  <option value="">Selecione uma linguagem</option>
                  <option value="pt-BR">Português (Brasil)</option>
                  <option value="en-US">English (United States)</option>
                  <option value="es-ES">Español (España)</option>
                  <option value="fr-FR">Français (France)</option>
                  <option value="de-DE">Deutsch (Deutschland)</option>
                  <option value="it-IT">Italiano (Italia)</option>
                  <option value="ja-JP">日本語 (Japan)</option>
                  <option value="ko-KR">한국어 (Korea)</option>
                  <option value="zh-CN">中文 (简体)</option>
                  <option value="zh-TW">中文 (繁體)</option>
                </select>
              </div>
              {form.formState.errors.language && (
                <p className="text-red-500 text-sm mt-1">
                  {form.formState.errors.language.message}
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
                  <span>Cadastrando...</span>
                </div>
              ) : (
                'Criar Conta'
              )}
            </button>

            <div className="flex align-center justify-center mt-4">
              <span className="text-sm text-[#636363]">
                Já tem uma conta?
                <a
                  onClick={handleDirectionLogin}
                  className="text-[#0F0A49] underline cursor-pointer"
                >
                  Fazer login
                </a>
              </span>
            </div>
          </form>
        </div>
      </div>

      {/* Lado Direito - Imagem */}
      <div className="w-1/2 h-screen">
        <img
          src={loginImage}
          alt="Tela de Cadastro"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  )
}
