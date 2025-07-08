import { useLoadingStore } from '../../store/loadingStore'

export default function SimpleBackdrop() {
  const { state } = useLoadingStore()

  if (!state.startLoading) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
    </div>
  )
}
