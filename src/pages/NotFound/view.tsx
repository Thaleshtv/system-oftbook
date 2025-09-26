import './style.scss'
import { useNotFound } from './model'
import { MdHome, MdArrowBack } from 'react-icons/md'

export const NotFoundView = (props: ReturnType<typeof useNotFound>) => {
  const { goHome, goBack } = props

  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <div className="error-info">
          <h1 className="error-code">404</h1>
          <h2 className="error-title">Página não encontrada</h2>
          <p className="error-description">
            A página que você está procurando não existe ou foi removida.
          </p>
        </div>

        <div className="action-buttons">
          <button onClick={goHome} className="btn btn-primary">
            <MdHome className="icon" />
            Voltar ao Início
          </button>
          <button onClick={goBack} className="btn btn-secondary">
            <MdArrowBack className="icon" />
            Página Anterior
          </button>
        </div>
      </div>
    </div>
  )
}
