"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, MapPin } from "lucide-react"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

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

        {/* CTA Buttons */}
        <div className="hidden md:flex items-center space-x-3">
          <Button variant="outline" className="bg-white text-gray-700 border-gray-300 hover:bg-gray-50">
            <Link href="/login">Masuk</Link>
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Link href="/register">Daftar</Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
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
            <div className="flex space-x-3 pt-4">
              <Button variant="outline" className="flex-1">
                <Link href="/login">Masuk</Link>
              </Button>
              <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                <Link href="/register">Daftar</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
