'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { NavLinks } from './componentes/login/navEncavezado'
import LoginModal from './modals/loginModal'
import Bienvenido from './componentes/homePage/home'
import Nosotros from './componentes/homePage/nosotros'
import Ubicacion from './componentes/homePage/ubicacion'
import { Droplets } from 'lucide-react'

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="min-h-screen flex flex-col" id="inicio">
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
      </main>

      {/* Footer moderno */}
      <footer className="bg-blue-900 text-white text-center py-10 mt-12">
        <p className="text-lg font-semibold">
          © {new Date().getFullYear()} Comité de Agua Potable Catachilla Alta
        </p>
        <p className="text-sm opacity-80 mt-1">
          Sistema desarrollado por Alex GC
        </p>
      </footer>
    </div>
  )
}
