'use client'

import React, { useState } from 'react'
import { DndContext, DragOverlay } from '@dnd-kit/core'
import { Comprobante } from '../datos/comprobantes'
import ComprobanteItem from './ComprobanteCard'
import CuadroPago from './CuadroPago'

export default function ComprobantesPendientes({
  comprobantes
}: {
  comprobantes: Comprobante[]
}) {
  const [comprobantesSeleccionados, setComprobantesSeleccionados] = useState<Comprobante[]>([])
  const [activeComprobante, setActiveComprobante] = useState<Comprobante | null>(null)

  const handleAddToPayment = (comprobante: Comprobante) => {
    setComprobantesSeleccionados(prev => [...prev, comprobante])
  }

  const handleRemoveComprobante = (id: number) => {
    setComprobantesSeleccionados(prev => prev.filter(c => c.idComprobante !== id))
  }

  return (
    <DndContext
      onDragStart={(event) => {
        const id = event.active.id
        const comp = comprobantes.find(c => `comprobante-${c.idComprobante}` === id)
        setActiveComprobante(comp || null)
      }}
      onDragEnd={() => setActiveComprobante(null)}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 🧾 Lista de comprobantes */}
        <div className="lg:col-span-2 bg-white/70 backdrop-blur-sm rounded-xl shadow-xl p-6 border border-blue-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            📋 Comprobantes Pendientes
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {comprobantes.map(c => (
              <ComprobanteItem
                key={c.idComprobante}
                comprobante={c}
                isInPaymentBox={false}
                onAddToPayment={handleAddToPayment}
              />
            ))}
          </div>
        </div>

        {/* 💳 Cuadro de pago */}
        <CuadroPago
          comprobantesSeleccionados={comprobantesSeleccionados}
          onRemoveComprobante={handleRemoveComprobante}
        />
      </div>

      {/* 🔹 Drag Overlay (por encima de todo) */}
      <DragOverlay>
        {activeComprobante ? (
          <ComprobanteItem
            comprobante={activeComprobante}
            isInPaymentBox={false}
            onAddToPayment={() => {}}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
