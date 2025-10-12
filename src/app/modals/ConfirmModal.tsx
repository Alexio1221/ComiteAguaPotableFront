import { Dialog, Transition, DialogPanel, TransitionChild, DialogTitle } from '@headlessui/react'
import { Fragment } from 'react'
import { AlertTriangle, X, Trash2, CheckCircle } from 'lucide-react'

interface ConfirmModalProps {
  isOpen: boolean
  title?: string
  message: string
  onConfirm: () => void
  onCancel: () => void
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, title, message, onConfirm, onCancel }) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onCancel}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        </TransitionChild>

        <div className="fixed inset-0 flex items-center justify-center p-3 sm:p-4">
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95 translate-y-4"
            enterTo="opacity-100 scale-100 translate-y-0"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100 translate-y-0"
            leaveTo="opacity-0 scale-95 translate-y-4"
          >
            <DialogPanel className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-red-100">
              {/* Icono de advertencia animado */}
              <div className="bg-gradient-to-br from-red-50 to-orange-50 p-6 sm:p-8 flex justify-center">
                <div className="relative">
                  {/* Círculo pulsante de fondo */}
                  <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-20" />
                  <div className="relative bg-gradient-to-br from-red-500 to-orange-600 p-4 rounded-full shadow-lg">
                    <AlertTriangle className="text-white" size={40} />
                  </div>
                </div>
              </div>

              {/* Contenido */}
              <div className="p-6 sm:p-8">
                {title && (
                  <DialogTitle className="text-xl sm:text-2xl font-bold text-gray-800 text-center mb-3">
                    {title}
                  </DialogTitle>
                )}
                <p className="text-gray-600 text-center text-sm sm:text-base leading-relaxed">
                  {message}
                </p>
              </div>

              {/* Botones de acción */}
              <div className="bg-gray-50 px-6 sm:px-8 py-4 sm:py-5 flex flex-col-reverse sm:flex-row justify-center gap-3">
                <button
                  onClick={onCancel}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 active:scale-95 transition-all font-medium flex items-center justify-center gap-2 shadow-sm text-sm sm:text-base"
                >
                  <X size={18} />
                  Cancelar
                </button>
                <button
                  onClick={onConfirm}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-orange-600 text-white hover:from-red-700 hover:to-orange-700 hover:shadow-lg active:scale-95 transition-all font-semibold flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <Trash2 size={18} />
                  Sí, Eliminar
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  )
}

export default ConfirmModal