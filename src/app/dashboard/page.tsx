"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Users, Wrench, CreditCard, Droplets } from "lucide-react"

export default function DashboardPage() {
  // 👇 Simulación del rol (luego vendrá desde la API o contexto global)
  const [rol, setRol] = useState<string>("administrador")

  // Definir accesos según rol
  const accesos: Record<string, { title: string; icon: any }[]> = {
    administrador: [
      { title: "Gestión de Usuarios", icon: Users },
      { title: "Reportes Técnicos", icon: Wrench },
      { title: "Pagos y Caja", icon: CreditCard },
    ],
    tecnico: [
      { title: "Mantenimiento", icon: Wrench },
      { title: "Incidencias", icon: Droplets },
    ],
    cajero: [
      { title: "Pagos", icon: CreditCard },
      { title: "Facturación", icon: Droplets },
    ],
    socio: [
      { title: "Mi Consumo", icon: Droplets },
      { title: "Pagos Realizados", icon: CreditCard },
    ],
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Bienvenido, {rol}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {accesos[rol].map((item, idx) => {
          const Icon = item.icon
          return (
            <Card key={idx} className="hover:shadow-lg transition rounded-2xl">
              <CardContent className="flex items-center gap-4 p-6">
                <Icon className="w-10 h-10 text-blue-600" />
                <span className="font-semibold">{item.title}</span>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
