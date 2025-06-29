"use client"

import { AdminHeader } from "@/components/admin/AdminHeader"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useState, useEffect } from "react"

export default function ManagePage() {
  const [fields, setFields] = useState([])
  const [form, setForm] = useState<{
    name: string
    type: string
    price: string
    operational_start: string
    operational_end: string
    image: File | null
    description: string
  }>({
    name: "",
    type: "",
    price: "",
    operational_start: "",
    operational_end: "",
    image: null,
    description: "",
  })

  useEffect(() => {
    fetch("https://be-sefield.vercel.app/api/fields")
      .then((res) => res.json())
      .then(setFields)
  }, [])

  async function handleSubmit(e: any) {
    e.preventDefault()
    const formData = new FormData()
    for (const key in form) {
      formData.append(key, (form as any)[key])
    }

    const res = await fetch("https://be-sefield.vercel.app/api/fields", {
      method: "POST",
      body: formData,
    })

    if (res.ok) {
      alert("Berhasil menambahkan lapangan")
      location.reload()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50/30 to-gray-100/50">
      <AdminHeader />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 max-w-7xl">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Manajemen Lapangan</h2>
          <p className="text-gray-600">Kelola lapangan olahraga dengan mudah</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-green-500/10 to-green-600/10 border-b border-green-100">
              <CardTitle className="text-xl font-semibold text-gray-800">Tambah Lapangan Baru</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                      Nama Lapangan
                    </Label>
                    <Input
                      id="name"
                      placeholder="Masukkan nama lapangan"
                      className="border-gray-200 focus:border-green-500 focus:ring-green-500/20"
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type" className="text-sm font-medium text-gray-700">
                      Tipe Lapangan
                    </Label>
                    <Input
                      id="type"
                      placeholder="Contoh: Futsal, Badminton"
                      className="border-gray-200 focus:border-green-500 focus:ring-green-500/20"
                      onChange={(e) => setForm({ ...form, type: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price" className="text-sm font-medium text-gray-700">
                    Harga per Jam (Rp)
                  </Label>
                  <Input
                    id="price"
                    placeholder="Masukkan harga (100000 tidak memakai . tapi disambung)"
                    type="number"
                    className="border-gray-200 focus:border-green-500 focus:ring-green-500/20"
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start" className="text-sm font-medium text-gray-700">
                      Jam Buka
                    </Label>
                    <Input
                      id="start"
                      placeholder="08:00"
                      className="border-gray-200 focus:border-green-500 focus:ring-green-500/20"
                      onChange={(e) => setForm({ ...form, operational_start: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end" className="text-sm font-medium text-gray-700">
                      Jam Tutup
                    </Label>
                    <Input
                      id="end"
                      placeholder="22:00"
                      className="border-gray-200 focus:border-green-500 focus:ring-green-500/20"
                      onChange={(e) => setForm({ ...form, operational_end: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                    Deskripsi
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Masukkan deskripsi lapangan"
                    className="border-gray-200 focus:border-green-500 focus:ring-green-500/20 min-h-[100px]"
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image" className="text-sm font-medium text-gray-700">
                    Foto Lapangan
                  </Label>
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    className="border-gray-200 focus:border-green-500 focus:ring-green-500/20 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-green-50 file:text-green-700 hover:file:bg-green-100 text-center"
                    onChange={(e) => setForm({ ...form, image: e.target.files?.[0] || null })}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium py-2.5 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Tambah Lapangan
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Fields List Section */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-blue-500/10 to-blue-600/10 border-b border-blue-100">
              <CardTitle className="text-xl font-semibold text-gray-800">Lapangan Aktif ({fields.length})</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {fields.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-500 text-sm">Belum ada lapangan yang terdaftar</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {fields.map((f: any) => (
                    <div
                      key={f.id}
                      className="p-4 border border-gray-200 rounded-lg bg-gradient-to-r from-gray-50/50 to-white hover:shadow-md transition-all duration-200 hover:border-gray-300"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{f.name}</h4>
                          <p className="text-sm text-gray-600">{f.type}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-600">
                            Rp {Number.parseInt(f.price).toLocaleString("id-ID")}
                          </p>
                          <p className="text-xs text-gray-500">per jam</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
