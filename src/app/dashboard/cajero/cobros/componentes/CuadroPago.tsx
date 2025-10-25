'use client'

import React, { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { Comprobante } from '../datos/comprobantes';
import { AnimacionMascota, Moneda } from '@/animaciones/Animaciones';
import ConfirmModalPago from '@/app/modals/ConfirmModalPago';
import ruta from '@/api/axios'
import toast from 'react-hot-toast'

export default function CuadroPago({
  comprobantesSeleccionados,
  onRemoveComprobante,
  onClearCarrito
}: {
  comprobantesSeleccionados: Comprobante[];
  onRemoveComprobante: (id: number) => void;
  onClearCarrito: () => void;
}) {
  const { isOver, setNodeRef } = useDroppable({ id: "zona-pago" });
  const [modalAbierto, setModalAbierto] = useState(false) //Modal de pago
  const [mostrarModal, setMostrarModal] = useState(false); //Modal de confirmación para abrir el pdf
  const [pagando, setPagando] = useState(false)
  const [rutaComprobante, setRutaComprobante] = useState<string | null>(null);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('es-BO', { style: 'currency', currency: 'BOB' }).format(amount);

  const total = comprobantesSeleccionados.reduce((acc, c) => acc + c.totalPagar, 0);

  const confirmarPago = async () => {
    try {
      setPagando(true);

      const body = {
        comprobantes: comprobantesSeleccionados.map(c => c.idComprobante),
      };

      const res = await ruta.post("/servicios/pagos", body);

      toast.success("Pago realizado correctamente", {
        duration: 4000,
      });
      if (res.data?.rutaComprobante) {
        setRutaComprobante(`${process.env.NEXT_PUBLIC_API_URL_CELULAR}${res.data.rutaComprobante}`);
        setMostrarModal(true); // muestra el modal de confirmación
      }
      onClearCarrito();
    } catch (e: any) {
      toast.error(e.response?.data?.mensaje || "Error al procesar pago", {
        duration: 4000
      });
    } finally {
      setPagando(false);
      setModalAbierto(false);
    }
  };

  const abrirPDF = () => {
    if (rutaComprobante) {
      window.open(rutaComprobante, "_blank");
    }
    setMostrarModal(false);
  };

  return (
    <div className="sticky top-6">
      <div
        ref={setNodeRef}
        className={`relative min-h-[500px] rounded-2xl p-6 transition-all duration-300 shadow-xl
          bg-gradient-to-br from-blue-600 to-cyan-300
          ${isOver ? 'ring-4 ring-yellow-400 scale-105' : 'ring-2 ring-blue-400'}`}
      >

        <div className={`absolute inset-0 flex items-center justify-end pointer-events-none transition-opacity duration-300 ${isOver ? 'opacity-70 z-50' : 'opacity-0 -z-10'}`}>
          <AnimacionMascota className="w-72 h-72" />
        </div>


        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
            <Moneda />
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">Carrito de Pago</h3>
          <p className="text-blue-100 text-sm">
            {isOver ? '¡Suelta aquí!' : 'Arrastra o agrega comprobantes'}
          </p>
        </div>

        <div className="mb-4">
          {comprobantesSeleccionados.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-white/40 text-6xl mb-4">{isOver ? '' : '💧'}</div>
              <p className="text-white/60 text-sm">{isOver ? '' : 'No hay comprobantes\nen el carrito'}</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[280px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/30 scrollbar-track-transparent">
              {comprobantesSeleccionados.map(c => (
                <div key={c.idComprobante} className="bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-md transition-all hover:bg-white">
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">💧</span>
                        <p className="font-bold text-gray-900 text-sm">
                          {c.lectura?.medidor?.idMedidor || `Comp-${c.idComprobante}`}
                        </p>
                      </div>
                      <p className="text-xs text-gray-600 mb-2">{c.lectura?.medidor?.ubicacionSocio?.direccion}</p>
                      <p className="text-lg font-bold text-blue-600">{formatCurrency(c.totalPagar)}</p>
                    </div>
                    <button
                      onClick={() => onRemoveComprobante(c.idComprobante)}
                      className="w-8 h-8 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition-all flex items-center justify-center font-bold active:scale-90"
                      title="Quitar comprobante"
                    >✕</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {comprobantesSeleccionados.length > 0 && (
        <div className="mt-3">
          <div className="bg-white backdrop-blur-sm rounded-xl p-5 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total a pagar</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(total)}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Comprobantes</p>
                <p className="text-2xl font-bold text-blue-600">{comprobantesSeleccionados.length}</p>
              </div>
            </div>

            <button
              onClick={() => setModalAbierto(true)}
              disabled={pagando}
              className={`w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-95 flex items-center justify-center gap-2 ${pagando ? 'opacity-70 cursor-not-allowed' : ''
                }`}
            >
              {pagando ? (
                <>
                  <span className="animate-spin">⏳</span>
                  <span>Procesando...</span>
                </>
              ) : (
                <>
                  <span className="text-xl">✓</span>
                  <span>Proceder al Pago</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      <ConfirmModalPago
        isOpen={modalAbierto}
        onCancel={() => setModalAbierto(false)}
        onConfirm={confirmarPago}
        comprobantes={comprobantesSeleccionados}
      />

      {mostrarModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[99999]">
          <div className="bg-white rounded-xl shadow-2xl w-[90%] md:w-[400px] p-6 relative text-center">
            <h2 className="text-lg font-semibold mb-4">Pago completado</h2>
            <p className="text-gray-700 mb-6">
              ¿Deseas abrir el comprobante PDF ahora?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={abrirPDF}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Sí, abrir
              </button>
              <button
                onClick={() => setMostrarModal(false)}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
              >
                No, gracias
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
