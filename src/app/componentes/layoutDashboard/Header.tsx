"use client"

import UserMenu from "./UserMenu"

interface HeaderProps {
  rol: string
  setRol: (rol: string) => void
}

export default function Header({ rol, setRol }: HeaderProps) {
  const roles = ["Socio", "Operador", "Administrador"]; // puedes agregar más

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRol(e.target.value);
  }

  return (
    <header className="h-16 shadow bg-white flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <h1 className="font-semibold text-lg">Dashboard</h1>

        {/* Desplegable de roles */}
        <select
          value={rol}
          onChange={handleChange}
          className="border rounded px-2 py-1"
        >
          {roles.map(r => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>

      <UserMenu />
    </header>
  )
}
