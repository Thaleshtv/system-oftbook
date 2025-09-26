import { useNotFound } from './model'
import { NotFoundView } from './view'

export const NotFound = () => {
  const modelNotFound = useNotFound()

  return <NotFoundView {...modelNotFound} />
}
