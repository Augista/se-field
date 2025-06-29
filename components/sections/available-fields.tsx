"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users } from "lucide-react"
import Image from "next/image"
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
  const router = useRouter()

  useEffect(() => {
    const fetchFields = async () => {
      try {
        const res = await fetch("https://be-sefield.vercel.app/api/fields") 
        const data = await res.json()
        setFields(data)
      } catch (err) {
        console.error("Gagal fetch lapangan", err)
      }
    }

    fetchFields()
  }, [])

  const types = ["Semua", ...Array.from(new Set(fields.map(f => f.type)))]

  const filteredFields =
    selectedType === "Semua" ? fields : fields.filter(field => field.type === selectedType)

  const handleBookingClick = (field: FieldData) => {
    if (!field.is_active) return

    const searchParams = new URLSearchParams({
      fieldId: field.id,
      fieldName: field.name,
      fieldType: field.type,
      fieldPrice: field.price.toString(),
    })

    router.push(`/booking?${searchParams.toString()}`)
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

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 justify-items-center">
          {filteredFields.map(field => (
            <Card
              key={field.id}
              className={`w-full max-w-sm overflow-hidden transition-all duration-300 ${
                field.is_active ? "hover:shadow-lg hover:scale-105 cursor-pointer" : "opacity-75 cursor-not-allowed"
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
                />
                <Badge
                  className={`absolute top-3 right-3 ${
                    field.is_active ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"
                  }`}
                >
                  {field.is_active ? "Tersedia" : "Penuh"}
                </Badge>

                {field.is_active && (
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
                  {/* <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {"-"} {/* You can enhance this with `capacity` in future */}
                  {/* </span> */} 
                  <Badge variant="secondary">{field.type}</Badge>
                </CardDescription>
              </CardHeader>

              <CardContent className="pb-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-center">
                    <span className="text-2xl font-bold text-blue-600">
                      Rp {field.price.toLocaleString("id-ID")}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">per jam</span>
                  </div>
                  <div className="flex flex-wrap justify-center gap-1">
                    {field.description?.split(",").map((feature, i) => (
                      <Badge key={i} variant="outline" className="text-xs max-w-[150px] break-words">
                        {feature.trim()}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>

              <CardFooter>
                <Button
                  className={`w-full ${
                    field.is_active
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "bg-gray-400 cursor-not-allowed text-gray-600"
                  }`}
                  disabled={!field.is_active}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleBookingClick(field)
                  }}
                >
                  {field.is_active ? "Booking Sekarang" : "Tidak Tersedia"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
