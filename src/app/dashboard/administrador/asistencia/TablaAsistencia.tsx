'use client'
import { useEffect, useState, useMemo } from 'react'
import ruta from '@/api/axios'
import toast from 'react-hot-toast'

interface Afiliado {
  idUsuario: string
  nombre: string
  apellidos: string
  estadoAsistencia: string
  presente: boolean
}

interface TablaAsistenciaProps {
  reunionId: string
  estado: string
  observacion: string
  setObservacion: (value: string) => void
}

export default function TablaAsistencia({
  reunionId,
  estado,
  observacion,
  setObservacion
}: TablaAsistenciaProps) {
  const [afiliados, setAfiliados] = useState<Afiliado[]>([])
  const [busqueda, setBusqueda] = useState('')
  const [cargando, setCargando] = useState(false)

  const obtenerAsistencias = async () => {
    try {
      setCargando(true)
      const { data } = await ruta.get('/avisos/asistencia/datos')
      setAfiliados(data?.lista || [])
      const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
      await sleep(500)
    } catch (error: any) {
      toast.error('No se pudieron obtener las asistencias.')
    } finally {
      setCargando(false)
    }
  }

  const handleCambiarEstado = async (idUsuario: string, nuevoEstado: boolean) => {
    try {
      let estadoAEnviar = estado;
      let observacionEnviar = observacion;
      if (!nuevoEstado) {
        estadoAEnviar = 'AUSENTE';
        observacionEnviar = ''
      }

      const { data } = await ruta.post('/avisos/asistencia/registrar', {
        idUsuario,
        idReunion: reunionId,
        estado: estadoAEnviar,
        observacion: observacionEnviar || null,
        cambioTabla: nuevoEstado
      })

      setObservacion('')

      setAfiliados(prev =>
        prev.map(a =>
          a.idUsuario === idUsuario ? { ...a, presente: nuevoEstado, estadoAsistencia: estadoAEnviar} : a
        )
      )

      toast.success(data?.mensaje || 'Asistencia registrada')
    } catch (error: any) {
      toast.error(error?.response?.data?.mensaje || 'No se pudo registrar la asistencia')
    }
  }

  useEffect(() => {
    obtenerAsistencias()
  }, [])

  const afiliadosFiltrados = useMemo(() => {
    return afiliados
      .filter(a =>
        `${a.idUsuario} ${a.nombre} ${a.apellidos}`
          .toLowerCase()
          .includes(busqueda.toLowerCase())
      )
      .sort((a, b) => Number(a.idUsuario) - Number(b.idUsuario))
  }, [afiliados, busqueda])

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
      <h2 className="text-lg font-bold text-gray-800 mb-3">Lista de asistencia</h2>

      <div className="mb-4 flex flex-col md:flex-row gap-2">
        <input
          type="text"
          placeholder="Buscar por nombre o apellido..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full md:flex-1 border border-gray-300 rounded-lg px-3 py-2"
        />
        <button
          onClick={obtenerAsistencias}
          disabled={cargando}
          className={`bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors ${cargando ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'
            }`}
        >
          {cargando ? 'Cargando...' : 'Actualizar'}
        </button>
      </div>

      <table className="min-w-full border border-gray-200 text-sm text-left rounded-xl overflow-hidden">
        <thead className="bg-blue-50">
          <tr>
            <th className="px-4 py-2 border text-gray-700 font-semibold">#</th>
            <th className="px-4 py-2 border text-gray-700 font-semibold">Nombre completo</th>
            <th className="px-4 py-2 border text-gray-700 font-semibold">Estado</th>
            <th className="px-4 py-2 border text-gray-700 font-semibold text-center">Asistencia</th>
          </tr>
        </thead>
        <tbody>
          {afiliadosFiltrados.length > 0 ? (
            afiliadosFiltrados.map((a) => (
              <tr key={a.idUsuario} className="hover:bg-gray-50 transition-all">
                <td className="px-4 py-2 border">{a.idUsuario}</td>
                <td className="px-4 py-2 border font-medium">{a.nombre} {a.apellidos}</td>
                <td className="px-4 py-2 border font-medium">{a.estadoAsistencia}</td>
                <td className="px-4 py-2 border text-center">
                  <input
                    type="checkbox"
                    checked={a.presente}
                    onChange={() => handleCambiarEstado(a.idUsuario, !a.presente)}
                    className="w-5 h-5 text-blue-600 rounded"
                  />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="text-center py-4 text-gray-500">
                No hay registros aún.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
