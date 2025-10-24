import { useNotFound } from './model'
import { MdHome, MdArrowBack } from 'react-icons/md'

export const NotFoundView = (props: ReturnType<typeof useNotFound>) => {
  const { goHome, goBack } = props

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 p-8">
      <div className="text-center max-w-lg bg-white rounded-2xl p-12 shadow-2xl">
        <div className="mb-12">
          <h1 className="text-6xl font-bold text-[#1E1E1E] mb-4 leading-none">
            404
          </h1>
          <h2 className="text-2xl font-medium text-[#1E1E1E] mb-2">
            Página não encontrada
          </h2>
          <p className="text-base text-[#CACACA] leading-relaxed">
            A página que você está procurando não existe ou foi removida.
          </p>
        </div>

        <div className="flex gap-4 justify-center flex-wrap">
          <button
            onClick={goHome}
            className="flex items-center gap-2 px-8 py-4 bg-[#0F0A49] text-white rounded-lg font-medium hover:bg-[#0A0836] transition-all duration-300 hover:-translate-y-0.5"
          >
            <MdHome className="text-xl" />
            Voltar ao Início
          </button>
          <button
            onClick={goBack}
            className="flex items-center gap-2 px-8 py-4 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-all duration-300 hover:-translate-y-0.5"
          >
            <MdArrowBack className="text-xl" />
            Página Anterior
          </button>
        </div>
      </div>
    </div>
  )
}
