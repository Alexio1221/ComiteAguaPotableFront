'use client'

import Sidebar from "@/app/componentes/layoutDashboard/Sidebar"
import Header from "@/app/componentes/layoutDashboard/Header"
import { useEffect, useState } from 'react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [rol, setRol] = useState("Socio");

  return (
    <div className="h-screen w-full flex bg-gray-50 text-gray-900">
      {/* Sidebar */}
      <Sidebar rol={rol} />

      {/* Main Content */}
      <div className="flex flex-col flex-1">
        {/* Header */}
        <Header rol={rol} setRol={setRol} />

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
