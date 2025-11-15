"use client";

import React from "react";
import Image from "next/image";

interface Tool {
    nombre: string;
    icono: string; // ruta al png/webp
}

const herramientas: Tool[] = [
    { nombre: "Oficina Central", icono: "/imagenes/oficina.png" },
    { nombre: "Socio", icono: "/imagenes/ubicacionSocio.png" },
    { nombre: "Tubería", icono: "/imagenes/tubo.png" },
    { nombre: "Tanque de agua", icono: "/imagenes/tanqueAgua.png" },
    { nombre: "Válvula", icono: "/imagenes/valvula.png" },
    { nombre: "Bomba de agua", icono: "/imagenes/bombaDeAgua.png" },
];

export default function BarraSuperior() {
    return (
        <div className="w-full shadow-md bg-gradient-to-r from-cyan-400 via-cyan-300 to-cyan-200">
            <div className="max-w-full mx-auto px-4 pb-4 flex flex-col items-start md:items-center justify-center gap-2">
                {/* Título */}
                <div className="text-lg font-bold">Herramientas del Mapa</div>

                {/* Lista de herramientas */}
                <div className="flex flex-wrap items-center gap-4 mt-2">
                    {herramientas.map((h, idx) => (
                        <div
                            key={idx}
                            className="flex flex-col items-center justify-center text-xs md:text-sm"
                        >
                            <Image
                                src={h.icono}
                                alt={h.nombre}
                                width={60}
                                height={60}
                                className="object-contain mb-1"
                            />
                            <span>{h.nombre}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
