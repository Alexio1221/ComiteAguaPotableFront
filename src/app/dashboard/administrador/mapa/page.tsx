"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import ListaDeFiguras from "./ListaDeFiguras";
import ruta from "@/api/axios";

// Importa Mapa sin SSR
const MapaDelimitado = dynamic(() => import("./MapaDelimitado"), { ssr: false });

export default function Page() {
  const [figuras, setFiguras] = useState<any[]>([]);  // lista de figuras
  const [figuraSeleccionada, setFiguraSeleccionada] = useState<number | null>(null); // idFigura de la seleccionada

  // Función para actualizar la lista de figuras (READ)
  useEffect(() => {
    const cargarFiguras = async () => {
      try {
        const res = await ruta.get("/mapa");
        setFiguras(res.data); // actualiza el estado con las figuras
      } catch (err) {
        console.error("Error al obtener figuras:", err);
      }
    };

    cargarFiguras();
  }, []);

  // Función para eliminar figura
  const eliminarFigura = async (idFigura: number) => {
    try {
      await ruta.delete(`/mapa/${idFigura}`);
      setFiguras(figuras.filter(f => f.idFigura !== idFigura));
      setFiguraSeleccionada(null);
    } catch (err) {
      console.error("Error al eliminar figura:", err);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen w-full">
      <div className="flex-1 min-h-0">
        <MapaDelimitado
          figuras={figuras}
          setFiguras={setFiguras}
          figuraSeleccionada={figuraSeleccionada}
          setFiguraSeleccionada={setFiguraSeleccionada}
        />
      </div>
      <div className="w-full lg:w-80 bg-gray-100 p-4 overflow-y-auto mt-4 lg:mt-0 min-h-0">
        <ListaDeFiguras
          figuras={figuras}
          figuraSeleccionada={figuraSeleccionada}
          setFiguraSeleccionada={setFiguraSeleccionada}
          eliminarFigura={eliminarFigura}
        />
      </div>
    </div>
  );
}
