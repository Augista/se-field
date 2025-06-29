"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import clsx from "clsx"
import { useState } from "react"

export function AdminHeader() {
  const pathname = usePathname()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleLogout = async () => {
    setLoading(true)
    try {
      const res = await fetch("https://be-sefield.vercel.app/api/auth/logout", {
        method: "POST",
        credentials: "include", // optional, jika pakai cookie auth
      })

      if (res.ok) {
        router.push("/login")
      } else {
        console.error("Logout failed")
      }
    } catch (err) {
      console.error("Error during logout:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <header className="p-4 bg-gray-900 text-white flex justify-between items-center">
      <h1 className="font-bold text-xl">Admin Panel</h1>
      <nav className="flex items-center space-x-4">
        <Link
          href="/admin/dashboard"
          className={clsx(pathname === "/admin/dashboard" && "underline")}
        >
          Dashboard
        </Link>
        <Link
          href="/admin/manage"
          className={clsx(pathname === "/admin/manage" && "underline")}
        >
          Manajemen
        </Link>
        <button
          onClick={handleLogout}
          disabled={loading}
          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
        >
          {loading ? "Logging out..." : "Logout"}
        </button>
      </nav>
    </header>
  )
}
