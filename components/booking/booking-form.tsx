"use client"

import type React from "react"
import { useState, useEffect, useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CalendarIcon, Clock, MapPin, CheckCircle, AlertTriangle, X, Star } from "lucide-react"
import { format } from "date-fns"
import { id } from "date-fns/locale"

import type { Booking, PreSelectedField } from "@/app/booking/page"

interface FieldData {
  id: string
  name: string
  type: string
  price: number
  image?: string
}

export function BookingForm({
  onBookingSuccess,
  existingBookings,
  preSelectedField,
  onClearPreSelection,
}: {
  onBookingSuccess: (booking: Omit<Booking, "id" | "createdAt">) => void
  existingBookings: Booking[]
  preSelectedField?: PreSelectedField | null
  onClearPreSelection?: () => void
}) {
  const [fields, setFields] = useState<FieldData[]>([])
  const [selectedField, setSelectedField] = useState("")
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [selectedTime, setSelectedTime] = useState("")
  const [duration, setDuration] = useState("1")
  const [playerName, setPlayerName] = useState("")
  const [playerPhone, setPlayerPhone] = useState("")
  const [playerVirtualAccount, setPlayerVirtualAccount] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [conflictError, setConflictError] = useState<string | null>(null)

  // Fetch fields from backend
  useEffect(() => {
    async function fetchFields() {
      try {
        const res = await fetch("https:be-sefield.vercel.app/api/fields", { credentials: "include" })
        const data = await res.json()
        if (Array.isArray(data)) setFields(data)
        else console.error("Invalid fields data:", data)
      } catch (err) {
        console.error("Failed to fetch fields", err)
      }
    }
    fetchFields()
  }, [])

  // Auto populate if from preSelection
  useEffect(() => {
    if (preSelectedField && !selectedField) {
      setSelectedField(preSelectedField.fieldId)
    }
  }, [preSelectedField, selectedField])

  const selectedFieldData = useMemo(() => fields.find(f => f.id === selectedField), [fields, selectedField])
  const totalPrice = useMemo(() => selectedFieldData ? selectedFieldData.price * parseInt(duration) : 0, [selectedFieldData, duration])

  const allTimeSlots = ["08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00","21:00"]

  const getOccupiedSlots = useCallback((fieldId: string, date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd")
    const occupied: string[] = []

    existingBookings.forEach(b => {
      if (b.status === "cancelled") return
      if (b.fieldId === fieldId && format(b.date, "yyyy-MM-dd") === dateStr) {
        const start = parseInt(b.time.split(":")[0])
        for (let i = 0; i < b.duration; i++) {
          const hour = start + i
          occupied.push(`${hour.toString().padStart(2, "0")}:00`)
        }
      }
    })

    return occupied
  }, [existingBookings])

  const availableTimeSlots = useMemo(() => {
    if (selectedField && selectedDate) {
      const occupied = getOccupiedSlots(selectedField, selectedDate)
      return allTimeSlots.filter(slot => !occupied.includes(slot))
    }
    return allTimeSlots
  }, [selectedField, selectedDate, getOccupiedSlots])

  const checkBookingConflict = useCallback((fieldId: string, date: Date, time: string, dur: number) => {
    const dateStr = format(date, "yyyy-MM-dd")
    const start = parseInt(time.split(":")[0])
    const end = start + dur

    return existingBookings.filter(b => {
      if (b.status === "cancelled") return false
      if (b.fieldId === fieldId && format(b.date, "yyyy-MM-dd") === dateStr) {
        const bs = parseInt(b.time.split(":")[0]), be = bs + b.duration
        return start < be && end > bs
      }
      return false
    })
  }, [existingBookings])

  useEffect(() => {
    if (selectedField && selectedDate && selectedTime) {
      const conflicts = checkBookingConflict(selectedField, selectedDate, selectedTime, parseInt(duration))
      if (conflicts.length > 0) {
        const c = conflicts[0]
        setConflictError(`Waktu ${selectedTime} - ${(parseInt(selectedTime.split(":")[0])+parseInt(duration)).toString().padStart(2,"0")}:00 sudah dibooking oleh ${c.playerName} (${c.playerPhone})`)
      } else setConflictError(null)
    }
  }, [selectedField, selectedDate, selectedTime, duration, checkBookingConflict])

  useEffect(() => {
    if (selectedTime && !availableTimeSlots.includes(selectedTime)) {
      setSelectedTime("")
    }
  }, [availableTimeSlots, selectedTime])

  const resetForm = useCallback(() => {
    if (!preSelectedField) setSelectedField("")
    setSelectedDate(undefined)
    setSelectedTime("")
    setDuration("1")
    setPlayerName("")
    setPlayerPhone("")
    setPlayerVirtualAccount("")
    setConflictError(null)
  }, [preSelectedField])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedFieldData || !selectedDate) return

    const conflicts = checkBookingConflict(selectedField, selectedDate, selectedTime, parseInt(duration))
    if (conflicts.length > 0) {
      setConflictError("Terjadi konflik jadwal. Silakan pilih waktu lain.")
      return
    }

    if (isNaN(Number(playerVirtualAccount))) {
      alert("Virtual account harus angka!")
      return
    }

    setIsSubmitting(true)
    try {
      const sh = parseInt(selectedTime.split(":")[0])
      const endHour = sh + parseInt(duration)
      const end_time = `${endHour.toString().padStart(2, "0")}:00`
      const payment_deadline = new Date(Date.now() + 15*60*1000).toISOString()

      const body = {
        field_id: selectedField,
        user_name: playerName,
        user_phone: playerPhone,
        booking_date: selectedDate.toISOString().substring(0,10),
        start_time: selectedTime,
        end_time,
        duration_hour: parseInt(duration),
        total_price: totalPrice,
        virtual_account: playerVirtualAccount,
        payment_deadline,
      }

      const res = await fetch("https://be-sefield.vercel.app/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) {
        alert("Booking gagal: "+(data.error||""))
        return
      }

      onBookingSuccess({
        fieldName: selectedFieldData.name,
        fieldId: selectedField,
        date: selectedDate,
        time: selectedTime,
        duration: parseInt(duration),
        status: "pending",
        totalPrice,
        paymentStatus: "pending",
        playerName,
        playerPhone,
        playerVirtualAccount: Number(playerVirtualAccount),
      })
      setShowSuccess(true)
      onClearPreSelection?.()

      setTimeout(() => {
        setShowSuccess(false)
        resetForm()
      }, 2000)
    } catch (err) {
      console.error(err)
      alert("Booking error")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (showSuccess) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mb-6">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Booking Berhasil!</h3>
          <p>Silakan lakukan pembayaran dalam 15 menit.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-blue-600"/> Form Booking Lapangan
          {preSelectedField && (
            <div className="flex items-center gap-1 ml-2">
              <Star className="h-4 w-4 text-yellow-500 fill-current"/>
              <span className="text-sm text-yellow-600">Dipilih dari beranda</span>
            </div>
          )}
        </CardTitle>
        <CardDescription>
          {preSelectedField
            ? `Lengkapi form booking untuk ${preSelectedField.fieldName}`
            : "Isi form di bawah untuk melakukan booking lapangan"}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            {/* Select Field */}
            <div className="space-y-2">
              <Label>Pilih Lapangan</Label>
              <Select value={selectedField} onValueChange={setSelectedField} disabled={!!preSelectedField}>
                <SelectTrigger className={preSelectedField ? "bg-blue-50 border-blue-200" : ""}>
                  <SelectValue placeholder="Pilih lapangan"/>
                </SelectTrigger>
                <SelectContent>
                  {fields.map(f => (
                    <SelectItem key={f.id} value={f.id}>
                      {f.name} - Rp {f.price.toLocaleString()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {preSelectedField && <p className="text-xs text-blue-600">✓ Sudah dipilih dari beranda</p>}
            </div>

            {/* Date Picker */}
            <div className="space-y-2">
              <Label>Tanggal</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4"/>
                    {selectedDate ? format(selectedDate, "PPP", { locale: id }) : "Pilih tanggal"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(d) => d < new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Time */}
            <div className="space-y-2">
              <Label>Waktu Mulai</Label>
              <Select value={selectedTime} onValueChange={setSelectedTime}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih waktu"/>
                </SelectTrigger>
                <SelectContent>
                  {availableTimeSlots.length > 0
                    ? availableTimeSlots.map(t => (
                        <SelectItem key={t} value={t}>
                          <div className="flex justify-between">{t}<span className="text-green-600 text-xs">✓</span></div>
                        </SelectItem>
                      ))
                    : <SelectItem value="" disabled>Semua slot terisi</SelectItem>}
                </SelectContent>
              </Select>
              {selectedField && selectedDate && (() => {
                const occupied = getOccupiedSlots(selectedField, selectedDate);
                return occupied.length > 0 ? (
                  <div className="bg-red-50 p-2 rounded text-red-700 text-sm">
                    <strong>Slot sudah terisi:</strong> {occupied.join(", ")}
                  </div>
                ) : (
                  <div className="bg-green-50 p-2 rounded text-green-700 text-sm">
                    ✓ Semua slot tersedia
                  </div>
                );
              })()}
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <Label>Durasi (Jam)</Label>
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger><SelectValue placeholder="Durasi"/></SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Jam</SelectItem>
                  <SelectItem value="2">2 Jam</SelectItem>
                  <SelectItem value="3">3 Jam</SelectItem>
                  <SelectItem value="4">4 Jam</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Player details */}
            <div className="space-y-2">
              <Label>Nama Pemesan</Label>
              <Input value={playerName} onChange={e => setPlayerName(e.target.value)} required/>
            </div>
            <div className="space-y-2">
              <Label>Nomor Telepon</Label>
              <Input value={playerPhone} onChange={e => setPlayerPhone(e.target.value)} required/>
            </div>
            <div className="space-y-2">
              <Label>Virtual Account</Label>
              <Input value={playerVirtualAccount} onChange={e => setPlayerVirtualAccount(e.target.value)} required/>
            </div>
          </div>

          {conflictError && (
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600"/>
              <AlertDescription className="text-red-800 flex justify-between">
                <span>{conflictError}</span>
                <Button variant="ghost" size="sm" onClick={() => setConflictError(null)}><X/></Button>
              </AlertDescription>
            </Alert>
          )}

          {selectedFieldData && (
            <div className={`rounded-lg p-4 ${preSelectedField ? "bg-green-50 border-green-200" : "bg-blue-50"}`}>
              <h3 className={`font-semibold ${preSelectedField ? "text-green-900" : "text-blue-900"}`}>Ringkasan Booking</h3>
              <div className={`mt-2 text-sm ${preSelectedField ? "text-green-800" : "text-blue-800"}`}>
                <p>Lapangan: {selectedFieldData.name}</p>
                <p>Jenis: {selectedFieldData.type}</p>
                <p>Harga/jam: Rp {selectedFieldData.price.toLocaleString()}</p>
                {selectedDate && selectedTime && (
                  <p>Jadwal: {format(selectedDate, "PPP", { locale: id })} pukul {selectedTime} - {(parseInt(selectedTime.split(":")[0])+parseInt(duration)).toString().padStart(2,"0")}:00</p>
                )}
                <p className="font-semibold">Total: Rp {totalPrice.toLocaleString()}</p>
              </div>
            </div>
          )}

          <div className="rounded-lg bg-yellow-50 p-4 text-sm text-yellow-800">
            <h3 className="font-semibold text-yellow-900">Ketentuan Booking</h3>
            <ul className="list-disc ml-4 mt-2 space-y-1">
              <li>Pembayaran harus diselesaikan dalam 15 menit setelah booking</li>
              <li>Pembatalan maksimum 12 jam sebelum jadwal</li>
              <li>Reschedule maksimum 12 jam sebelum jadwal</li>
              <li>Lapangan hanya bisa digunakan satu pengguna per waktu</li>
            </ul>
          </div>

          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={
              !selectedField ||
              !selectedDate ||
              !selectedTime ||
              !playerName ||
              !playerPhone ||
              !playerVirtualAccount ||
              isSubmitting ||
              !!conflictError
            }>
            <Clock className="mr-2 h-4 w-4"/>
            {isSubmitting ? "Memproses..." : "Booking Sekarang"}
          </Button>

        </form>
      </CardContent>
    </Card>
  )
}
