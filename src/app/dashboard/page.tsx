"use client"
import { useState, useEffect } from "react"
import ruta from "@/api/axios"
import { Droplet, Users, Bell, AlertCircle, Activity, Calendar } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "react-hot-toast"

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false)
  const [estadisticas, setEstadisticas] = useState({
    usuariosTotales: 0,
    reclamosPendientes: 0,
    servicioActivo: "Normal",
    proximoCorte: "Sin definir",
    notificaciones: 0
  })
  const [avisos, setAvisos] = useState<any[]>([])
  const [eventos, setEventos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const fetchDashboard = async () => {
      try {
        const [estadRes, avisosRes, eventosRes] = await Promise.all([
          ruta.get("/sesion/dashboard/estadisticas"),
          ruta.get("avisos"),
          ruta.get("/reclamos") // Ejemplo, puedes cambiarlo
        ])

        setEstadisticas(estadRes.data)
        setAvisos(avisosRes.data)
        setEventos(eventosRes.data)
      } catch (error: any) {
        console.error(error)
        toast.error("Error al cargar el dashboard")
      } finally {
        setLoading(false)
      }
    }

    fetchDashboard()
  }, [mounted])

  if (!mounted || loading) return (
    <div className="flex items-center justify-center min-h-screen text-gray-500">
      Cargando panel...
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* HEADER */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500">
          <div className="flex items-center gap-3">
            <Droplet className="w-10 h-10 text-blue-500 animate-bounce-slow" />
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Panel General</h1>
              <p className="text-gray-500">Información del sistema</p>
            </div>
          </div>
        </div>

        {/* TARJETAS PRINCIPALES */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl shadow-lg hover:scale-105 transition">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Usuarios Totales</p>
                  <p className="text-4xl font-bold mt-2">{estadisticas.usuariosTotales}</p>
                </div>
                <Users className="w-10 h-10 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl shadow-lg hover:scale-105 transition">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Estado del Servicio</p>
                  <p className="text-2xl font-bold mt-2">{estadisticas.servicioActivo}</p>
                </div>
                <Activity className="w-10 h-10 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-2xl shadow-lg hover:scale-105 transition">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">Próximo Corte</p>
                  <p className="text-lg font-bold mt-2">{estadisticas.proximoCorte}</p>
                </div>
                <Calendar className="w-10 h-10 text-orange-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl shadow-lg hover:scale-105 transition relative">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Notificaciones</p>
                  <p className="text-4xl font-bold mt-2">{estadisticas.notificaciones}</p>
                </div>
                <Bell className="w-10 h-10 text-purple-200" />
              </div>
              {estadisticas.notificaciones > 0 && (
                <span className="absolute top-3 right-3 w-3 h-3 bg-red-500 rounded-full animate-ping" />
              )}
            </CardContent>
          </Card>
        </div>

        {/* AVISOS */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <Bell className="w-6 h-6 text-purple-500" />
            <h3 className="text-xl font-bold text-gray-800">Noticias y Avisos</h3>
          </div>
          <div className="space-y-3">
            {avisos.length > 0 ? avisos.map((aviso: any) => (
              <div
                key={aviso.idNoticiaAviso}
                className="p-4 bg-purple-50 rounded-xl border border-purple-100 hover:bg-purple-100 transition-all"
              >
                <p className="font-medium text-gray-800">{aviso.titulo}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(aviso.fechaPublicacion).toLocaleDateString()}
                </p>
              </div>
            )) : (
              <p className="text-sm text-gray-500">No hay avisos recientes</p>
            )}
          </div>
        </div>

        {/* EVENTOS / RECLAMOS */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="w-6 h-6 text-orange-500" />
            <h3 className="text-xl font-bold text-gray-800">Reclamos o eventos</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left p-3 text-sm text-gray-600">Motivo</th>
                  <th className="text-left p-3 text-sm text-gray-600">Descripción</th>
                  <th className="text-left p-3 text-sm text-gray-600">Estado</th>
                  <th className="text-left p-3 text-sm text-gray-600">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {eventos.length > 0 ? eventos.map((ev: any) => (
                  <tr key={ev.idReclamo} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">{ev.motivo}</td>
                    <td className="p-3 text-gray-600">{ev.descripcion}</td>
                    <td className="p-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        ev.estado === "RESUELTO" ? "bg-green-100 text-green-700"
                        : ev.estado === "EN_PROCESO" ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                      }`}>
                        {ev.estado}
                      </span>
                    </td>
                    <td className="p-3 text-sm text-gray-500">
                      {new Date(ev.fechaCreacion).toLocaleDateString()}
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={4} className="text-center py-4 text-gray-500">
                      No hay reclamos o eventos registrados
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  )
}
