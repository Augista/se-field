import { MapPin, Users, Calendar, Shield } from "lucide-react"

export function AboutHero() {
  return (
    <section className="relative py-20 lg:py-32 w-full bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Tentang
            <span className="text-blue-600"> SeField</span>
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg text-gray-600 leading-relaxed">
            SeField adalah platform digital terdepan untuk penyewaan lapangan olahraga di Indonesia. Kami hadir untuk
            memudahkan para pecinta olahraga dalam menemukan dan menyewa lapangan berkualitas dengan sistem booking yang
            mudah, aman, dan terpercaya.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="mx-auto mt-16 grid max-w-5xl grid-cols-2 gap-6 sm:grid-cols-4">
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
              <MapPin className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="mt-4 text-2xl font-bold text-gray-900">50+</h3>
            <p className="text-sm text-gray-600">Lapangan Tersedia</p>
          </div>
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <Users className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="mt-4 text-2xl font-bold text-gray-900">10K+</h3>
            <p className="text-sm text-gray-600">Pengguna Aktif</p>
          </div>
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-purple-100">
              <Calendar className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="mt-4 text-2xl font-bold text-gray-900">25K+</h3>
            <p className="text-sm text-gray-600">Booking Berhasil</p>
          </div>
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">
              <Shield className="h-8 w-8 text-orange-600" />
            </div>
            <h3 className="mt-4 text-2xl font-bold text-gray-900">99%</h3>
            <p className="text-sm text-gray-600">Kepuasan Pengguna</p>
          </div>
        </div>
      </div>
    </section>
  )
}
