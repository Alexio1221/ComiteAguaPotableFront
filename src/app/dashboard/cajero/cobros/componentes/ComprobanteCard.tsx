'use client'

import React from 'react';
import { Comprobante } from '../datos/comprobantes';
import { useDraggable } from '@dnd-kit/core';

export default function ComprobanteItem({
  comprobante,
  isInPaymentBox,
  onAddToPayment
}: {
  comprobante: Comprobante;
  isInPaymentBox: boolean;
  onAddToPayment: (comprobante: Comprobante) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `comprobante-${comprobante.idComprobante}`,
    disabled: isInPaymentBox,
  });

  const style: React.CSSProperties = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    transition: isDragging ? 'none' : 'transform 0.2s ease',
    zIndex: isDragging ? 999 : undefined,
  };

  const formatDate = (date: Date) => new Date(date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
  const formatCurrency = (amount: number) => new Intl.NumberFormat('es-BO', { style: 'currency', currency: 'BOB' }).format(amount);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative overflow-hidden border-2 rounded-2xl shadow-lg transition-all duration-300
        hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]
        ${isInPaymentBox ? 'opacity-60' : ''} ${isDragging ? 'ring-4 ring-blue-400 ring-opacity-50' : ''}
      `}
    >
      {!isInPaymentBox && (
        <div {...listeners} {...attributes} className="absolute top-0 left-0 right-0 h-12 cursor-grab active:cursor-grabbing flex items-center justify-center z-10">
          <div className="flex gap-1 opacity-30 hover:opacity-60 transition-opacity">
            <div className="w-1 h-6 bg-gray-400 rounded-full"></div>
            <div className="w-1 h-6 bg-gray-400 rounded-full"></div>
            <div className="w-1 h-6 bg-gray-400 rounded-full"></div>
          </div>
        </div>
      )}

      <div className="relative z-0 p-5 pt-12">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-md">
              <span className="text-white text-xl">💧</span>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-lg">{comprobante.lectura?.medidor?.codigoMedidor || `Comp-${comprobante.idComprobante}`}</h4>
              <p className="text-sm text-gray-600 flex items-center gap-1">
                <span>📍</span>
                {comprobante.lectura?.medidor?.direccion || 'Dirección no disponible'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200 mb-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">💵 Consumo básico:</span>
              <span className="font-semibold text-gray-900">{formatCurrency(comprobante.montoBasico)}</span>
            </div>
            {comprobante.montoAdicional > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">➕ Consumo adicional:</span>
                <span className="font-semibold text-gray-900">{formatCurrency(comprobante.montoAdicional)}</span>
              </div>
            )}
            {comprobante.moraAcumulada > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-red-600">⚠️ Mora acumulada:</span>
                <span className="font-semibold text-red-700">{formatCurrency(comprobante.moraAcumulada)}</span>
              </div>
            )}
          </div>

          <div className="flex justify-between items-center mt-3 pt-3 border-t-2 border-blue-200">
            <span className="font-bold text-gray-900">Total a pagar:</span>
            <span className="text-2xl font-bold text-blue-600">{formatCurrency(comprobante.totalPagar)}</span>
          </div>
        </div>

        {!isInPaymentBox && (
          <button
            onClick={() => onAddToPayment(comprobante)}
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-95"
          >
            <span>➕</span>
            <span>Agregar al pago</span>
          </button>
        )}
      </div>
    </div>
  );
}
