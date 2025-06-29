import { TrendingUp, Award, MapPin, Clock } from "lucide-react"

export function AboutStats() {
  return (
    <section className="py-20 bg-blue-600 w-full">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Pencapaian Kami</h2>
          <p className="mt-4 text-lg text-blue-100">Angka-angka yang membuktikan kepercayaan Anda</p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/10 mb-6">
              <TrendingUp className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-3xl font-bold text-white mb-2">150%</h3>
            <p className="text-blue-100">Pertumbuhan Tahunan</p>
          </div>

          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/10 mb-6">
              <Award className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-3xl font-bold text-white mb-2">5</h3>
            <p className="text-blue-100">Penghargaan Diterima</p>
          </div>

          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/10 mb-6">
              <MapPin className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-3xl font-bold text-white mb-2">25</h3>
            <p className="text-blue-100">Kota Terjangkau</p>
          </div>

          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/10 mb-6">
              <Clock className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-3xl font-bold text-white mb-2">24/7</h3>
            <p className="text-blue-100">Layanan Tersedia</p>
          </div>
        </div>
      </div>
    </section>
  )
}
