"use client"

import UserMenu from "./UserMenu"

export default function Header() {
  return (
    <header className="h-16 shadow bg-white flex items-center justify-between px-6">
      <h1 className="font-semibold text-lg">Dashboard</h1>
      <UserMenu />
    </header>
  )
}
