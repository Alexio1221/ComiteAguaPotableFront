'use client'

import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition, TransitionChild, DialogTitle, DialogPanel } from "@headlessui/react";
import { toast } from "react-hot-toast";
import FormularioAvisos from "../avisos/FormularioAvisos";

export default function ModalGuardar({ visible, onClose, onGuardar, figuraTemporal }: any) {
    const [tituloFigura, setTituloFigura] = useState("");
    const [subtipo, setSubtipo] = useState("tanque");

    useEffect(() => {
        if (visible) {
            setTituloFigura("");
            setSubtipo("tanque");
        }
    }, [visible]);

    const esMarcador = figuraTemporal?.layerType === "marker";
    const esLinea = figuraTemporal?.layerType === "polyline";
    const esFigura = !esMarcador && !esLinea;

    return (
        <Transition show={visible} as={Fragment}>
            <Dialog
                as="div"
                className="relative z-[1000]"
                onClose={onClose} // ✔ se cierra al hacer clic afuera
            >
                {/* Fondo oscuro con fade */}
                <TransitionChild
                    as={Fragment}
                    enter="ease-out duration-200"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-150"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-40" />
                </TransitionChild>

                {/* Contenedor centrado */}
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <TransitionChild
                        as={Fragment}
                        enter="ease-out duration-200"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-150"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <DialogPanel className="bg-white w-96 rounded-xl shadow-xl p-6 relative">
                            
                            {/* Botón cerrar */}
                            <button
                                onClick={onClose}
                                className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-lg"
                            >
                                ✕
                            </button>

                            <DialogTitle className="text-lg font-semibold mb-4">
                                Guardar Componente
                            </DialogTitle>

                            {/* FIGURA (formulario completo) */}
                            {esFigura && (
                                <FormularioAvisos
                                    onGuardarTituloFigura={(titulo) => {
                                        setTituloFigura(titulo);
                                        setSubtipo("aviso");
                                        onGuardar(titulo, "aviso");
                                        onClose();
                                    }}
                                />
                            )}

                            {/* MARCADOR */}
                            {esMarcador && (
                                <>
                                    <label className="text-sm text-gray-700">Título (descripción):</label>
                                    <input
                                        type="text"
                                        value={tituloFigura}
                                        onChange={(e) => setTituloFigura(e.target.value)}
                                        className="w-full border border-gray-300 rounded px-3 py-1 mt-2 mb-4"
                                    />

                                    <label className="text-sm text-gray-700">Tipo:</label>
                                    <select
                                        value={subtipo}
                                        onChange={(e) => setSubtipo(e.target.value)}
                                        className="w-full border border-gray-300 rounded px-3 py-1 mt-1 mb-4"
                                    >
                                        <option value="tanque">Tanque</option>
                                        <option value="valvula">Válvula</option>
                                        <option value="bomba">Bomba</option>
                                    </select>

                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={() => { setTituloFigura(""); onClose(); }}
                                            className="px-3 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                                        >
                                            Cancelar
                                        </button>

                                        <button
                                            onClick={() => {
                                                if (!tituloFigura.trim()) return toast.error("Ingresa un nombre");
                                                onGuardar(tituloFigura, subtipo);
                                                setTituloFigura("");
                                            }}
                                            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                                        >
                                            Guardar
                                        </button>
                                    </div>
                                </>
                            )}

                            {/* LÍNEA */}
                            {esLinea && (
                                <>
                                    <label className="text-sm text-gray-700">Título (descripción):</label>
                                    <input
                                        type="text"
                                        value={tituloFigura}
                                        onChange={(e) => setTituloFigura(e.target.value)}
                                        className="w-full border border-gray-300 rounded px-3 py-1 mt-2 mb-4"
                                    />

                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={() => { setTituloFigura(""); onClose(); }}
                                            className="px-3 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                                        >
                                            Cancelar
                                        </button>

                                        <button
                                            onClick={() => {
                                                if (!tituloFigura.trim()) return toast.error("Ingresa un nombre");
                                                onGuardar(tituloFigura, "tuberia");
                                                setTituloFigura("");
                                            }}
                                            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                                        >
                                            Guardar
                                        </button>
                                    </div>
                                </>
                            )}

                        </DialogPanel>
                    </TransitionChild>
                </div>
            </Dialog>
        </Transition>
    );
}
