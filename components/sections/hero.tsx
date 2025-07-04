import { Button } from "@/components/ui/button"
import { Calendar, Clock, Shield } from "lucide-react"
import Link from "next/link"

export function Hero() {
  return (
    <section className="relative py-20 lg:py-32 w-full">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl">
            Sewa Lapangan
            <span className="text-blue-600"> Olahraga</span>
            <br />
            Dengan Mudah
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
            Platform terpercaya untuk menyewa lapangan olahraga. Booking online, pembayaran aman, dan jadwal fleksibel
            untuk semua kebutuhan olahraga Anda.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 w-full sm:w-auto">
              <Link href="/booking" className="flex items-center justify-center gap-2">
                <Calendar className="h-5 w-5" />
                Booking Sekarang
              </Link>
            </Button>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="rounded-2xl bg-white p-6 shadow-sm border text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-gray-900">Booking Mudah</h3>
            <p className="mt-2 text-sm text-gray-600">
              Sistem booking online yang mudah dan cepat dengan konfirmasi real-time
            </p>
          </div>
          <div className="rounded-2xl bg-white p-6 shadow-sm border text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
              <Clock className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-gray-900">Jadwal Fleksibel</h3>
            <p className="mt-2 text-sm text-gray-600">
              Reschedule dan pembatalan mudah sesuai dengan kebijakan yang berlaku
            </p>
          </div>
          <div className="rounded-2xl bg-white p-6 shadow-sm border text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
              <Shield className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-gray-900">Pembayaran Aman</h3>
            <p className="mt-2 text-sm text-gray-600">Sistem pembayaran yang aman dengan berbagai metode pembayaran</p>
          </div>
        </div>
      </div>
    </section>
  )
}
