"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export default function NavLinks({
  href,
  icon: Icon,
  children,
}: {
  href: string
  icon: any
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const active = pathname === href

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 p-2 rounded-lg transition ${active
          ? "bg-blue-600 text-white"
          : "hover:bg-blue-700 hover:text-white"
        }`}
    >
      <Icon className="w-5 h-5 shrink-0" />
      <span>{children}</span>
    </Link>
  )
}
