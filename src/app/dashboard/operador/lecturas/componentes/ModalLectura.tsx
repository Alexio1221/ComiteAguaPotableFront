'use client'

import React, { use, useState } from 'react'
import { X } from 'lucide-react'
import ruta from '@/api/axios'
import toast from 'react-hot-toast'
import ConfirmModalLectura from '@/app/modals/ConfirmModalLectura'

interface Medidor {
  idLectura: number
  idMedidor: number
  nombre: string
  apellido: string
  direccion: string
  categoria: string
  lecturaAnterior: number
  lecturaActual: number
  consumo: number
  estado: string
}

interface LecturaModalProps {
  medidor: Medidor
  cerrarModal: () => void
}

export default function LecturaModal({ medidor, cerrarModal }: LecturaModalProps) {
  const [lecturaActual, setLecturaActual] = useState<number>(0)
  const [guardando, setGuardando] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [observaciones, setObservaciones] = useState('')

  const consumo = lecturaActual - medidor.lecturaAnterior

  const abrirConfirmacion = () => {
    if (lecturaActual <= medidor.lecturaAnterior) {
      toast.error('La nueva lectura debe ser mayor a la anterior.')
      return
    }
    setShowConfirm(true)
  }

  const guardarLectura = async () => {
    setGuardando(true)
    try {
      await ruta.post('/servicios/lecturas', {
        idLectura: medidor.idLectura,
        idMedidor: medidor.idMedidor,
        lecturaAnterior: medidor.lecturaAnterior,
        lecturaActual,
        consumo,
        observaciones,
      })
      toast.success('Lectura registrada correctamente.')
      cerrarModal()
    } catch (error: any) {
      console.error('Error al registrar lectura:', error)
      toast.error(error.response?.data?.mensaje || 'Error al guardar la lectura.')
    } finally {
      setGuardando(false)
      setShowConfirm(false)
    }
  }

  return (
    <>
      {/* Modal principal */}
      <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-40 p-2">
        <div className="bg-white p-5 rounded-xl w-full max-w-md shadow-lg relative max-h-[90vh] overflow-y-auto">
          <button
            onClick={cerrarModal}
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>

          <h2 className="text-xl font-bold mb-4 text-gray-800 text-center">
            Registrar Lectura
          </h2>

          <div className="space-y-2 mb-4 text-sm sm:text-base">
            <p><strong>Medidor:</strong> #{medidor.idMedidor}</p>
            <p><strong>Socio:</strong> {medidor.nombre} {medidor.apellido}</p>
            <p><strong>Dirección:</strong> {medidor.direccion}</p>
            <p><strong>Categoría:</strong> {medidor.categoria}</p>
            <p><strong>Lectura anterior:</strong> {medidor.lecturaAnterior} m³</p>
            <p><strong>Lectura actual:</strong> {medidor.lecturaActual} m³</p>
          </div>

          <input
            type="number"
            className="w-full border rounded-lg p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={`Nueva lectura (mínimo ${medidor.lecturaAnterior})`}
            value={lecturaActual || ''}
            onChange={(e) => setLecturaActual(Number(e.target.value))}
          />

          <textarea
            className="w-full border rounded-lg p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            placeholder="Observación (opcional)"
            rows={3}
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
          ></textarea>

          <button
            onClick={abrirConfirmacion}
            disabled={guardando}
            className="bg-blue-600 hover:bg-blue-700 text-white w-full py-2 rounded-lg transition font-semibold"
          >
            {guardando ? 'Guardando...' : 'Previsualizar'}
          </button>
        </div>
      </div>

      {/* 🔹 Modal de confirmación */}
      <ConfirmModalLectura
        isOpen={showConfirm}
        onConfirm={guardarLectura}
        onCancel={() => setShowConfirm(false)}
        datos={{
          idMedidor: medidor.idMedidor,
          lecturaAnterior: medidor.lecturaAnterior,
          lecturaActual,
          consumo,
          nombre: medidor.nombre,
          apellido: medidor.apellido,
          direccion: medidor.direccion,
        }}
      />
    </>
  )
}
