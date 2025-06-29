import { Target, Eye, Heart } from "lucide-react"

export function AboutMission() {
  return (
    <section className="py-20 bg-gray-50 w-full">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Misi & Visi Kami</h2>
          <p className="mt-4 text-lg text-gray-600">Komitmen kami untuk memajukan dunia olahraga Indonesia</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Mission */}
          <div className="rounded-2xl bg-white p-8 shadow-sm border text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 mb-6">
              <Target className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Misi Kami</h3>
            <p className="text-gray-600 leading-relaxed">
              Menyediakan platform digital yang memudahkan akses terhadap fasilitas olahraga berkualitas, mendorong gaya
              hidup sehat, dan membangun komunitas olahraga yang kuat di seluruh Indonesia.
            </p>
          </div>

          {/* Vision */}
          <div className="rounded-2xl bg-white p-8 shadow-sm border text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mb-6">
              <Eye className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Visi Kami</h3>
            <p className="text-gray-600 leading-relaxed">
              Menjadi platform penyewaan lapangan olahraga terdepan di Indonesia yang menghubungkan jutaan pecinta
              olahraga dengan fasilitas terbaik di seluruh nusantara.
            </p>
          </div>

          {/* Values */}
          <div className="rounded-2xl bg-white p-8 shadow-sm border text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 mb-6">
              <Heart className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Nilai Kami</h3>
            <p className="text-gray-600 leading-relaxed">
              Integritas, inovasi, dan dedikasi untuk memberikan pengalaman terbaik bagi setiap pengguna. Kami percaya
              bahwa olahraga adalah hak setiap orang untuk hidup sehat dan bahagia.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
