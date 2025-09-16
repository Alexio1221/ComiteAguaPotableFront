"use client"

import { useState, useRef, useEffect, ReactNode } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface DropdownItem {
  label: string
  value?: string
  onClick?: () => void
}

interface DropdownProps {
  trigger: ReactNode
  items: DropdownItem[]
  className?: string
  dropdownClassName?: string
}

export default function Dropdown({ trigger, items, className, dropdownClassName }: DropdownProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div ref={ref} className={`relative ${className || ""}`}>
      {/* Botón que abre/cierra el dropdown */}
      <div onClick={() => setOpen(!open)} className="cursor-pointer">
        {trigger}
      </div>

      {/* Dropdown animado */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className={`absolute right-0 mt-2 bg-white text-gray-800 rounded-lg shadow-lg overflow-hidden z-50 ${dropdownClassName || ""}`}
          >
            {items.map((item, index) => (
              <button
                key={index}
                className="block w-full text-left p-3 hover:bg-gray-100 transition-colors duration-150"
                onClick={() => {
                  item.onClick?.()
                  setOpen(false) // también cierra al seleccionar un item
                }}
              >
                {item.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
