'use client'

import React, { useState, useEffect } from 'react'
import { DndContext, DragEndEvent, DragOverlay } from '@dnd-kit/core'
import { Comprobante, comprobantes as comprobantesData } from './datos/comprobantes'
import ComprobanteItem from './componentes/ComprobanteCard'
import CuadroPago from './componentes/CuadroPago'
import { LiquidoCargando, Recibo, Correcto } from '@/animaciones/Animaciones'

export default function Page() {
  const [comprobantes, setComprobantes] = useState<Comprobante[]>([])
  const [comprobantesSeleccionados, setComprobantesSeleccionados] = useState<Comprobante[]>([])
  const [activeComprobante, setActiveComprobante] = useState<Comprobante | null>(null)
  const [listo, setListo] = useState(false)

  useEffect(() => {
    setListo(true)
    setComprobantes(comprobantesData)
  }, [])
  if (!listo) return null

  const handleAddToPayment = (comprobante: Comprobante) => {
    setComprobantes(prev => prev.filter(c => c.idComprobante !== comprobante.idComprobante))
    setComprobantesSeleccionados(prev => [...prev, comprobante])
  }

  const handleRemoveComprobante = (id: number) => {
    const comprobante = comprobantesSeleccionados.find(c => c.idComprobante === id)
    if (comprobante) {
      setComprobantesSeleccionados(prev => prev.filter(c => c.idComprobante !== id))
      setComprobantes(prev => [...prev, comprobante])
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && over.id === 'zona-pago') {
      const id = parseInt(active.id.toString().replace('comprobante-', ''))
      const comprobante = comprobantes.find(c => c.idComprobante === id)
      if (comprobante) handleAddToPayment(comprobante)
    }
    setActiveComprobante(null)
  }

  return (
    <DndContext
      onDragStart={(event) => {
        const id = event.active.id
        const comp = comprobantes.find(c => `comprobante-${c.idComprobante}` === id)
        setActiveComprobante(comp || null)
      }}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveComprobante(null)}
    >
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Encabezado */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center gap-3 mb-3">
              <LiquidoCargando className="w-24 h-24 md:w-20 md:h-20" />
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent h-15 sm:h-14">
                Pagos de Agua de Potable
              </h1>
            </div>
            <p className="text-gray-600 text-lg">
              Arrastra los comprobantes hacia el carrito de pago para procesarlos.
            </p>
          </div>

          {/* Contenido principal */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Lista de comprobantes */}
            <div className="lg:col-span-2 bg-white/70 backdrop-blur-sm rounded-xl shadow-xl p-6 border border-blue-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Recibo className="h-16 w-16" />
                Comprobantes Pendientes
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {comprobantes.length > 0 ? (
                  comprobantes.map(c => (
                    <ComprobanteItem
                      key={c.idComprobante}
                      comprobante={c}
                      isInPaymentBox={false}
                      onAddToPayment={handleAddToPayment}
                    />
                  ))
                ) : (
                  <div className="text-center text-gray-500 col-span-2 py-8 flex flex-col items-center">
                    <Correcto className="w-32 h-32 mb-2" />
                    <p>No hay comprobantes pendientes</p>
                  </div>
                )}
              </div>
            </div>

            {/* Cuadro de pago (zona droppable) */}
            <CuadroPago
              comprobantesSeleccionados={comprobantesSeleccionados}
              onRemoveComprobante={handleRemoveComprobante}
            />
          </div>
        </div>
      </div>

      {/* Drag Overlay (sombra visual del elemento arrastrado) */}
      <DragOverlay>
        {activeComprobante ? (
          <ComprobanteItem
            comprobante={activeComprobante}
            isInPaymentBox={false}
            onAddToPayment={() => { }}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
