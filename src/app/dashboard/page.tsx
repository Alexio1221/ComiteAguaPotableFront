"use client"

import { useState, useEffect } from "react"
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
  const [funciones, setFunciones] = useState<Funcion[]>([])
  const [rol, setRol] = useState<string>("Socio");

  useEffect(() => {
    const fetchRolYFunciones = async () => {
      try {
        // Obtener rol actual
        const rolRes = await ruta.get("/auth/obtenerRolActual");
        const rolActual = rolRes.data.rol || "Socio";
        setRol(rolActual);

        // Obtener funciones según rol
        const funcionesRes = await ruta.get(`/auth/funciones/${rolActual}`);
        setFunciones(funcionesRes.data.funciones);
      } catch (error) {
        console.error("Error al obtener rol o funciones:", error);
        setFunciones([]);
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
