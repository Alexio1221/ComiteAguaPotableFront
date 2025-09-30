"use client";

import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from "@headlessui/react";
import { Fragment, useState } from "react";
import { XMarkIcon, ExclamationTriangleIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import { FormularioLogin } from "../componentes/login/formularioLogin";

export default function LoginModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex px-4 py-2 bg-blue-700 text-white rounded-md font-semibold hover:bg-blue-800 justify-center gap-1"
      >
        <UserCircleIcon className="h-6 w-6" />
        Iniciar sesión
        
      </button>

      <Transition show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setIsOpen(false)}>
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-60" />
          </TransitionChild>

          <div className="fixed inset-0 flex items-center justify-center p-4">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="relative w-full max-w-[500px] rounded-lg overflow-hidden">
                {/* Imagen de fondo */}
                <div
                  className="relative bg-cover bg-center px-5 py-10"
                  style={{ backgroundImage: `url('/imagenes/loginImagen.webp')` }}
                >
                  {/* Fondo oscurecido */}
                  <div className="absolute inset-0 bg-black bg-opacity-20" />

                  {/* Contenido */}
                  <div className="relative z-10 text-white text-center">
                    <DialogTitle className="text-2xl font-bold mb-1">
                      Iniciar sesión
                    </DialogTitle>

                    <div className="flex justify-center space-x-2 mb-6">
                      <p className="text-sm">Solo miembros autorizados del comité</p>
                      <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />
                    </div>
                    
                    <FormularioLogin />
                  </div>

                  {/* Botón de cerrar */}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="absolute top-4 right-4 text-white hover:text-gray-300"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
