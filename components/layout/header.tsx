"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, X, MapPin } from "lucide-react"

type User = {
  id: string
  email: string
  nama: string
  role: string
}

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("https://be-sefield.vercel.app/api/auth/me", {
          credentials: "include",
        })
        const data = await res.json()
        if (res.ok && data.user) {
          setUser(data.user)
        }
      } catch (error) {
        console.error("Gagal mengambil user:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUser()
  }, [])

  const handleLogout = async () => {
    try {
      await fetch("https://be-sefield.vercel.app/api/auth/logout", {
        method: "POST",
        credentials: "include",
      })
      setUser(null)
      setIsMenuOpen(false)
    } catch (error) {
      console.error("Logout gagal:", error)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto max-w-7xl flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
            <MapPin className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">SeField</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link href="/" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
            Beranda
          </Link>
          <Link href="/booking" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
            Booking
          </Link>
          <Link href="/about" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
            Tentang
          </Link>
        </nav>

        {/* Desktop CTA Buttons */}
        <div className="hidden md:flex items-center space-x-3">
          {!isLoading && user ? (
            <>
              <span className="text-gray-700 font-medium">Hi, {user.nama}</span>
              <Button
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </>
          ) : !isLoading ? (
            <>
              <Link href="/login">
                <Button
                  variant="outline"
                  className="bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                >
                  Masuk
                </Button>
              </Link>
              <Link href="/register">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  Daftar
                </Button>
              </Link>
            </>
          ) : null}
        </div>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 space-y-4">
            <Link href="/" className="block text-sm font-medium text-gray-700">
              Beranda
            </Link>
            <Link href="/booking" className="block text-sm font-medium text-gray-700">
              Booking
            </Link>
            <Link href="/about" className="block text-sm font-medium text-gray-700">
              Tentang
            </Link>

            <div className="flex flex-col space-y-2 pt-4">
              {!isLoading && user ? (
                <>
                  <span className="text-gray-700 font-medium">Hi, {user.nama}</span>
                  <Button
                    variant="outline"
                    className="border-gray-300 text-gray-700"
                    onClick={() => {
                      handleLogout()
                      setIsMenuOpen(false)
                    }}
                  >
                    Logout
                  </Button>
                </>
              ) : !isLoading ? (
                <>
                  <Link href="/login">
                    <Button variant="outline" className="w-full">
                      Masuk
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                      Daftar
                    </Button>
                  </Link>
                </>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
