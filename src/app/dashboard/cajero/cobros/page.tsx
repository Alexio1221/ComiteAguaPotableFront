'use client'

import React, { useState } from 'react';
import { DndContext, DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { restrictToParentElement } from '@dnd-kit/modifiers';
import { Comprobante, comprobantes } from './datos/comprobantes';
import ComprobantesPendientes from './componentes/Comprobantes';
import CuadroPago from './componentes/CuadroPago';

export default function Page() {
  const [comprobantesSeleccionados, setComprobantesSeleccionados] = useState<Comprobante[]>([]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 0 } })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { over, active } = event;
    if (over?.id === "zona-pago") {
      const comprobanteId = parseInt(active.id.toString().replace('comprobante-', ''));
      const existe = comprobantesSeleccionados.find(c => c.idComprobante === comprobanteId);
      if (!existe) {
        const comprobante = comprobantes.find(c => c.idComprobante === comprobanteId);
        if (comprobante) setComprobantesSeleccionados([...comprobantesSeleccionados, comprobante]);
      }
    }
  };

  const handleAddToPayment = (c: Comprobante) => {
    if (!comprobantesSeleccionados.find(s => s.idComprobante === c.idComprobante)) {
      setComprobantesSeleccionados([...comprobantesSeleccionados, c]);
    }
  };

  const handleRemoveComprobante = (id: number) => {
    setComprobantesSeleccionados(comprobantesSeleccionados.filter(c => c.idComprobante !== id));
  };

  const comprobantesDisponibles = comprobantes.filter(
    c => !comprobantesSeleccionados.find(s => s.idComprobante === c.idComprobante)
  );

  return (
    <DndContext onDragEnd={handleDragEnd} sensors={sensors} modifiers={[restrictToParentElement]}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto text-center mb-8">
          <div className="inline-flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center shadow-xl">
              <span className="text-3xl">💧</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Sistema de Pagos de Agua
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Gestiona y paga tus comprobantes de agua de manera fácil y rápida
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <ComprobantesPendientes comprobantes={comprobantesDisponibles} onAddToPayment={handleAddToPayment} />
          </div>
          <div className="lg:w-[500px]">
            <CuadroPago comprobantesSeleccionados={comprobantesSeleccionados} onRemoveComprobante={handleRemoveComprobante} />
          </div>
        </div>
      </div>
    </DndContext>
  );
}
