'use client'

import React from 'react'
import { Droplet, DollarSign, Users, FileText, AlertCircle } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const ReportesAdmin: React.FC = () => {
  // Datos de ejemplo
  const consumoMensual = [
    { mes: 'Ene', consumo: 1200 },
    { mes: 'Feb', consumo: 1350 },
    { mes: 'Mar', consumo: 1100 },
    { mes: 'Abr', consumo: 1500 },
  ]

  const pagosPendientes = [
    { estado: 'Pagado', valor: 85 },
    { estado: 'Pendiente', valor: 15 },
  ]

  const COLORS = ['#34d399', '#f87171']

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 to-cyan-600 rounded-2xl shadow-xl p-6 text-white">
          <h2 className="text-3xl font-bold">Reportes del Comité</h2>
          <p className="text-blue-100">Estadísticas generales de consumos, pagos y socios</p>
        </div>

        {/* Tarjetas resumen */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6 flex items-center gap-4 border-l-4 border-blue-500">
            <Droplet className="w-10 h-10 text-blue-600" />
            <div>
              <p className="text-gray-500 text-sm">Consumo Total (m³)</p>
              <p className="text-2xl font-bold text-gray-800">5,150</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 flex items-center gap-4 border-l-4 border-green-500">
            <DollarSign className="w-10 h-10 text-green-600" />
            <div>
              <p className="text-gray-500 text-sm">Recaudación Total</p>
              <p className="text-2xl font-bold text-gray-800">42,300 Bs</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 flex items-center gap-4 border-l-4 border-orange-500">
            <Users className="w-10 h-10 text-orange-600" />
            <div>
              <p className="text-gray-500 text-sm">Socios Activos</p>
              <p className="text-2xl font-bold text-gray-800">100</p>
            </div>
          </div>
        </div>

        {/* Gráficas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Consumo mensual */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-blue-700 mb-4">Consumo de Agua por Mes</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={consumoMensual}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="consumo" fill="#3b82f6" radius={[6,6,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pagos */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-blue-700 mb-4">Pagos Pendientes</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pagosPendientes}
                  dataKey="valor"
                  nameKey="estado"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {pagosPendientes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Otros reportes */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-blue-700 mb-4 flex items-center gap-2">
            <AlertCircle /> Reclamos
          </h3>
          <p className="text-gray-600">En septiembre se recibieron <span className="font-semibold">25 reclamos</span>, de los cuales <span className="text-green-600 font-semibold">18</span> fueron resueltos y <span className="text-orange-600 font-semibold">7</span> están pendientes.</p>
        </div>

      </div>
    </div>
  )
}

export default ReportesAdmin
