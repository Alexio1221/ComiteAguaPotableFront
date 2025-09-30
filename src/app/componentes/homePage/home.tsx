import React from "react";
import { motion } from "framer-motion";
import { AnimacionGotaDeAgua } from "@/animaciones/Animaciones";

export default function Bienvenido() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-16 flex flex-col md:flex-row items-center justify-between">

      {/* Texto */}
      <motion.div
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="md:w-1/2 space-y-6 text-center md:text-left flex flex-col items-center md:items-start"
      >
        <h2 className="text-4xl font-bold">Bienvenidos</h2>
        <p className="text-lg leading-relaxed opacity-90">
          El Comité de Agua Potable “Catachilla Alta” pone a disposición de sus usuarios esta plataforma informativa para comunicar de forma transparente todo lo relacionado con la gestión del recurso hídrico. Con base en nuestro Estatuto Orgánico, trabajamos por el desarrollo integral de la comunidad, asegurando un servicio eficiente, sostenible y justo para todos.
        </p>

        {/* Animación gota más moderada */}
        <div className="mt-6">
          <AnimacionGotaDeAgua className="w-100 h-100 object-contain" />
        </div>
      </motion.div>

      {/* Imagen circular más grande */}
      <motion.div
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="md:w-1/2 flex justify-center mt-10 md:mt-0"
      >
        <div
          className="
    w-[300px] h-[300px]          /* móviles (base) */  
    md:w-[400px] md:h-[400px]    /* pantallas medianas (≥768px) */
    lg:w-[500px] lg:h-[500px]    /* pantallas grandes (≥1024px) */
    xl:w-[600px] xl:h-[600px]    /* pantallas extra grandes (≥1280px) */
    rounded-full border-8 border-white 
    flex items-center justify-center overflow-hidden shadow-2xl bg-white
    "
        >
          <img src="/imagenes/loginImagen.webp" alt="Bienvenida" className="object-cover w-full h-full" />
        </div>
      </motion.div>
    </div>
  );
}
