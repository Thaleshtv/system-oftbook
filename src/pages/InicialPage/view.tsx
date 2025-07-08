import './style.scss'
import { useInicialPage } from './model'

export const InicialPageView = (props: ReturnType<typeof useInicialPage>) => {
  return (
    <div className="inicial-page">
      <h1>Bem-vindo à Página Inicial</h1>
      <p>Esta é a página inicial do seu aplicativo.</p>
    </div>
  )
}
