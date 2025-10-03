'use client'

import { useState, useEffect } from 'react'
import { Droplet, DollarSign, Info, CheckCircle, XCircle, TrendingUp, Calendar } from 'lucide-react'

interface Consumo {
  id: number
  mes: string
  consumo: number
  estado: string
}

interface Medidor {
  id: number
  identificador: string
  categoria: string
  tarifaBasica: number
  limiteBasico: number
  precioExcedente: number
  consumos: Consumo[]
}

const ConsumoSocio: React.FC = () => {
  const [mounted, setMounted] = useState(false)
  const [selectedMedidor, setSelectedMedidor] = useState<number | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Ejemplo de socio con varios medidores
  const medidores: Medidor[] = [
    {
      id: 1,
      identificador: 'Medidor #1 - Casa Principal',
      categoria: 'Doméstico',
      tarifaBasica: 10,
      limiteBasico: 12,
      precioExcedente: 3,
      consumos: [
        { id: 1, mes: 'Septiembre 2025', consumo: 15, estado: 'Pagado' },
        { id: 2, mes: 'Agosto 2025', consumo: 10, estado: 'Pendiente' },
        { id: 3, mes: 'Julio 2025', consumo: 14, estado: 'Pagado' },
      ],
    },
    {
      id: 2,
      identificador: 'Medidor #2 - Lote Secundario',
      categoria: 'Doméstico',
      tarifaBasica: 10,
      limiteBasico: 12,
      precioExcedente: 3,
      consumos: [
        { id: 1, mes: 'Septiembre 2025', consumo: 8, estado: 'Pagado' },
        { id: 2, mes: 'Agosto 2025', consumo: 20, estado: 'Pagado' },
        { id: 3, mes: 'Julio 2025', consumo: 11, estado: 'Pagado' },
      ],
    },
    {
      id: 3,
      identificador: 'Medidor #3 - Tienda',
      categoria: 'Comercial',
      tarifaBasica: 20,
      limiteBasico: 15,
      precioExcedente: 5,
      consumos: [
        { id: 1, mes: 'Septiembre 2025', consumo: 18, estado: 'Pagado' },
        { id: 2, mes: 'Agosto 2025', consumo: 12, estado: 'Pendiente' },
        { id: 3, mes: 'Julio 2025', consumo: 22, estado: 'Pagado' },
        { id: 4, mes: 'Mayo 2025', consumo: 18, estado: 'Pagado' },
        { id: 5, mes: 'Abril 2025', consumo: 12, estado: '¨Pagado' },
        { id: 6, mes: 'Marzo 2025', consumo: 22, estado: 'Pagado' },
      ],
    },
  ]

  // Calculo del monto según reglas
  const calcularMonto = (consumo: number, medidor: Medidor) => {
    if (consumo <= medidor.limiteBasico) return medidor.tarifaBasica
    const excedente = consumo - medidor.limiteBasico
    return medidor.tarifaBasica + excedente * medidor.precioExcedente
  }

  // Calcular totales
  const calcularTotales = (medidor: Medidor) => {
    const totalConsumo = medidor.consumos.reduce((sum, c) => sum + c.consumo, 0)
    const totalMonto = medidor.consumos.reduce((sum, c) => sum + calcularMonto(c.consumo, medidor), 0)
    const pendientes = medidor.consumos.filter(c => c.estado === 'Pendiente').length
    return { totalConsumo, totalMonto, pendientes }
  }

  // Calcular promedio
  const calcularPromedio = (medidor: Medidor) => {
    const total = medidor.consumos.reduce((sum, c) => sum + c.consumo, 0)
    return (total / medidor.consumos.length).toFixed(1)
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div 
          className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl shadow-xl p-6 text-white"
          style={{ animation: 'slideDown 0.6s ease-out' }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-3 rounded-xl">
                <Droplet className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-3xl font-bold">Pagos y Consumos</h2>
                <p className="text-blue-100">Gestiona y revisa tus medidores</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-blue-100 text-sm">Total de medidores</p>
              <p className="text-4xl font-bold">{medidores.length}</p>
            </div>
          </div>
        </div>

        {/* Resumen general */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div 
            className="bg-white rounded-xl shadow-lg p-5 border-l-4 border-blue-500 hover:shadow-xl transition-all duration-300"
            style={{ animation: 'fadeInUp 0.6s ease-out 0.1s both' }}
          >
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Droplet className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Consumo Total</p>
                <p className="text-2xl font-bold text-gray-800">
                  {medidores.reduce((sum, m) => sum + calcularTotales(m).totalConsumo, 0)} m³
                </p>
              </div>
            </div>
          </div>

          <div 
            className="bg-white rounded-xl shadow-lg p-5 border-l-4 border-green-500 hover:shadow-xl transition-all duration-300"
            style={{ animation: 'fadeInUp 0.6s ease-out 0.2s both' }}
          >
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-3 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Total a Pagar</p>
                <p className="text-2xl font-bold text-gray-800">
                  30 Bs
                </p>
              </div>
            </div>
          </div>

          <div 
            className="bg-white rounded-xl shadow-lg p-5 border-l-4 border-orange-500 hover:shadow-xl transition-all duration-300"
            style={{ animation: 'fadeInUp 0.6s ease-out 0.3s both' }}
          >
            <div className="flex items-center gap-3">
              <div className="bg-orange-100 p-3 rounded-lg">
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Pagos Pendientes</p>
                <p className="text-2xl font-bold text-gray-800">
                  {medidores.reduce((sum, m) => sum + calcularTotales(m).pendientes, 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Grid de medidores - adaptativo según cantidad */}
        <div className={`grid gap-6 ${
          medidores.length === 1 
            ? 'grid-cols-1' 
            : medidores.length === 2 
            ? 'grid-cols-1 md:grid-cols-2' 
            : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
        }`}>
          {medidores.map((medidor, index) => {
            const totales = calcularTotales(medidor)
            const promedio = calcularPromedio(medidor)
            
            return (
              <div 
                key={medidor.id} 
                className="bg-white shadow-lg rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                style={{ animation: `fadeInUp 0.6s ease-out ${0.4 + index * 0.1}s both` }}
              >
                {/* Header del medidor */}
                <div className={`p-5 ${
                  medidor.categoria === 'Comercial' 
                    ? 'bg-gradient-to-r from-purple-500 to-purple-600' 
                    : 'bg-gradient-to-r from-blue-500 to-cyan-500'
                } text-white`}>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-lg font-bold">{medidor.identificador}</h3>
                      <span className="inline-block mt-1 px-3 py-1 text-xs rounded-full bg-white/20 backdrop-blur-sm font-semibold">
                        {medidor.categoria}
                      </span>
                    </div>
                    <Droplet className="w-8 h-8 opacity-80" />
                  </div>
                  
                  {/* Mini estadísticas */}
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2">
                      <p className="text-xs opacity-80">Consumo Total</p>
                      <p className="text-lg font-bold">{totales.totalConsumo} m³</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2">
                      <p className="text-xs opacity-80">Promedio</p>
                      <p className="text-lg font-bold">{promedio} m³</p>
                    </div>
                  </div>
                </div>

                {/* Cuerpo del medidor */}
                <div className="p-5">
                  {/* Información de tarifas */}
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 mb-4">
                    <h4 className="font-semibold flex items-center gap-2 text-blue-800 mb-2">
                      <Info size={16} /> Tarifas Aplicables
                    </h4>
                    <div className="space-y-1 text-sm text-gray-700">
                      <div className="flex justify-between">
                        <span>Tarifa básica:</span>
                        <span className="font-semibold">{medidor.tarifaBasica} Bs</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Límite básico:</span>
                        <span className="font-semibold">{medidor.limiteBasico} m³</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Excedente:</span>
                        <span className="font-semibold">{medidor.precioExcedente} Bs/m³</span>
                      </div>
                    </div>
                  </div>

                  {/* Tabla de consumos */}
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                      <TrendingUp size={16} className="text-blue-500" /> Historial de Consumo
                    </h4>
                    <div className={`space-y-2 ${medidor.consumos.length > 3 ? 'max-h-80 overflow-y-auto pr-2 scrollbar-thin' : ''}`}>
                      {medidor.consumos.map((item) => {
                        const monto = calcularMonto(item.consumo, medidor)
                        const excedente = item.consumo > medidor.limiteBasico
                        
                        return (
                          <div 
                            key={item.id} 
                            className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-all duration-300 hover:shadow-md"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <p className="font-semibold text-gray-800">{item.mes}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-sm text-gray-600">{item.consumo} m³</span>
                                  {excedente && (
                                    <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs rounded-full font-medium">
                                      Excedente
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-lg font-bold text-gray-800">{monto} Bs</p>
                                {item.estado === 'Pagado' ? (
                                  <span className="inline-flex items-center gap-1 text-xs text-green-600 font-semibold">
                                    <CheckCircle size={12}/> {item.estado}
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 text-xs text-red-600 font-semibold">
                                    <XCircle size={12}/> {item.estado}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Total del medidor */}
                  <div className="mt-4 pt-4 border-t-2 border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-700">Total del Medidor:</span>
                      <span className="text-xl font-bold text-blue-600">{totales.totalMonto} Bs</span>
                    </div>
                    {totales.pendientes > 0 && (
                      <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                        <XCircle size={12} /> {totales.pendientes} pago(s) pendiente(s)
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
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

        /* Estilos del scrollbar */
        .scrollbar-thin::-webkit-scrollbar {
          width: 8px;
        }

        .scrollbar-thin::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }

        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }

        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }

        /* Para Firefox */
        .scrollbar-thin {
          scrollbar-width: thin;
          scrollbar-color: #cbd5e1 #f1f5f9;
        }
      `}</style>
    </div>
  )
}

export default ConsumoSocio