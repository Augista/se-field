import Link from "next/link"
import { MapPin, Phone, Mail, Facebook, Instagram, Twitter } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white w-full">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
                <MapPin className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold">SeField</span>
            </div>
            <p className="text-sm text-gray-400">
              Platform terpercaya untuk penyewaan lapangan olahraga dengan sistem booking online yang mudah dan aman.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Menu Cepat</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/fields" className="text-gray-400 hover:text-white transition-colors">
                  Lapangan
                </Link>
              </li>
              <li>
                <Link href="/booking" className="text-gray-400 hover:text-white transition-colors">
                  Booking
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
                  Tentang Kami
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Layanan</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/futsal" className="text-gray-400 hover:text-white transition-colors">
                  Lapangan Futsal
                </Link>
              </li>
              <li>
                <Link href="/basket" className="text-gray-400 hover:text-white transition-colors">
                  Lapangan Basket
                </Link>
              </li>
              <li>
                <Link href="/badminton" className="text-gray-400 hover:text-white transition-colors">
                  Lapangan Badminton
                </Link>
              </li>
              <li>
                <Link href="/tenis" className="text-gray-400 hover:text-white transition-colors">
                  Lapangan Tenis
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Kontak</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2 text-gray-400">
                <MapPin className="h-4 w-4" />
                Jl. Olahraga No. 123, Jakarta
              </li>
              <li className="flex items-center gap-2 text-gray-400">
                <Phone className="h-4 w-4" />
                +62 812-3456-7890
              </li>
              <li className="flex items-center gap-2 text-gray-400">
                <Mail className="h-4 w-4" />
                info@sefield.com
              </li>
            </ul>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} SeField. Semua hak dilindungi.</p>
        </div>
      </div>
    </footer>
  )
}
