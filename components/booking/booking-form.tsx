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

const fields = [
  { id: "1", name: "Lapangan Futsal A", price: 150000, type: "Futsal" },
  { id: "2", name: "Lapangan Basket Indoor", price: 200000, type: "Basket" },
  { id: "3", name: "Lapangan Badminton", price: 80000, type: "Badminton" },
  { id: "4", name: "Lapangan Tenis", price: 120000, type: "Tenis" },
]

const allTimeSlots = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
]

interface BookingFormProps {
  onBookingSuccess: (booking: Omit<Booking, "id" | "createdAt">) => void
  existingBookings: Booking[]
  preSelectedField?: PreSelectedField | null
  onClearPreSelection?: () => void
}

export function BookingForm({
  onBookingSuccess,
  existingBookings,
  preSelectedField,
  onClearPreSelection,
}: BookingFormProps) {
  const [selectedField, setSelectedField] = useState("")
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [selectedTime, setSelectedTime] = useState("")
  const [duration, setDuration] = useState("1")
  const [playerName, setPlayerName] = useState("")
  const [playerPhone, setPlayerPhone] = useState("")
  const [playerVirtualAccount, setPlayerVirtualAccount] = useState ("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [conflictError, setConflictError] = useState<string | null>(null)


  // Auto-populate form when field is pre-selected from homepage
  useEffect(() => {
    if (preSelectedField && !selectedField) {
      setSelectedField(preSelectedField.fieldId)
    }
  }, [preSelectedField, selectedField])

  const selectedFieldData = useMemo(() => fields.find((field) => field.id === selectedField), [selectedField])

  const totalPrice = useMemo(
    () => (selectedFieldData ? selectedFieldData.price * Number.parseInt(duration) : 0),
    [selectedFieldData, duration],
  )

  // Get occupied time slots for selected field and date
  const getOccupiedSlots = useCallback(
    (fieldId: string, date: Date) => {
      const dateStr = format(date, "yyyy-MM-dd")
      const occupiedSlots: string[] = []

      existingBookings.forEach((booking) => {
        // Skip cancelled bookings
        if (booking.status === "cancelled") return

        if (booking.fieldId === fieldId && format(booking.date, "yyyy-MM-dd") === dateStr) {
          const startTime = Number.parseInt(booking.time.split(":")[0])

          // Mark all hours covered by this booking as occupied
          for (let i = 0; i < booking.duration; i++) {
            const hour = startTime + i
            if (hour >= 8 && hour <= 21) {
              occupiedSlots.push(`${hour.toString().padStart(2, "0")}:00`)
            }
          }
        }
      })

      return occupiedSlots
    },
    [existingBookings],
  )

  // Calculate available time slots
  const availableTimeSlots = useMemo(() => {
    if (selectedField && selectedDate) {
      const occupiedSlots = getOccupiedSlots(selectedField, selectedDate)
      return allTimeSlots.filter((slot) => !occupiedSlots.includes(slot))
    }
    return allTimeSlots
  }, [selectedField, selectedDate, getOccupiedSlots])

  // Check for booking conflicts
  const checkBookingConflict = useCallback(
    (fieldId: string, date: Date, time: string, bookingDuration: number) => {
      const dateStr = format(date, "yyyy-MM-dd")
      const startTime = Number.parseInt(time.split(":")[0])
      const endTime = startTime + bookingDuration

      // Find conflicting bookings
      const conflicts = existingBookings.filter((booking) => {
        // Skip cancelled bookings
        if (booking.status === "cancelled") return false

        // Check same field and same date
        if (booking.fieldId === fieldId && format(booking.date, "yyyy-MM-dd") === dateStr) {
          const bookingStartTime = Number.parseInt(booking.time.split(":")[0])
          const bookingEndTime = bookingStartTime + booking.duration

          // Check time overlap
          return startTime < bookingEndTime && endTime > bookingStartTime
        }
        return false
      })

      return conflicts
    },
    [existingBookings],
  )

  // Update conflict error when relevant fields change
  useEffect(() => {
    if (selectedField && selectedDate && selectedTime) {
      const conflicts = checkBookingConflict(selectedField, selectedDate, selectedTime, Number.parseInt(duration))

      if (conflicts.length > 0) {
        const conflictBooking = conflicts[0]
        setConflictError(
          `Waktu ${selectedTime} - ${(Number.parseInt(selectedTime.split(":")[0]) + Number.parseInt(duration)).toString().padStart(2, "0")}:00 sudah dibooking oleh ${conflictBooking.playerName} (${conflictBooking.playerPhone})`,
        )
      } else {
        setConflictError(null)
      }
    } else {
      setConflictError(null)
    }
  }, [selectedField, selectedDate, selectedTime, duration, checkBookingConflict])

  // Clear selected time if it becomes unavailable
  useEffect(() => {
    if (selectedTime && !availableTimeSlots.includes(selectedTime)) {
      setSelectedTime("")
    }
  }, [availableTimeSlots, selectedTime])

  const resetForm = useCallback(() => {
    if (!preSelectedField) {
      setSelectedField("")
    }
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

    // Final conflict check before submission
    const conflicts = checkBookingConflict(selectedField, selectedDate, selectedTime, Number.parseInt(duration))
    if (conflicts.length > 0) {
      setConflictError("Terjadi konflik jadwal. Silakan pilih waktu lain.")
      return
    }

    setIsSubmitting(true)

    try {
      // Simulate API call delay

      const endHour = Number.parseInt(selectedTime.split(":")[0]) + Number.parseInt(duration)
      const end_time = `${endHour.toString().padStart(2, "0")}:00`
      const payment_deadline = new Date(Date.now() + 15 * 60 * 1000).toISOString() // 15 menit ke depan


      const response = await fetch (
        "https://be-sefield.vercel.app/api/bookings",
        {
          method: "POST",
          headers: {
            "Content-Type" : "application/json",
          },
          body: JSON.stringify({
            field_id: selectedField,
            booking_date: selectedDate,
            start_time: selectedTime,
            end_time,
            total_price: totalPrice,
            payment_deadline,
            user_name: playerName,
            user_phone: playerPhone,
            notes: "",
          })
        }
      )
      const data = await response.json()

      await new Promise((resolve) => setTimeout(resolve, 1500))

      const newBooking: Omit<Booking, "id" | "createdAt"> = {
        fieldName: selectedFieldData.name,
        fieldId: selectedField,
        date: selectedDate,
        time: selectedTime,
        duration: Number.parseInt(duration),
        status: "pending",
        totalPrice,
        paymentStatus: "pending",
        playerName,
        playerPhone,
        playerVirtualAccount: Number.parseInt(playerVirtualAccount),
      }

      onBookingSuccess(newBooking)
      setShowSuccess(true)

      // Clear pre-selection after successful booking
      if (onClearPreSelection) {
        onClearPreSelection()
      }

      // Reset form after success
      setTimeout(() => {
        setShowSuccess(false)
        resetForm()
      }, 2000)
    } catch (error) {
      console.error("Booking error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const occupiedSlots = useMemo(() => {
    return selectedField && selectedDate ? getOccupiedSlots(selectedField, selectedDate) : []
  }, [selectedField, selectedDate, getOccupiedSlots])

  if (showSuccess) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mb-6">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Booking Berhasil!</h3>
          <p className="text-gray-600 mb-4">
            Booking Anda telah berhasil dibuat. Silakan lakukan pembayaran dalam 15 menit.
          </p>
          <p className="text-sm text-gray-500">
            Anda akan dialihkan ke tab "Booking Saya" untuk melihat detail booking...
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-blue-600" />
          Form Booking Lapangan
          {preSelectedField && (
            <div className="flex items-center gap-1 ml-2">
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
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
            {/* Field Selection */}
            <div className="space-y-2">
              <Label htmlFor="field">Pilih Lapangan</Label>
              <Select value={selectedField} onValueChange={setSelectedField} disabled={!!preSelectedField}>
                <SelectTrigger className={preSelectedField ? "bg-blue-50 border-blue-200" : ""}>
                  <SelectValue placeholder="Pilih lapangan" />
                </SelectTrigger>
                <SelectContent>
                  {fields.map((field) => (
                    <SelectItem key={field.id} value={field.id}>
                      {field.name} - Rp {field.price.toLocaleString()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {preSelectedField && (
                <p className="text-xs text-blue-600">✓ Lapangan sudah dipilih dari halaman beranda</p>
              )}
            </div>

            {/* Date Selection */}
            <div className="space-y-2">
              <Label>Tanggal</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP", { locale: id }) : "Pilih tanggal"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Time Selection */}
            <div className="space-y-2">
              <Label htmlFor="time">Waktu Mulai</Label>
              <Select value={selectedTime} onValueChange={setSelectedTime}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih waktu" />
                </SelectTrigger>
                <SelectContent>
                  {availableTimeSlots.length > 0 ? (
                    availableTimeSlots.map((time) => (
                      <SelectItem key={time} value={time}>
                        <div className="flex items-center justify-between w-full">
                          <span>{time}</span>
                          <span className="text-green-600 text-xs ml-2">✓ Tersedia</span>
                        </div>
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="" disabled>
                      Semua slot sudah terisi
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>

              {/* Show occupied slots info */}
              {selectedField && selectedDate && (
                <div className="text-sm text-gray-500">
                  {occupiedSlots.length > 0 ? (
                    <div className="bg-red-50 p-2 rounded text-red-700">
                      <p className="font-medium">Slot yang sudah terisi:</p>
                      <p>{occupiedSlots.join(", ")}</p>
                    </div>
                  ) : (
                    <div className="bg-green-50 p-2 rounded text-green-700">
                      <p>✓ Semua slot tersedia untuk tanggal ini</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <Label htmlFor="duration">Durasi (Jam)</Label>
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih durasi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Jam</SelectItem>
                  <SelectItem value="2">2 Jam</SelectItem>
                  <SelectItem value="3">3 Jam</SelectItem>
                  <SelectItem value="4">4 Jam</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Player Name */}
            <div className="space-y-2">
              <Label htmlFor="playerName">Nama Pemesan</Label>
              <Input
                id="playerName"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Masukkan nama lengkap"
                required
              />
            </div>

            {/* Player Phone */}
            <div className="space-y-2">
              <Label htmlFor="playerPhone">Nomor Telepon</Label>
              <Input
                id="playerPhone"
                value={playerPhone}
                onChange={(e) => setPlayerPhone(e.target.value)}
                placeholder="Masukkan nomor telepon"
                required
              />
            </div>
     

           <div className="space-y-2">
              <Label htmlFor="playerVirtualAccount">Virtual Account payment</Label>
              <Input
                id="playerPhone"
                value={playerVirtualAccount}
                onChange={(e) => setPlayerVirtualAccount(e.target.value)}
                placeholder="Masukkan nomor bank virtual account"
                required
              />
            </div>
          </div>

          {/* Conflict Error Alert */}
          {conflictError && (
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                <div className="flex items-center justify-between">
                  <span>{conflictError}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setConflictError(null)}
                    className="h-auto p-1 text-red-600 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Price Summary */}
          {selectedFieldData && (
            <div
              className={`rounded-lg p-4 ${preSelectedField ? "bg-green-50 border border-green-200" : "bg-blue-50"}`}
            >
              <h3 className={`font-semibold ${preSelectedField ? "text-green-900" : "text-blue-900"}`}>
                Ringkasan Booking
              </h3>
              <div className={`mt-2 space-y-1 text-sm ${preSelectedField ? "text-green-800" : "text-blue-800"}`}>
                <p>Lapangan: {selectedFieldData.name}</p>
                <p>Harga per jam: Rp {selectedFieldData.price.toLocaleString()}</p>
                <p>Durasi: {duration} jam</p>
                {selectedDate && selectedTime && (
                  <p>
                    Jadwal: {format(selectedDate, "PPP", { locale: id })} pukul {selectedTime} -{" "}
                    {(Number.parseInt(selectedTime.split(":")[0]) + Number.parseInt(duration))
                      .toString()
                      .padStart(2, "0")}
                    :00
                  </p>
                )}
                <p className="font-semibold">Total: Rp {totalPrice.toLocaleString()}</p>
              </div>
            </div>
          )}

          {/* Business Rules Info */}
          <div className="rounded-lg bg-yellow-50 p-4">
            <h3 className="font-semibold text-yellow-900">Ketentuan Booking</h3>
            <ul className="mt-2 space-y-1 text-sm text-yellow-800">
              <li>• Pembayaran harus diselesaikan dalam 15 menit setelah booking</li>
              <li>• Pembatalan dapat dilakukan maksimal 12 jam sebelum jadwal</li>
              <li>• Reschedule dapat dilakukan maksimal 12 jam sebelum jadwal</li>
              <li>• Lapangan hanya dapat digunakan sesuai jam operasional</li>
              <li>• Satu lapangan hanya bisa digunakan oleh satu pengguna dalam waktu yang sama</li>
            </ul>
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={
              !selectedField ||
              !selectedDate ||
              !selectedTime ||
              !playerName ||
              !playerPhone ||
              !playerVirtualAccount ||
              isSubmitting ||
              !!conflictError
            }
          >
            <Clock className="mr-2 h-4 w-4" />
            {isSubmitting ? "Memproses Booking..." : "Booking Sekarang"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
