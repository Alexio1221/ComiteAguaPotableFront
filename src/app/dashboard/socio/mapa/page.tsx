"use client";

import dynamic from "next/dynamic";

const UbicacionSelector = dynamic(() => import("@/app/componentes/mapa/MapaVistaSocio"), { ssr: false });

export default function Page() {
  return (
    <div className="h-screen w-full">
      <UbicacionSelector
        referencia={{ lat: -17.405066347785226, lng: -65.98441004854527, nombre: 'Oficina Principal' }}

      />
    </div>
  );
}
