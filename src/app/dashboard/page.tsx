"use client"
import { useState, useEffect } from 'react'
import { Droplet, Users, AlertCircle, Activity, Bell, Calendar } from 'lucide-react'

export default function DashboardExample() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Datos generales - visibles para todos los roles
  const estadisticas = {
    usuariosTotales: 135,
    servicioActivo: "Normal",
    proximoCorte: "15 de Octubre",
    notificaciones: 3
  };

  const incidenciasPublicas = [
    { id: 1, tipo: "Corte programado", zona: "Zona B", fecha: "15 Oct", hora: "8:00 - 12:00" },
    { id: 2, tipo: "Mantenimiento", zona: "Zona C", fecha: "18 Oct", hora: "9:00 - 11:00" },
  ];

  const consumosPromedio = [
    { mes: "Enero", promedio: 12 },
    { mes: "Febrero", promedio: 15 },
    { mes: "Marzo", promedio: 11 },
    { mes: "Abril", promedio: 13 },
    { mes: "Mayo", promedio: 14 },
    { mes: "Junio", promedio: 13 },
  ];

  const avisos = [
    { id: 1, titulo: "Actualización del Sistema", fecha: "28 Sep 2025" },
    { id: 2, titulo: "Recordatorio de Pago", fecha: "25 Sep 2025" },
    { id: 3, titulo: "Mantenimiento Programado", fecha: "20 Sep 2025" },
  ];

  const maxPromedio = Math.max(...consumosPromedio.map(c => c.promedio));

  // Animación de contador
  const [counters, setCounters] = useState({
    usuarios: 0,
    notificaciones: 0
  })

  useEffect(() => {
    if (!mounted) return

    const duration = 2000
    const steps = 60
    const interval = duration / steps

    let currentStep = 0
    const timer = setInterval(() => {
      currentStep++
      setCounters({
        usuarios: Math.floor((estadisticas.usuariosTotales / steps) * currentStep),
        notificaciones: Math.floor((estadisticas.notificaciones / steps) * currentStep)
      })

      if (currentStep >= steps) {
        clearInterval(timer)
        setCounters({
          usuarios: estadisticas.usuariosTotales,
          notificaciones: estadisticas.notificaciones
        })
      }
    }, interval)

    return () => clearInterval(timer)
  }, [mounted])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header con animación de entrada */}
        <div 
          className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500 animate-slide-down"
          style={{
            animation: 'slideDown 0.6s ease-out'
          }}
        >
          <div className="flex items-center gap-3">
            <Droplet className="w-10 h-10 text-blue-500 animate-bounce-slow" />
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Bienvenido al Sistema</h1>
              <p className="text-gray-500">Panel de información general</p>
            </div>
          </div>
        </div>

        {/* Tarjetas informativas con animación escalonada */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div 
            className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl shadow-lg text-white transform hover:scale-105 transition-all duration-300 hover:shadow-2xl animate-fade-in-up"
            style={{
              animation: 'fadeInUp 0.6s ease-out 0.1s both'
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Usuarios Totales</p>
                <p className="text-4xl font-bold mt-2">{counters.usuarios}</p>
                <p className="text-blue-100 text-xs mt-1">En el sistema</p>
              </div>
              <Users className="w-12 h-12 text-blue-200 opacity-80 animate-pulse-slow" />
            </div>
          </div>

          <div 
            className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-2xl shadow-lg text-white transform hover:scale-105 transition-all duration-300 hover:shadow-2xl"
            style={{
              animation: 'fadeInUp 0.6s ease-out 0.2s both'
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Estado del Servicio</p>
                <p className="text-2xl font-bold mt-2">{estadisticas.servicioActivo}</p>
                <p className="text-green-100 text-xs mt-1">Funcionando correctamente</p>
              </div>
              <Activity className="w-12 h-12 text-green-200 opacity-80 animate-pulse-slow" />
            </div>
          </div>

          <div 
            className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-2xl shadow-lg text-white transform hover:scale-105 transition-all duration-300 hover:shadow-2xl"
            style={{
              animation: 'fadeInUp 0.6s ease-out 0.3s both'
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium">Próximo Corte</p>
                <p className="text-xl font-bold mt-2">{estadisticas.proximoCorte}</p>
                <p className="text-orange-100 text-xs mt-1">Mantenimiento programado</p>
              </div>
              <Calendar className="w-12 h-12 text-orange-200 opacity-80 animate-pulse-slow" />
            </div>
          </div>

          <div 
            className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-2xl shadow-lg text-white transform hover:scale-105 transition-all duration-300 hover:shadow-2xl relative overflow-hidden"
            style={{
              animation: 'fadeInUp 0.6s ease-out 0.4s both'
            }}
          >
            <div className="flex items-center justify-between relative z-10">
              <div>
                <p className="text-purple-100 text-sm font-medium">Notificaciones</p>
                <p className="text-4xl font-bold mt-2">{counters.notificaciones}</p>
                <p className="text-purple-100 text-xs mt-1">Avisos nuevos</p>
              </div>
              <Bell className="w-12 h-12 text-purple-200 opacity-80 animate-ring" />
            </div>
            {estadisticas.notificaciones > 0 && (
              <div className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full animate-ping" />
            )}
          </div>
        </div>

        {/* Contenido principal - 2 columnas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Gráfico de consumo promedio */}
          <div 
            className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6"
            style={{
              animation: 'fadeInUp 0.6s ease-out 0.5s both'
            }}
          >
            <div className="flex items-center gap-3 mb-6">
              <Droplet className="w-6 h-6 text-blue-500" />
              <h3 className="text-xl font-bold text-gray-800">Consumo Promedio General (m³)</h3>
            </div>
            <div className="flex items-end gap-3 h-64 px-4">
              {consumosPromedio.map((c, index) => (
                <div 
                  key={c.mes} 
                  className="flex-1 flex flex-col justify-end items-center group"
                  style={{
                    animation: `growUp 0.8s ease-out ${0.6 + index * 0.1}s both`
                  }}
                >
                  <div className="relative w-full">
                    <div
                      className="bg-gradient-to-t from-blue-500 to-cyan-400 w-full rounded-t-lg shadow-md hover:shadow-xl transition-all duration-300 group-hover:from-blue-600 group-hover:to-cyan-500"
                      style={{ height: `${(c.promedio / maxPromedio) * 200}px` }}
                    />
                    <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-sm font-semibold text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity">
                      {c.promedio} m³
                    </span>
                  </div>
                  <span className="mt-3 text-sm font-medium text-gray-600">{c.mes}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-500">
                Consumo promedio por usuario: <span className="font-semibold text-gray-700">{Math.round(consumosPromedio.reduce((sum, c) => sum + c.promedio, 0) / consumosPromedio.length)} m³/mes</span>
              </p>
            </div>
          </div>

          {/* Avisos recientes */}
          <div 
            className="bg-white rounded-2xl shadow-lg p-6"
            style={{
              animation: 'fadeInUp 0.6s ease-out 0.6s both'
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <Bell className="w-6 h-6 text-purple-500" />
              <h3 className="text-xl font-bold text-gray-800">Avisos</h3>
            </div>
            <div className="space-y-3">
              {avisos.map((aviso, index) => (
                <div 
                  key={aviso.id} 
                  className="p-4 bg-purple-50 rounded-xl border border-purple-100 hover:bg-purple-100 transition-all duration-300 hover:translate-x-1 hover:shadow-md"
                  style={{
                    animation: `fadeInRight 0.5s ease-out ${0.7 + index * 0.1}s both`
                  }}
                >
                  <p className="font-medium text-gray-800 text-sm">{aviso.titulo}</p>
                  <p className="text-xs text-gray-500 mt-1">{aviso.fecha}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabla de eventos públicos */}
        <div 
          className="bg-white rounded-2xl shadow-lg p-6"
          style={{
            animation: 'fadeInUp 0.6s ease-out 0.8s both'
          }}
        >
          <div className="flex items-center gap-3 mb-6">
            <AlertCircle className="w-6 h-6 text-orange-500" />
            <h3 className="text-xl font-bold text-gray-800">Eventos Programados</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left p-4 text-sm font-semibold text-gray-600">Tipo</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-600">Zona Afectada</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-600">Fecha</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-600">Horario</th>
                </tr>
              </thead>
              <tbody>
                {incidenciasPublicas.map((evento, index) => (
                  <tr 
                    key={evento.id} 
                    className="border-b border-gray-100 hover:bg-gray-50 transition-all duration-300 hover:scale-[1.01]"
                    style={{
                      animation: `fadeIn 0.5s ease-out ${0.9 + index * 0.1}s both`
                    }}
                  >
                    <td className="p-4 text-gray-800 font-medium">{evento.tipo}</td>
                    <td className="p-4 text-gray-700">{evento.zona}</td>
                    <td className="p-4 text-gray-700">{evento.fecha}</td>
                    <td className="p-4">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium inline-block hover:bg-blue-200 transition-colors">
                        {evento.hora}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Información de contacto */}
        <div 
          className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl shadow-lg p-6 text-white relative overflow-hidden"
          style={{
            animation: 'fadeInUp 0.6s ease-out 1s both'
          }}
        >
          <div className="relative z-10">
            <h3 className="text-xl font-bold mb-2">¿Necesitas ayuda?</h3>
            <p className="text-blue-100">Contacta con la administración para consultas o reportar problemas con el servicio.</p>
          </div>
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white opacity-10 rounded-full animate-pulse-slow" />
        </div>
      </div>

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes growUp {
          from {
            transform: scaleY(0);
            transform-origin: bottom;
          }
          to {
            transform: scaleY(1);
            transform-origin: bottom;
          }
        }

        @keyframes ring {
          0%, 100% {
            transform: rotate(0deg);
          }
          10%, 30% {
            transform: rotate(-10deg);
          }
          20%, 40% {
            transform: rotate(10deg);
          }
        }

        .animate-bounce-slow {
          animation: bounce 3s infinite;
        }

        .animate-pulse-slow {
          animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        .animate-ring {
          animation: ring 2s ease-in-out infinite;
        }

        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }
      `}</style>
    </div>
  );
}

/** 
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from 'react-hot-toast';
import { Card, CardContent } from "@/components/ui/card"
import {
  Home,
  Users,
  Wrench,
  CreditCard,
  Droplet,
  Book,
  Bell,
  Map,
  AlertCircle,
  Calendar
} from "lucide-react"
import ruta from "@/api/axios"

const iconMap = {
  Home,
  Users,
  Wrench,
  CreditCard,
  Droplet,
  Map,
  Book,
  Bell,
  AlertCircle,
  Calendar
} as const

interface Funcion {
  nombreFuncion: string
  icono: keyof typeof iconMap
}

export default function DashboardPage() {
  const router = useRouter();

  const [funciones, setFunciones] = useState<Funcion[]>([])

  useEffect(() => {
    const fetchRolYFunciones = async () => {
      try {
        // Obtener rol actual
        const rolRes = await ruta.get("/auth/obtenerRolActual");
        const rolActual = rolRes.data.rol || "Socio";

        // Obtener funciones según rol
        const funcionesRes = await ruta.get(`/auth/funciones/${rolActual}`);
        setFunciones(funcionesRes.data.funciones);
      } catch (error: any) {
        if (error.response?.status === 401 || error.response?.status === 400) {
          // No loggear el error 401, es comportamiento esperado
          router.push('/');
          return;
        }else{
          //console.error("Error al obtener funciones:", error)
          toast.error("Error de sesion", {
            duration: 4000,
            style: {
              background: '#e02424',
              color: '#fff'
            }
          })
          router.push('/');
          return;
        }
        // Solo loggear otros errores
        //console.error("Error al obtener rol y funciones:", error);
      }
    }

    fetchRolYFunciones();
  }, []);

  const accesos = funciones.map(func => ({
    title: func.nombreFuncion,
    icon: iconMap[func.icono] || Home
  }))

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Bienvenido al Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {accesos.map(({ title, icon: Icon }, idx) => (
          <Card key={idx} className="hover:shadow-lg transition rounded-2xl">
            <CardContent className="flex items-center gap-4 p-6">
              <Icon className="w-10 h-10 text-blue-600" />
              <span className="font-semibold">{title}</span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
*/