"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getImageUrl } from "@/lib/get-image-url"

type FieldData = {
  id: string
  name: string
  type: string
  price: number
  image: string | null
  description?: string | null
  is_active: boolean
  operational_start: string
  operational_end: string
  created_at: string
  updated_at: string
}

export function AvailableFields() {
  const [fields, setFields] = useState<FieldData[]>([])
  const [selectedType, setSelectedType] = useState("Semua")
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchFields = async () => {
      try {
        const res = await fetch("https://be-sefield.vercel.app/api/fields", {
          cache: "no-store",
        })

        if (!res.ok) throw new Error("Gagal mengambil data")

        const data = await res.json()
        setFields(data)
      } catch (err) {
        console.error("Gagal fetch lapangan:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchFields()
  }, [])

  const types = ["Semua", ...Array.from(new Set(fields.map(f => f.type)))]

  const filteredFields =
    selectedType === "Semua"
      ? fields
      : fields.filter(field => field.type === selectedType)

  const handleBookingClick = (field: FieldData) => {
    if (!field.is_active) return

    const searchParams = new URLSearchParams({
      fieldId: field.id,
      fieldName: field.name,
      fieldType: field.type,
      fieldPrice: String(field.price),
    })

    router.push(`/booking?${searchParams.toString()}`)
  }

  if (loading) {
    return (
      <section className="py-20 text-center text-gray-600">
        <p>Sedang memuat lapangan...</p>
      </section>
    )
  }

  return (
    <section className="py-20 bg-gray-50 w-full">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Lapangan Tersedia
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Pilih lapangan sesuai kebutuhan olahraga Anda
          </p>
        </div>

        {/* Filter tombol */}
        <div className="mt-12 flex flex-wrap justify-center gap-2">
          {types.map(type => (
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

        {/* Grid lapangan */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 justify-items-center">
          {filteredFields.length === 0 ? (
            <p className="text-gray-500 text-center col-span-full">
              Tidak ada lapangan untuk kategori ini.
            </p>
          ) : (
            filteredFields.map(field => (
              <Card
                key={field.id}
                className={`w-full max-w-sm overflow-hidden transition-all duration-300 ${
                  field.is_active
                    ? "hover:shadow-lg hover:scale-105 cursor-pointer"
                    : "opacity-75 cursor-not-allowed"
                }`}
                onClick={() => field.is_active && handleBookingClick(field)}
              >
                <div className="relative">
                  <Image
                    src={getImageUrl(field.image)}
                    alt={field.name}
                    width={300}
                    height={200}
                    className="h-48 w-full object-cover"
                    unoptimized
                  />
                  <Badge
                    className={`absolute top-3 right-3 ${
                      field.is_active
                        ? "bg-green-500 hover:bg-green-600"
                        : "bg-red-500 hover:bg-red-600"
                    }`}
                  >
                    {field.is_active ? "Tersedia" : "Penuh"}
                  </Badge>
                </div>

                <CardHeader className="pb-3 text-center">
                  <CardTitle className="text-lg">{field.name}</CardTitle>
                  <CardDescription>
                    <Badge variant="secondary">{field.type}</Badge>
                  </CardDescription>
                </CardHeader>

                <CardContent className="pb-3">
                  <div className="space-y-2 text-center">
                    <div>
                      <span className="text-2xl font-bold text-blue-600">
                        Rp {field.price.toLocaleString("id-ID")}
                      </span>
                      <span className="text-sm text-gray-500 ml-1">/jam</span>
                    </div>
                    {field.description && (
                      <div className="flex flex-wrap justify-center gap-1">
                        {field.description.split(",").map((feature, i) => (
                          <Badge
                            key={i}
                            variant="outline"
                            className="text-xs max-w-[150px] break-words"
                          >
                            {feature.trim()}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>

                <CardFooter>
                  <Button
                    className={`w-full ${
                      field.is_active
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "bg-gray-400 text-gray-600 cursor-not-allowed"
                    }`}
                    disabled={!field.is_active}
                    onClick={e => {
                      e.stopPropagation()
                      handleBookingClick(field)
                    }}
                  >
                    {field.is_active ? "Booking Sekarang" : "Tidak Tersedia"}
                  </Button>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      </div>
    </section>
  )
}
