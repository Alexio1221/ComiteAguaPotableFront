// GlobalModal.tsx
'use client'

import { Fragment } from "react";
import { Dialog, Transition, DialogTitle, TransitionChild } from "@headlessui/react";
import { AnimacionAgua } from "@/animaciones/Animaciones";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    titulo?: string;
    children?: React.ReactNode;
}

export default function GlobalModal({ isOpen, onClose, titulo, children }: ModalProps) {
    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="fixed inset-0 z-50 overflow-y-auto" onClose={onClose}>
                <div className="min-h-screen px-4 text-center">
                    <TransitionChild
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-50" />
                    </TransitionChild>


                    {/* Centrar modal verticalmente */}
                    <span className="inline-block h-screen align-middle" aria-hidden="true">
                        &#8203;
                    </span>

                    <TransitionChild
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle 
                            bg-white rounded-2xl shadow-2xl transform transition-all border-t-4 border-blue-500">
                            {/* Contenido del modal */}
                            <div className="relative z-10">
                                {titulo && (
                                    <DialogTitle as="h3" className="text-lg font-semibold text-blue-700 mb-4 text-center">
                                        {titulo}
                                    </DialogTitle>
                                )}

                                <div className="mb-4">
                                    {children}
                                </div>

                                <div className="mt-4 text-right">
                                    <button
                                        onClick={onClose}
                                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors"
                                    >
                                        Cerrar
                                    </button>
                                </div>
                            </div>
                            {/* Animación de fondo */}
                            <div className="absolute inset-0 z-0">
                                <AnimacionAgua className="w-full h-full object-cover opacity-30" />
                            </div>
                        </div>
                        
                    </TransitionChild>
                </div>
            </Dialog>
        </Transition>
    );
}
