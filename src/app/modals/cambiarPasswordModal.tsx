"use client";

import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from "@headlessui/react";
import { Fragment, useState } from "react";
import { X, Lock, Check } from "lucide-react";
import { toast } from "react-hot-toast";
import ruta from "@/api/axios";

interface CambiarPasswordModalProps {
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
  usuario: string | null; // Usuario que está cambiando la contraseña
}

export default function CambiarPasswordModal({ isOpen, setIsOpen, usuario }: CambiarPasswordModalProps) {
  const [nuevaContraseña, setNuevaContraseña] = useState("");
  const [confirmarContraseña, setConfirmarContraseña] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCambiarPassword = async () => {
    setError(null);

    if (!nuevaContraseña || !confirmarContraseña) {
      setError("Debes completar ambos campos.");
      return;
    }

    if (nuevaContraseña !== confirmarContraseña) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);
    try {
      const res = await ruta.post("/api/cambiar-password", {
        usuario,
        nuevaContraseña
      });

      if (res.status === 200) {
        toast.success("Contraseña cambiada correctamente.");
        setIsOpen(false);
        setNuevaContraseña("");
        setConfirmarContraseña("");
      }
    } catch (err: any) {
      if (err.response?.data?.mensaje) setError(err.response.data.mensaje);
      else setError("Error del servidor, intenta mas tarde.");
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
                Cambiar Contraseña
              </DialogTitle>

              <div className="mt-4 flex flex-col gap-4">
                <p>usuario: {usuario}</p>
                <div>
                  <label className="text-blue-800 text-sm font-semibold flex items-center gap-2">
                    <Lock className="h-4 w-4" /> Nueva Contraseña
                  </label>
                  <input
                    type="password"
                    value={nuevaContraseña}
                    onChange={(e) => setNuevaContraseña(e.target.value)}
                    placeholder="Ingresa la nueva contraseña"
                    className="mt-1 w-full px-4 py-2 rounded-lg border border-blue-300 focus:ring-2 focus:ring-cyan-400 text-blue-900 placeholder-blue-400"
                  />
                </div>

                <div>
                  <label className="text-blue-800 text-sm font-semibold flex items-center gap-2">
                    <Lock className="h-4 w-4" /> Confirmar Contraseña
                  </label>
                  <input
                    type="password"
                    value={confirmarContraseña}
                    onChange={(e) => setConfirmarContraseña(e.target.value)}
                    placeholder="Confirma tu contraseña"
                    className="mt-1 w-full px-4 py-2 rounded-lg border border-blue-300 focus:ring-2 focus:ring-cyan-400 text-blue-900 placeholder-blue-400"
                  />
                </div>

                <button
                  onClick={handleCambiarPassword}
                  disabled={loading}
                  className="mt-2 w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-2 rounded-lg hover:from-cyan-600 hover:to-blue-600 transition flex items-center justify-center gap-2"
                >
                  <Check className="h-5 w-5" />
                  {loading ? "Cambiando..." : "Cambiar Contraseña"}
                </button>

                {error && <p className="text-red-500 text-center text-sm">{error}</p>}
              </div>

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
