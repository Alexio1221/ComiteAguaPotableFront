'use client'
import { useState } from 'react';
import { NavLinks } from './componentes/navEncavezado';

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col items-center">
      {/* Header */}
      <header className="bg-blue-700 text-white shadow-md fixed top-0 w-full z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center px-4 py-3 h-16">
          <h1 className="text-xl font-bold">Comité de Agua Potable</h1>

          {/* Botón menú móvil */}
          <button
            className="md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M5 7h14M5 12h14M5 17h14" />
            </svg>
          </button>

          {/* Menú desktop */}
          <NavLinks mode="desktop" />

          {/* Login (siempre visible) */}
          <a
            href="/login"
            className="bg-white text-blue-700 px-4 py-2 rounded-md font-semibold hover:bg-gray-100 ml-4"
          >
            Iniciar sesión
          </a>
        </div>

        {/* Menú móvil */}
        {menuOpen && (
          <NavLinks mode="mobile" />
        )}
      </header>

      {/* Main */}
      <main className="flex-grow bg-gray-50">
        {/* Inicio */}
        <section id="inicio" className="text-center py-16 bg-blue-100">
          <h2 className="text-3xl font-bold mb-4">Bienvenido</h2>
          <p className="text-lg max-w-xl mx-auto">
            Sistema de gestión del Comité de Agua Potable Catachilla Alta. Aquí encontrarás información y servicios útiles para nuestra comunidad.
          </p>
        </section>

        {/* Nosotros */}
        <section id="nosotros" className="py-16 px-4 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Nosotros</h2>
          <p className="mb-4">
            Somos una organización vecinal que administra el agua potable de manera justa y transparente.
          </p>
          <h3 className="font-semibold mb-2">Representantes del Comité:</h3>
          <ul className="list-disc list-inside space-y-1">
            <li>Presidente: Don Nicolás Quispe</li>
            <li>Secretaria: Juana Flores</li>
            <li>Tesorero: Martín Lema</li>
          </ul>
        </section>

        {/* Ubicación */}
        <section id="ubicacion" className="py-16 px-4 bg-white max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Ubicación</h2>
          <p className="mb-4">
            Comunidad Catachilla Alta, Zona Rural del Municipio X, Departamento de Y.
          </p>
          {/* Puedes insertar un iframe de Google Maps aquí si quieres */}
        </section>

        {/* Misión y Visión */}
        <section id="mision-vision" className="py-16 px-4 bg-blue-50 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Misión y Visión</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">Misión</h3>
              <p>Garantizar el acceso sostenible, justo y continuo al agua potable para todos los miembros de la comunidad.</p>
            </div>
            <div>
              <h3 className="font-semibold">Visión</h3>
              <p>Ser un modelo de gestión comunitaria transparente y eficiente en servicios básicos.</p>
            </div>
          </div>
        </section>

        {/* Noticias */}
        <section id="noticias" className="py-16 px-4 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Noticias</h2>
          <ul className="space-y-3">
            <li>📅 Corte de agua programado para el 10 de agosto.</li>
            <li>🛠️ Mantenimiento del tanque principal – 5 de septiembre.</li>
            <li>📣 Asamblea general – 15 de septiembre a las 18:00.</li>
          </ul>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-blue-700 text-white text-center py-6">
        <p>© {new Date().getFullYear()} Comité de Agua Potable Catachilla Alta</p>
        <p className="text-sm">Sistema desarrollado por Alex GC</p>
      </footer>
    </div>
  );
}