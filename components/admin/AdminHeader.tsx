
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import clsx from "clsx"

export function AdminHeader() {
  const pathname = usePathname()

  return (
    <header className="p-4 bg-gray-900 text-white flex justify-between">
      <h1 className="font-bold text-xl">Admin Panel</h1>
      <nav className="space-x-4">
        <Link href="/admin/dashboard" className={clsx(pathname === "/admin/dashboard" && "underline")}>Dashboard</Link>
        <Link href="/admin/manage" className={clsx(pathname === "/admin/manage" && "underline")}>Manajemen</Link>
      </nav>
    </header>
  )
}
