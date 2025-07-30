import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";

export default function LoginButton() {
  const [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  return (
    <>
      <button
        onClick={openModal}
        className="flex items-center bg-white text-blue-700 px-4 py-2 rounded-md font-semibold hover:bg-gray-100 ml-4 gap-2"
      >
        <ArrowRightOnRectangleIcon className="h-5 w-5" />
        Iniciar sesión
      </button>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Iniciar sesión
                  </Dialog.Title>
                  <div className="mt-2">
                    <form>
                      <input
                        type="email"
                        placeholder="Correo electrónico"
                        className="w-full mb-3 p-2 border border-gray-300 rounded"
                      />
                      <input
                        type="password"
                        placeholder="Contraseña"
                        className="w-full mb-3 p-2 border border-gray-300 rounded"
                      />
                      <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
                      >
                        Entrar
                      </button>
                    </form>
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      className="text-sm text-blue-500 hover:underline"
                      onClick={closeModal}
                    >
                      Cerrar
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
