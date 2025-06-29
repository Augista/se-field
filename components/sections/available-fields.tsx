"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users } from "lucide-react"
import Image from "next/image"

const fields = [
  {
    id: 1,
    name: "Lapangan Futsal A",
    type: "Futsal",
    capacity: "10 Pemain",
    price: "Rp 150.000",
    duration: "per jam",
    image: "/fields/lapanganFutsal.png",
    available: true,
    features: ["Rumput Sintetis", "Lampu LED", "Tribun"],
    fieldId: "1",
  },
  {
    id: 2,
    name: "Lapangan Basket Indoor",
    type: "Basket",
    capacity: "10 Pemain",
    price: "Rp 200.000",
    duration: "per jam",
    image: "/fields/lapanganBasket.png",
    available: true,
    features: ["AC", "Lantai Parket", "Sound System"],
    fieldId: "2",
  },
  {
    id: 3,
    name: "Lapangan Badminton",
    type: "Badminton",
    capacity: "4 Pemain",
    price: "Rp 80.000",
    duration: "per jam",
    image: "/fields/lapanganBadminton.png",
    available: true,
    features: ["AC", "Lantai Vinyl", "Net Standar"],
    fieldId: "3",
  },
  {
    id: 4,
    name: "Lapangan Tenis",
    type: "Tenis",
    capacity: "4 Pemain",
    price: "Rp 120.000",
    duration: "per jam",
    image: "/fields/lapanganTennis.png",
    available: true,
    features: ["Hard Court", "Lampu Floodlight", "Tribun"],
    fieldId: "4",
  },
]

export function AvailableFields() {
  const [selectedType, setSelectedType] = useState("Semua")
  const router = useRouter()
  const types = ["Semua", "Futsal", "Basket", "Badminton", "Tenis"]

  const filteredFields = selectedType === "Semua" ? fields : fields.filter((field) => field.type === selectedType)

  const handleBookingClick = (field: (typeof fields)[0]) => {
    if (!field.available) return

    // Navigate to booking page with pre-selected field
    const searchParams = new URLSearchParams({
      fieldId: field.fieldId,
      fieldName: field.name,
      fieldType: field.type,
      fieldPrice: field.price.replace(/[^\d]/g, ""), // Extract numeric price
    })

    router.push(`/booking?${searchParams.toString()}`)
  }

  return (
    <section className="py-20 bg-gray-50 w-full">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Lapangan Tersedia</h2>
          <p className="mt-4 text-lg text-gray-600">Pilih lapangan sesuai kebutuhan olahraga Anda</p>
        </div>

        {/* Filter Buttons */}
        <div className="mt-12 flex flex-wrap justify-center gap-2">
          {types.map((type) => (
            <Button
              key={type}
              variant={selectedType === type ? "default" : "outline"}
              onClick={() => setSelectedType(type)}
              className={selectedType === type ? "bg-blue-600 hover:bg-blue-700" : ""}
            >
              {type}
            </Button>
          ))}
        </div>

        {/* Fields Grid */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 justify-items-center">
          {filteredFields.map((field) => (
            <Card
              key={field.id}
              className={`w-full max-w-sm overflow-hidden transition-all duration-300 ${
                field.available ? "hover:shadow-lg hover:scale-105 cursor-pointer" : "opacity-75 cursor-not-allowed"
              }`}
              onClick={() => field.available && handleBookingClick(field)}
            >
              <div className="relative">
                <Image
                  src={field.image}
                  alt={field.name}
                  width={300}
                  height={200}
                  className="h-48 w-full object-cover"
                />
                <Badge
                  className={`absolute top-3 right-3 ${
                    field.available ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"
                  }`}
                >
                  {field.available ? "Tersedia" : "Penuh"}
                </Badge>

                {/* Quick Info Overlay */}
                {field.available && (
                  <div className="absolute inset-0 bg-opacity-0 hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-white rounded-lg px-4 py-2 text-center">
                        <p className="text-sm font-medium text-gray-900">Klik untuk booking</p>
                        <p className="text-xs text-gray-600">Langsung ke form pemesanan</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-center">{field.name}</CardTitle>
                <CardDescription className="flex items-center justify-center gap-4 text-sm">
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {field.capacity}
                  </span>
                  <Badge variant="secondary">{field.type}</Badge>
                </CardDescription>
              </CardHeader>

              <CardContent className="pb-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-center">
                    <span className="text-2xl font-bold text-blue-600">{field.price}</span>
                    <span className="text-sm text-gray-500 ml-1">{field.duration}</span>
                  </div>
                  <div className="flex flex-wrap justify-center gap-1">
                    {field.features.map((feature, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>

              <CardFooter>
                <Button
                  className={`w-full ${
                    field.available
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "bg-gray-400 cursor-not-allowed text-gray-600"
                  }`}
                  disabled={!field.available}
                  onClick={(e) => {
                    e.stopPropagation() // Prevent card click when button is clicked
                    handleBookingClick(field)
                  }}
                >
                  {field.available ? "Booking Sekarang" : "Tidak Tersedia"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Quick Booking Info */}
        <div className="mt-16 mx-auto max-w-4xl">
          <div className="rounded-2xl bg-blue-50 border border-blue-200 p-8 text-center">
            <h3 className="text-xl font-bold text-blue-900 mb-4">Booking Cepat & Mudah</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                  <span className="text-blue-600 font-bold">1</span>
                </div>
                <p className="font-medium text-blue-900">Pilih Lapangan</p>
                <p className="text-blue-700">Klik card lapangan yang diinginkan</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                  <span className="text-blue-600 font-bold">2</span>
                </div>
                <p className="font-medium text-blue-900">Isi Detail</p>
                <p className="text-blue-700">Lengkapi form booking dengan data Anda</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                  <span className="text-blue-600 font-bold">3</span>
                </div>
                <p className="font-medium text-blue-900">Bayar & Main</p>
                <p className="text-blue-700">Lakukan pembayaran dan nikmati permainan</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
