'use client'
import { useEffect, useState } from 'react'
import axios from 'axios'

interface Afiliado {
  id: string
  nombre: string
  presente: boolean
}

export default function TablaAsistencia({ reunionId }: { reunionId: string }) {
  const [afiliados, setAfiliados] = useState<Afiliado[]>([])

  useEffect(() => {
    const obtenerAsistencias = async () => {
      try {
        const { data } = await axios.get(`/api/asistencia/${reunionId}`)
        setAfiliados(data?.asistentes || [])
      } catch {
        console.warn('No se pudieron obtener las asistencias.')
      }
    }
    obtenerAsistencias()
  }, [reunionId])

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
      <h2 className="text-lg font-bold text-gray-800 mb-3">Lista de asistencia</h2>
      <table className="min-w-full border border-gray-200 text-sm text-left rounded-xl overflow-hidden">
        <thead className="bg-blue-50">
          <tr>
            <th className="px-4 py-2 border text-gray-700 font-semibold">#</th>
            <th className="px-4 py-2 border text-gray-700 font-semibold">Nombre</th>
            <th className="px-4 py-2 border text-gray-700 font-semibold text-center">Asistencia</th>
          </tr>
        </thead>
        <tbody>
          {afiliados.length > 0 ? (
            afiliados.map((a, i) => (
              <tr key={a.id} className="hover:bg-gray-50 transition-all">
                <td className="px-4 py-2 border">{i + 1}</td>
                <td className="px-4 py-2 border font-medium">{a.nombre}</td>
                <td className="px-4 py-2 border text-center">
                  {a.presente ? (
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                      Presente
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
                      Ausente
                    </span>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} className="text-center py-4 text-gray-500">
                No hay registros aún.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
