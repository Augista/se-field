
"use client"

import { AdminHeader } from "@/components/admin/AdminHeader"
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
  description: ""
})

  useEffect(() => {
    fetch("https://be-sefield.vercel.app/api/fields")
      .then(res => res.json())
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
      body: formData
    })

    if (res.ok) {
      alert("Berhasil menambahkan lapangan")
      location.reload()
    }
  }

  return (
    <div>
      <AdminHeader />
      <main className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Manajemen Lapangan</h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 mb-6">
          <input placeholder="Nama Lapangan" onChange={e => setForm({ ...form, name: e.target.value })} />
          <input placeholder="Tipe" onChange={e => setForm({ ...form, type: e.target.value })} />
          <input placeholder="Harga" type="number" onChange={e => setForm({ ...form, price: e.target.value })} />
          <input placeholder="Jam Buka (08:00)" onChange={e => setForm({ ...form, operational_start: e.target.value })} />
          <input placeholder="Jam Tutup (22:00)" onChange={e => setForm({ ...form, operational_end: e.target.value })} />
          <textarea placeholder="Deskripsi" onChange={e => setForm({ ...form, description: e.target.value })}></textarea>
          <input type="file" onChange={e => setForm({ ...form, image: e.target.files?.[0] || null })} />
          <button type="submit" className="bg-green-600 text-white p-2 rounded">Tambah Lapangan</button>
        </form>

        <h3 className="text-xl font-bold mb-2">Lapangan Aktif</h3>
        <ul className="space-y-2">
          {fields.map((f: any) => (
            <li key={f.id} className="p-2 border rounded">
              {f.name} - {f.type} - Rp {f.price}
            </li>
          ))}
        </ul>
      </main>
    </div>
  )
}
