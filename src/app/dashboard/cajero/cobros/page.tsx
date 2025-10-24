'use client'

import React, { useState, useEffect } from 'react'
import { DndContext, DragEndEvent, DragOverlay } from '@dnd-kit/core'
import { Comprobante, Socio } from './datos/comprobantes'
import ComprobanteItem from './componentes/ComprobanteCard'
import CuadroPago from './componentes/CuadroPago'
import { LiquidoCargando, Recibo, Correcto } from '@/animaciones/Animaciones'
import Select from 'react-select';
import ruta from '@/api/axios';
import { restringirComponente } from './restriccion/restringirArea';

export default function Page() {
  const [comprobantes, setComprobantes] = useState<Comprobante[]>([])
  const [comprobantesSeleccionados, setComprobantesSeleccionados] = useState<Comprobante[]>([])
  const [activeComprobante, setActiveComprobante] = useState<Comprobante | null>(null)
  const [socios, setSocios] = useState<Socio[]>([])
  const [socioSeleccionado, setSocioSeleccionado] = useState<Socio | null>(null);
  const [listo, setListo] = useState(false)

  useEffect(() => {
    const fetchSocios = async () => {
      try {
        const resSocio = await ruta.get("/auth/usuarios");
        setSocios(resSocio.data.usuarios);
      } catch (error) {
        console.error("Error al obtener datos:", error);
      }
    };

    fetchSocios();
    setListo(true)
  }, []);

  useEffect(() => {
    const fetchComprobantes = async () => {
      if (!socioSeleccionado) return;
      try {
        const resSocio = await ruta.get(`/servicios/comprobantes/${socioSeleccionado.idUsuario}`);
        setComprobantes(resSocio.data.comprobantes);
      } catch (error) {
        console.error("Error al obtener datos:", error);
      }
    };

    fetchComprobantes();
  }, [socioSeleccionado]);

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
      modifiers={[restringirComponente('contenedor-principal')]}
    >
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 p-6">
        <div className="max-w-full mx-auto">
          {/* Encabezado */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center gap-3 mb-3">
              <LiquidoCargando className="w-24 h-24 md:w-20 md:h-20" />
              <h1 className="text-3xl md:text-4xl font-bold pb-4 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Pagos de Agua Potable
              </h1>
            </div>
            <p className="text-gray-600 text-lg">
              Arrastra los comprobantes hacia el carrito de pago para procesarlos.
            </p>
          </div>

          <div className="w-80 mb-2">
            <h2 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-cyan-200 bg-clip-text text-transparent mb-1">
              Seleccione un socio:
            </h2>
            <Select
              options={socios.map((s) => ({
                value: s.idUsuario,
                label: `${s.idUsuario}.- ${s.nombre} ${s.apellidos}`,
                socio: s,
              }))}
              value={
                socioSeleccionado
                  ? {
                    value: socioSeleccionado.idUsuario,
                    label: `${socioSeleccionado.idUsuario}.- ${socioSeleccionado.nombre} ${socioSeleccionado.apellidos}`,
                    socio: socioSeleccionado,
                  }
                  : null
              }
              onChange={(opcion) => setSocioSeleccionado(opcion?.socio ?? null)}
              placeholder="Elige un socio"
              isClearable
              classNames={{
                control: () =>
                  "border border-gray-300 shadow-sm hover:border-blue-400 focus:border-blue-500",
              }}
            />
          </div>

          {/* Contenido principal */}
          <div id='contenedor-principal' className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
