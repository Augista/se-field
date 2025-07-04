"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Clock, AlertTriangle, ArrowRight, ArrowLeft, CheckCircle, CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import type { Booking } from "@/app/booking/page"

const timeSlots = [
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

interface RescheduleDialogProps {
  booking: Booking
  isOpen: boolean
  onClose: () => void
  onReschedule: (bookingId: string, newDate: Date, newTime: string) => void
  existingBookings: Booking[]
}

export function RescheduleDialog({ booking, isOpen, onClose, onReschedule, existingBookings }: RescheduleDialogProps) {
  const [currentSection, setCurrentSection] = useState<1 | 2>(1)
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [selectedTime, setSelectedTime] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [availableSlots, setAvailableSlots] = useState<string[]>([])

  // Get occupied slots for selected date and field (excluding current booking)
  const getOccupiedSlots = (date: Date, fieldId: string) => {
    const dateStr = format(date, "yyyy-MM-dd")
    const occupiedSlots: string[] = []

    existingBookings.forEach((existingBooking) => {
      // Skip the current booking being rescheduled and cancelled bookings
      if (existingBooking.id === booking.id || existingBooking.status === "cancelled") return

      if (existingBooking.fieldId === fieldId && format(existingBooking.date, "yyyy-MM-dd") === dateStr) {
        const startTime = Number.parseInt(existingBooking.time.split(":")[0])

        // Mark all hours covered by this booking as occupied
        for (let i = 0; i < existingBooking.duration; i++) {
          const hour = startTime + i
          if (hour >= 8 && hour <= 21) {
            occupiedSlots.push(`${hour.toString().padStart(2, "0")}:00`)
          }
        }
      }
    })

    return occupiedSlots
  }

  // Update available slots when date changes
  useEffect(() => {
    if (selectedDate) {
      const occupiedSlots = getOccupiedSlots(selectedDate, booking.fieldId)
      const available = timeSlots.filter((slot) => !occupiedSlots.includes(slot))
      setAvailableSlots(available)

      // Clear selected time if it's no longer available
      if (selectedTime && occupiedSlots.includes(selectedTime)) {
        setSelectedTime("")
      }
    } else {
      setAvailableSlots(timeSlots)
    }
  }, [selectedDate, booking.fieldId, existingBookings])

  const canProceedToSection2 = selectedDate && selectedTime

  const handleNext = () => {
    if (canProceedToSection2) {
      setCurrentSection(2)
    }
  }

  const handleBack = () => {
    setCurrentSection(1)
  }

  const handleReschedule = async () => {
    if (!selectedDate || !selectedTime) return

    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    onReschedule(booking.id, selectedDate, selectedTime)
    setIsSubmitting(false)

    // Reset form and close dialog
    resetForm()
    onClose()
  }

  const resetForm = () => {
    setCurrentSection(1)
    setSelectedDate(undefined)
    setSelectedTime("")
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const occupiedSlots = selectedDate ? getOccupiedSlots(selectedDate, booking.fieldId) : []

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-600" />
            Reschedule Booking
          </DialogTitle>
          <DialogDescription>
            {currentSection === 1
              ? "Pilih tanggal dan waktu baru untuk booking Anda"
              : "Tinjau dan konfirmasi perubahan jadwal booking"}
          </DialogDescription>
        </DialogHeader>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center space-x-4 mb-6">
          <div className={`flex items-center space-x-2 ${currentSection === 1 ? "text-blue-600" : "text-green-600"}`}>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentSection === 1 ? "bg-blue-100 text-blue-600" : "bg-green-100 text-green-600"
              }`}
            >
              {currentSection === 1 ? "1" : <CheckCircle className="h-4 w-4" />}
            </div>
            <span className="text-sm font-medium">Pilih Jadwal</span>
          </div>
          <div className={`w-8 h-0.5 ${currentSection === 2 ? "bg-blue-600" : "bg-gray-300"}`} />
          <div className={`flex items-center space-x-2 ${currentSection === 2 ? "text-blue-600" : "text-gray-400"}`}>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentSection === 2 ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-400"
              }`}
            >
              2
            </div>
            <span className="text-sm font-medium">Konfirmasi</span>
          </div>
        </div>

        {/* Section 1: Select New Schedule */}
        {currentSection === 1 && (
          <div className="space-y-6">
            {/* Current Booking Info */}
            <div className="rounded-lg bg-gray-50 p-4">
              <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                Booking Saat Ini
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">Lapangan:</span>
                    <span className="font-medium text-gray-900">{booking.fieldName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">Tanggal:</span>
                    <span className="font-medium text-gray-900">{format(booking.date, "PPP", { locale: id })}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">Waktu:</span>
                    <span className="font-medium text-gray-900">
                      {booking.time} ({booking.duration} jam)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">Total:</span>
                    <span className="font-medium text-gray-900">Rp {booking.totalPrice.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* New Schedule Selection */}
            <div className="space-y-6">
              <h4 className="font-medium text-gray-900 flex items-center gap-2">
                <ArrowRight className="h-4 w-4 text-blue-600" />
                Pilih Jadwal Baru
              </h4>

              {/* Date Selection */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Tanggal Baru</Label>
                <div className="flex justify-center">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => {
                      const today = new Date()
                      today.setHours(0, 0, 0, 0)
                      return date < today
                    }}
                    className="rounded-md border"
                  />
                </div>
              </div>

              {/* Time Selection */}
              {selectedDate && (
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Waktu Baru</Label>
                  <Select value={selectedTime} onValueChange={setSelectedTime}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih waktu yang tersedia" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableSlots.length > 0 ? (
                        availableSlots.map((time) => (
                          <SelectItem key={time} value={time}>
                            <div className="flex items-center justify-between w-full">
                              <span>{time}</span>
                              <span className="text-green-600 text-xs ml-2">✓ Tersedia</span>
                            </div>
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="" disabled>
                          Tidak ada slot tersedia
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>

                  {occupiedSlots.length > 0 && (
                    <div className="text-sm text-gray-500 bg-red-50 p-3 rounded-lg">
                      <p className="font-medium mb-1 text-red-800">Slot yang sudah terisi:</p>
                      <p className="text-red-700">{occupiedSlots.join(", ")}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Section 1 Footer */}
            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={handleClose}>
                Batal
              </Button>
              <Button onClick={handleNext} disabled={!canProceedToSection2} className="bg-blue-600 hover:bg-blue-700">
                Lanjut
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Section 2: Confirmation */}
        {currentSection === 2 && selectedDate && selectedTime && (
          <div className="space-y-6">
            {/* Schedule Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Current Schedule */}
              <div className="rounded-lg border-2 border-gray-200 p-4">
                <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  Jadwal Lama
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Tanggal:</span>
                    <span className="font-medium">{format(booking.date, "dd/MM/yyyy", { locale: id })}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Waktu:</span>
                    <span className="font-medium">{booking.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Durasi:</span>
                    <span className="font-medium">{booking.duration} jam</span>
                  </div>
                </div>
              </div>

              {/* New Schedule */}
              <div className="rounded-lg border-2 border-blue-200 bg-blue-50 p-4">
                <h4 className="font-medium text-blue-900 mb-3 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-blue-600" />
                  Jadwal Baru
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-blue-700">Tanggal:</span>
                    <span className="font-medium text-blue-900">
                      {format(selectedDate, "dd/MM/yyyy", { locale: id })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Waktu:</span>
                    <span className="font-medium text-blue-900">{selectedTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Durasi:</span>
                    <span className="font-medium text-blue-900">{booking.duration} jam</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Details */}
            <div className="rounded-lg bg-gray-50 p-4">
              <h4 className="font-medium text-gray-900 mb-3">Detail Booking</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Lapangan:</span>
                    <span className="font-medium">{booking.fieldName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Pemesan:</span>
                    <span className="font-medium">{booking.playerName}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Total Biaya:</span>
                    <span className="font-medium text-green-600">Rp {booking.totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Status:</span>
                    <span className="font-medium text-green-600">Sudah Dibayar</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-4">
              <div className="flex gap-3">
                <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-yellow-800 mb-2">Ketentuan Reschedule:</p>
                  <ul className="text-yellow-700 space-y-1">
                    <li>• Reschedule hanya bisa dilakukan maksimal 12 jam sebelum jadwal asli</li>
                    <li>• Tidak ada biaya tambahan untuk reschedule</li>
                    <li>• Reschedule hanya bisa dilakukan 1 kali per booking</li>
                    <li>• Setelah reschedule, booking tidak dapat diubah lagi</li>
                    <li>• Jadwal baru tidak boleh bentrok dengan booking lain</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Section 2 Footer */}
            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={handleBack}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Kembali
              </Button>
              <Button onClick={handleReschedule} disabled={isSubmitting} className="bg-green-600 hover:bg-green-700">
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Memproses...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Konfirmasi Reschedule
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
