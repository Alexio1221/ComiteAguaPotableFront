'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { NavLinks } from './componentes/login/navEncavezado'
import LoginModal from './modals/loginModal'
import Bienvenido from './componentes/homePage/home'
import Nosotros from './componentes/homePage/nosotros'
import Ubicacion from './componentes/homePage/ubicacion'
import NoticiasAvisosCarrusel from './componentes/homePage/noticiasYavisos'
import MisionVision from './componentes/homePage/misionYvision'
import { Droplets, Mail, Phone, User } from 'lucide-react';

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header estilo ancho completo */}
      <header className="fixed top-0 w-full bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 shadow-xl z-50 rounded-b-xl">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4 md:py-5 gap-4">

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg">
              <Droplets className="w-6 h-6 text-blue-600" />
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-white drop-shadow-md">Comité de Agua Potable</h1>
          </div>

          {/* Menú Desktop */}
          <nav className="hidden md:flex items-center gap-6">
            <NavLinks mode="desktop" />
          </nav>

          {/* Menú Mobile */}
          <button
            className="md:hidden p-2 rounded-lg bg-white bg-opacity-20 hover:bg-opacity-30 transition-all"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg className="w-6 h-6 text-white" xmlns="http://www.w3.org/2000/svg"
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Login */}
          <LoginModal />
        </div>

        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-blue-700 to-cyan-600 text-white shadow-inner p-4 md:hidden"
          >
            <NavLinks mode="mobile" />
          </motion.div>
        )}
      </header>

      <main className="flex-grow pt-[90px]">
        <section className="w-full bg-gradient-to-tr from-indigo-800 via-sky-600 to-cyan-400 text-white rounded-tl-[200px] rounded-br-[200px] sm:rounded-tl-[400px] sm:rounded-br-[400px] flex items-center justify-center">
          <Bienvenido />
        </section>

        <section id="nosotros" className="py-5 mx-auto">
          <Nosotros />
        </section>

        <section id="ubicacion" className="mx-auto">
          <Ubicacion />
        </section>

        <section id='mision-vision'>
          <MisionVision />
        </section>

        <section id="noticias-avisos" className="pt-16 mx-auto">
          <NoticiasAvisosCarrusel />
        </section>
      </main>

      {/* Footer moderno */}
      <footer className="relative bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 text-white overflow-hidden">
        {/* Decoración de fondo */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl opacity-10"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-300 rounded-full blur-3xl opacity-10"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
          {/* Contenido principal */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Logo y descripción */}
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <Droplets className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold">Catachilla Alta</h3>
              </div>
              <p className="text-blue-100 text-sm">
                Agua potable de calidad para nuestra comunidad
              </p>
            </div>

            {/* Contacto del Comité */}
            <div className="text-center md:text-right">
              <h4 className="font-bold text-lg mb-4">Comite</h4>
              <div className="space-y-2 text-blue-100 text-sm">
                <div className="flex items-center justify-center md:justify-end gap-2">
                  <User className="w-4 h-4 text-white" />
                  <p className="font-semibold text-white">Catachilla Alta</p>
                </div>
                <div className="flex items-center justify-center md:justify-end gap-2">
                  <Mail className="w-4 h-4 text-white" />
                  <p>catachilla@gmail.com</p>
                </div>
                <div className="flex items-center justify-center md:justify-end gap-2">
                  <Phone className="w-4 h-4 text-white" />
                  <p>7777777</p>
                </div>
              </div>
            </div>

            {/* Contacto del Desarrollador */}
            <div className="text-center md:text-right">
              <h4 className="font-bold text-lg mb-4">Desarrollador</h4>
              <div className="space-y-2 text-blue-100 text-sm">
                <div className="flex items-center justify-center md:justify-end gap-2">
                  <User className="w-4 h-4 text-white" />
                  <p className="font-semibold text-white">Alex Garcia Colque</p>
                </div>
                <div className="flex items-center justify-center md:justify-end gap-2">
                  <Mail className="w-4 h-4 text-white" />
                  <p>alexgac31@gmail.com</p>
                </div>
                <div className="flex items-center justify-center md:justify-end gap-2">
                  <Phone className="w-4 h-4 text-white" />
                  <p>67483408</p>
                </div>
              </div>
            </div>
          </div>

          {/* Separador */}
          <div className="border-t border-white border-opacity-20 pt-6">
            <div className="text-center text-sm text-blue-100">
              <p>
                © {new Date().getFullYear()} Comité de Agua Potable Catachilla Alta. Todos los derechos reservados.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
