'use client'

import React, { useState, useEffect } from 'react'
import ruta from '@/api/axios'
import { Droplet, Plus } from 'lucide-react'
import LecturaModal from './componentes/ModalLectura'

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

export default function Lectura() {
  const [medidores, setMedidores] = useState<Medidor[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [modalAbierto, setModalAbierto] = useState(false)
  const [medidorSeleccionado, setMedidorSeleccionado] = useState<Medidor | null>(null)

  // 🔹 Cargar los medidores al montar el componente
  useEffect(() => {
    const obtenerMedidores = async () => {
      try {
        const response = await ruta.get('/servicios/medidores')
        setMedidores(response.data)
      } catch (err) {
        console.error('Error al cargar medidores:', err)
        setError('No se pudieron cargar los medidores.')
      } finally {
        setCargando(false)
      }
    }

    obtenerMedidores()
  }, [modalAbierto])

  const abrirModal = (medidor: Medidor) => {
    setMedidorSeleccionado(medidor)
    setModalAbierto(true)
  }

  const cerrarModal = () => {
    setModalAbierto(false)
    setMedidorSeleccionado(null)
  }

  if (cargando) return <p className="text-center mt-10">Cargando medidores...</p>
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold flex items-center gap-2 mb-6">
        <Droplet /> Registro de Lecturas
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {medidores.map((medidor) => (
          <div
            key={medidor.idMedidor}
            className="p-4 border rounded-lg shadow-sm bg-white hover:shadow-md transition"
          >
            <h2 className="text-lg font-semibold text-gray-800">
              Medidor #{medidor.idMedidor}
            </h2>
            <p className="text-sm text-gray-500">{medidor.nombre} {medidor.apellido}</p>
            <p className="text-sm text-gray-500">{medidor.direccion}</p>
            <p className="text-sm text-gray-500">Categoría: {medidor.categoria}</p>
            <p className="text-sm text-gray-500">
              Lectura anterior: {medidor.lecturaAnterior} m³
            </p>
            <p className="text-sm text-gray-500">
              Lectura actual: {medidor.lecturaActual || 0} m³
            </p>
            <p
              className={`text-sm font-medium mt-2 ${
                medidor.estado === 'PENDIENTE' ? 'text-orange-500' : 'text-green-600'
              }`}
            >
              Estado: {medidor.estado}
            </p>

            <button
              onClick={() => abrirModal(medidor)}
              className="mt-4 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg w-full transition"
            >
              <Plus size={16} /> Registrar lectura
            </button>
          </div>
        ))}
      </div>

      {modalAbierto && medidorSeleccionado && (
        <LecturaModal medidor={medidorSeleccionado} cerrarModal={cerrarModal} />
      )}
    </div>
  )
}
