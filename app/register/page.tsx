"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { MapPin, Eye, EyeOff } from "lucide-react"

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()

  if (formData.password !== formData.confirmPassword) {
    alert("Password tidak cocok!")
    return
  }

  if (!formData.agreeToTerms) {
    alert("Harap setujui syarat dan ketentuan!")
    return
  }

  try {
    const response = await fetch("https://be-sefield.vercel.app/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      alert(data.error || "Terjadi kesalahan saat registrasi.")
      return
    }

    alert("Registrasi berhasil! Silakan login.")
    window.location.href = "/login"
  } catch (error) {
    console.error("Error:", error)
    alert("Terjadi kesalahan jaringan.")
  }
}


  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600">
              <MapPin className="h-7 w-7 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Daftar SeField</CardTitle>
          <CardDescription>Buat akun baru untuk mulai booking lapangan olahraga</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Nama Lengkap</Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                placeholder="Masukkan nama lengkap"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="nama@email.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Nomor Telepon</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="08xxxxxxxxxx"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  placeholder="Minimal 8 karakter"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500" />
                  )}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  placeholder="Ulangi password"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500" />
                  )}
                </Button>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                checked={formData.agreeToTerms}
                onCheckedChange={(checked) => handleInputChange("agreeToTerms", checked as boolean)}
              />
              <Label htmlFor="terms" className="text-sm">
                Saya setuju dengan{" "}
                <Link href="/terms" className="text-blue-600 hover:underline">
                  syarat dan ketentuan
                </Link>
              </Label>
            </div>
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={!formData.agreeToTerms}>
              Daftar Sekarang
            </Button>
          </form>
          <div className="mt-6 text-center text-sm">
            Sudah punya akun?{" "}
            <Link href="/login" className="text-blue-600 hover:underline font-medium">
              Masuk di sini
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
