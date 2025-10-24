'use client'

import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { Comprobante } from '../datos/comprobantes';
import { AnimacionMascota } from '@/animaciones/Animaciones';

export default function CuadroPago({
  comprobantesSeleccionados,
  onRemoveComprobante
}: {
  comprobantesSeleccionados: Comprobante[];
  onRemoveComprobante: (id: number) => void;
}) {
  const { isOver, setNodeRef } = useDroppable({ id: "zona-pago" });

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('es-BO', { style: 'currency', currency: 'BOB' }).format(amount);

  const total = comprobantesSeleccionados.reduce((acc, c) => acc + c.totalPagar, 0);

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
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
            <span className="text-4xl">💳</span>
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
                          {c.lectura?.medidor?.codigoMedidor || `Comp-${c.idComprobante}`}
                        </p>
                      </div>
                      <p className="text-xs text-gray-600 mb-2">{c.lectura?.medidor?.direccion}</p>
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

            <button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-95 flex items-center justify-center gap-2">
              <span className="text-xl">✓</span>
              <span>Proceder al Pago</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
