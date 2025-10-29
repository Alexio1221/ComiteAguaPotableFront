'use client'

import React from 'react';
import { Comprobante } from '../../tipos';
import { useDraggable } from '@dnd-kit/core';
import {
  Droplet,
  MapPin,
  Plus,
  AlertTriangle,
  CircleDollarSign,
  Clock,
  Calendar,
} from 'lucide-react';

export default function ComprobanteItem({
  comprobante,
  isInPaymentBox,
  onAddToPayment,
  color
}: {
  comprobante: Comprobante;
  isInPaymentBox: boolean;
  onAddToPayment: (comprobante: Comprobante) => void;
  color: { from: string; to: string };
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `comprobante-${comprobante.idComprobante}`,
    disabled: isInPaymentBox,
  });

  const style: React.CSSProperties = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    transition: isDragging ? 'none' : 'transform 0.2s ease',
    zIndex: isDragging ? 999 : undefined,
    opacity: isDragging ? 0 : 1
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('es-BO', { style: 'currency', currency: 'BOB' }).format(amount);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative overflow-hidden border-2 rounded-xl sm:rounded-2xl shadow-lg transition-all duration-300
        hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]
        ${isInPaymentBox ? 'opacity-60' : ''} ${isDragging ? 'ring-4 ring-blue-400 ring-opacity-50' : ''}
      `}
    >

      {!isInPaymentBox && (
        <div
          {...listeners}
          {...attributes}
          className="absolute top-0 left-0 right-0 h-10 sm:h-12 cursor-grab active:cursor-grabbing flex items-center justify-center z-10"
        >
          <div className="flex gap-1 opacity-30 hover:opacity-60 transition-opacity">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="w-1 h-5 sm:h-6 bg-gray-400 rounded-full hidden md:block" />
            ))}
          </div>
        </div>
      )}

      <div className="relative z-0 p-4 sm:p-5 pt-10 sm:pt-12">
        {/* Encabezado */}
        <div className="flex justify-between items-start mb-3 sm:mb-4">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br ${color.from} ${color.to} rounded-lg sm:rounded-xl flex items-center justify-center shadow-md flex-shrink-0`}>
              <Droplet className="text-white w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="font-bold text-gray-900 text-base sm:text-lg truncate">
                {`MED-${comprobante.lectura?.medidor?.idMedidor}` || `Comp-${comprobante.idComprobante}`}
              </h4>
              <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 mt-1">
                {/* Fecha de emisión */}
                <span className="text-xs sm:text-sm text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
                  <span>{new Date(comprobante.fechaEmision).toLocaleDateString('es-BO')}</span>
                </span>

                {/* Fecha límite */}
                <span
                  className={`text-xs sm:text-sm px-2 py-0.5 rounded-full flex items-center gap-1 ${new Date(comprobante.fechaLimite) < new Date()
                      ? 'bg-red-100 text-red-700' // vencido
                      : 'bg-green-100 text-green-700' // vigente
                    }`}
                >
                  <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>{new Date(comprobante.fechaLimite).toLocaleDateString('es-BO')}</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Detalles */}
        <div className="bg-white/80 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-200 mb-3 sm:mb-4">
          <div className="space-y-1.5 sm:space-y-2">
            <div className="flex justify-between text-xs sm:text-sm gap-2">
              <span className="text-gray-600 flex items-center gap-1 min-w-0">
                <CircleDollarSign className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 flex-shrink-0" />
                <span className="truncate">Consumo básico:</span>
              </span>
              <span className="font-semibold text-gray-900 flex-shrink-0">{formatCurrency(comprobante.montoBasico)}</span>
            </div>

            {comprobante.montoAdicional > 0 && (
              <div className="flex justify-between text-xs sm:text-sm gap-2">
                <span className="text-gray-600 flex items-center gap-1 min-w-0">
                  <Plus className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 flex-shrink-0" />
                  <span className="truncate">Consumo adicional:</span>
                </span>
                <span className="font-semibold text-gray-900 flex-shrink-0">{formatCurrency(comprobante.montoAdicional)}</span>
              </div>
            )}

            {comprobante.moraAcumulada > 0 && (
              <div className="flex justify-between text-xs sm:text-sm gap-2">
                <span className="text-red-600 flex items-center gap-1 min-w-0">
                  <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4 text-red-600 flex-shrink-0" />
                  <span className="truncate">Mora acumulada:</span>
                </span>
                <span className="font-semibold text-red-700 flex-shrink-0">{formatCurrency(comprobante.moraAcumulada)}</span>
              </div>
            )}
          </div>

          <div className="flex justify-between items-center mt-2 sm:mt-3 pt-2 sm:pt-3 border-t-2 border-blue-200 gap-2">
            <span className="font-bold text-gray-900 text-sm sm:text-base">Total a pagar:</span>
            <span className="text-lg sm:text-xl font-bold text-blue-600 flex-shrink-0">
              {formatCurrency(comprobante.totalPagar)}
            </span>
          </div>
        </div>

        {!isInPaymentBox && (
          <button
            onClick={() => onAddToPayment(comprobante)}
            className={`w-full bg-gradient-to-r ${color.from} ${color.to} hover:opacity-90 text-white font-bold py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg sm:rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-95 text-sm sm:text-base`}
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Agregar al pago</span>
          </button>
        )}
      </div>
    </div>
  );
}