"use client";

import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from "@headlessui/react";
import { Fragment, useState, useEffect, useRef } from "react";
import { X, Clock, User, Send } from "lucide-react";
import ruta from "@/api/axios";

interface Props {
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
  onVerificado?: (usuario: string) => void; // callback opcional
}

export default function RecuperarPasswordModal({ isOpen, setIsOpen, onVerificado }: Props) {
    const [usuario, setUsuario] = useState("");
    const [codigo, setCodigo] = useState<string[]>(["", "", "", "", "", ""]);
    const [codigoEnviado, setCodigoEnviado] = useState(false);
    const [tiempoRestante, setTiempoRestante] = useState(300);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const inputsRef = useRef<HTMLInputElement[]>([]);

    // Temporizador
    useEffect(() => {
        if (!codigoEnviado) return;
        if (tiempoRestante <= 0) {
            setCodigoEnviado(false);
            setCodigo(["", "", "", "", "", ""]);
            setError("Tiempo agotado, solicita un nuevo código.");
            return;
        }
        const interval = setInterval(() => setTiempoRestante((t) => t - 1), 1000);
        return () => clearInterval(interval);
    }, [codigoEnviado, tiempoRestante]);

    const handleObtenerCodigo = async () => {
        setError(null);
        setLoading(true);
        try {
            const res = await ruta.post("/auth/recuperar-codigo", { usuario });
            if (res.status === 200) {
                setCodigoEnviado(true);
                setTiempoRestante(300);
            }
        } catch (err: any) {
            if (err.response?.data?.mensaje) setError(err.response.data.mensaje);
            else setError("Error de conexión. Intenta nuevamente.");
        } finally {
            setLoading(false);
        }
    };

    const handleChangeCodigo = (index: number, value: string) => {
        if (!/^[0-9]?$/.test(value)) return;
        const nuevoCodigo = [...codigo];
        nuevoCodigo[index] = value;
        setCodigo(nuevoCodigo);

        if (value && index < 5) inputsRef.current[index + 1]?.focus();
        if (!value && index > 0) inputsRef.current[index - 1]?.focus();
    };

    const handleVerificar = async () => {
        const codigoFinal = codigo.join("");
        if (codigoFinal.length !== 6) {
            setError("Debe ingresar los 6 dígitos.");
            return;
        }
        setError(null);
        setLoading(true);
        try {
            const res = await ruta.post("/auth/verificar-codigo", { usuario, codigo: codigoFinal });
            if (res.status === 200) {
                setCodigoEnviado(false);
                setCodigo(["", "", "", "", "", ""]);
                setTiempoRestante(0);
                setIsOpen(false);
                if (onVerificado) onVerificado(usuario); // avisamos al padre
            }
        } catch (err: any) {
            setCodigo(["", "", "", "", "", ""]);
            inputsRef.current[0]?.focus();
            if (err.response?.data?.mensaje) setError(err.response.data.mensaje);
            else setError("Error del servidor, intenta más tarde.");
        } finally {
            setLoading(false);
        }
    };

    return (
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
                    <div className="fixed inset-0 bg-gradient-to-b from-blue-200/60 to-blue-400/50 backdrop-blur-sm" />
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
                        <DialogPanel className="relative w-full max-w-md rounded-2xl bg-white/90 shadow-xl border border-blue-300 p-6 backdrop-blur-md">
                            <DialogTitle className="text-2xl font-bold text-blue-900 text-center">
                                Recuperar Contraseña
                            </DialogTitle>

                            {!codigoEnviado && (
                                <div className="mt-4">
                                    <label className="text-blue-800 text-sm font-semibold flex items-center gap-2">
                                        <User className="h-4 w-4" /> Usuario
                                    </label>
                                    <input
                                        type="text"
                                        value={usuario}
                                        onChange={(e) => setUsuario(e.target.value)}
                                        placeholder="Ingrese su usuario"
                                        className="mt-1 w-full px-4 py-2 rounded-lg border border-blue-300 focus:ring-2 focus:ring-blue-500 text-blue-900 placeholder-blue-400"
                                    />
                                    <button
                                        onClick={handleObtenerCodigo}
                                        disabled={loading || usuario.length < 3}
                                        className="mt-4 flex items-center justify-center gap-2 w-full bg-gradient-to-r from-blue-500 to-cyan-400 text-white py-2 rounded-lg hover:from-blue-600 hover:to-cyan-500 disabled:opacity-50 transition"
                                    >
                                        <Send className="h-5 w-5" />
                                        {loading ? "Enviando..." : "Obtener Código"}
                                    </button>
                                </div>
                            )}

                            {codigoEnviado && (
                                <div className="mt-6">
                                    <div className="flex justify-center gap-2">
                                        {codigo.map((valor, index) => (
                                            <input
                                                key={index}
                                                type="text"
                                                maxLength={1}
                                                value={valor}
                                                ref={(el) => { inputsRef.current[index] = el!; }}
                                                onChange={(e) => handleChangeCodigo(index, e.target.value)}
                                                className="w-12 h-14 text-center border border-blue-300 rounded-lg text-lg focus:ring-2 focus:ring-cyan-400 text-blue-900"
                                            />
                                        ))}
                                    </div>

                                    <div className="flex justify-center items-center gap-1 mt-4 text-sm text-blue-700 font-medium">
                                        <Clock className="h-4 w-4" />
                                        <span>
                                            {Math.floor(tiempoRestante / 60)}:
                                            {(tiempoRestante % 60).toString().padStart(2, "0")}
                                        </span>
                                    </div>

                                    <button
                                        onClick={handleVerificar}
                                        disabled={loading}
                                        className="mt-4 w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-2 rounded-lg hover:from-cyan-600 hover:to-blue-600 transition"
                                    >
                                        {loading ? "Verificando..." : "Verificar"}
                                    </button>
                                </div>
                            )}

                            {error && <p className="mt-3 text-red-500 text-center text-sm">{error}</p>}

                            <button
                                onClick={() => setIsOpen(false)}
                                className="absolute top-3 right-3 text-blue-900 hover:text-blue-700"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </Dialog>
        </Transition>
    );
}
