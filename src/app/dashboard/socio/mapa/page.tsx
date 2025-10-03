"use client";

import dynamic from "next/dynamic";

// ⬇️ Importa el componente, pero desactiva el SSR
const MapaDelimitado = dynamic(() => import("../../administrador/mapa/MapaDelimitado"), {
  ssr: false,
});

export default function Page() {
  return (
    <div className="h-screen w-full">
      <MapaDelimitado />
    </div>
  );
}
