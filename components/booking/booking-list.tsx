"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Calendar, Clock, MapPin, RefreshCw, X, User, Phone,Wallet, CheckCircle } from "lucide-react"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import type { Booking } from "@/app/booking/page"
import { RescheduleDialog } from "./reschedule-dialog"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMoneyBillWave, faRupiahSign } from "@fortawesome/free-solid-svg-icons"

interface BookingListProps {
  bookings: Booking[]
  onSuccessUpdate: () => void 
}

async function postToAPI(url: string, body: any) {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${document.cookie
        .split("; ")
        .find((row) => row.startsWith("authToken="))
        ?.split("=")[1]}`,
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || "Gagal update booking")
  }

  return await res.json()
}


export function BookingList({ bookings, onSuccessUpdate }: BookingListProps) {
  const [rescheduleBooking, setRescheduleBooking] = useState<Booking | null>(null)
  const [showRescheduleSuccess, setShowRescheduleSuccess] = useState<string | null>(null)


  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-500 hover:bg-green-600">Dikonfirmasi</Badge>
      case "pending":
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Menunggu Pembayaran</Badge>
      case "completed":
        return <Badge className="bg-blue-500 hover:bg-blue-600">Selesai</Badge>
      case "cancelled":
        return <Badge className="bg-red-500 hover:bg-red-600">Dibatalkan</Badge>
      case "rescheduled":
        return <Badge className="bg-purple-500 hover:bg-purple-600">Dijadwal Ulang</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const canCancel = (booking: Booking) => {
    const bookingDateTime = new Date(booking.date)
    bookingDateTime.setHours(Number.parseInt(booking.time.split(":")[0]))
    const now = new Date()
    const hoursDiff = (bookingDateTime.getTime() - now.getTime()) / (1000 * 60 * 60)
    return hoursDiff > 12 && booking.status !== "completed" && booking.status !== "cancelled"
  }

  const canReschedule = (booking: Booking) => {
    const bookingDateTime = new Date(booking.date)
    bookingDateTime.setHours(Number.parseInt(booking.time.split(":")[0]))
    const now = new Date()
    const hoursDiff = (bookingDateTime.getTime() - now.getTime()) / (1000 * 60 * 60)

    return (
      hoursDiff > 12 &&
      booking.paymentStatus === "paid" &&
      booking.status === "confirmed" &&
      !booking.hasBeenRescheduled
    )
  }

  const handleCancel = async (booking : Booking) => {
  try {
    await postToAPI("https://be-sefield.vercel.app/api/bookings/cancel", { booking : id })
    onSuccessUpdate()
  } catch (err) {
    alert("Gagal membatalkan booking")
    console.error(err)
  }
}

const handlePayment = async (booking : Booking) => {
  try {
    const res = await fetch("https://be-sefield.vercel.app/api/bookings/payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${document.cookie
          .split("; ")
          .find((row) => row.startsWith("authToken="))
          ?.split("=")[1]}`,
      },
      body: JSON.stringify({ booking_id: id, gross_amount: booking.totalPrice })

    })

    const data = await res.json()

    if (!data.token) throw new Error("Token pembayaran tidak ditemukan")

    window.snap.pay(data.token, {
      onSuccess: () => {
        alert("Pembayaran berhasil!")
        onSuccessUpdate()
      },
      onPending: () => {
        alert("Menunggu pembayaran...")
      },
      onError: () => {
        alert("Pembayaran gagal.")
      },
    })
  } catch (err) {
    console.error(err)
    alert("Gagal memproses pembayaran")
  }
}
  const handleReschedule = async (bookingId: string, newDate: Date, newTime: string) => {
  try {
    await postToAPI("https://be-sefield.vercel.app/api/bookings/reschedule", {
      bookingId,
      newDate,
      newTime,
    })
    setShowRescheduleSuccess(bookingId)
    setTimeout(() => setShowRescheduleSuccess(null), 3000)
    onSuccessUpdate()
  } catch (err) {
    alert("Gagal melakukan reschedule")
    console.error(err)
  }
  }

   const getTimeRemaining = (booking: Booking) => {
    if (booking.paymentStatus === "paid" || booking.status === "cancelled") return null

    const createdTime = new Date(booking.createdAt).getTime()
    const now = new Date().getTime()
    const elapsed = now - createdTime
    const remaining = 15 * 60 * 1000 - elapsed

    if (remaining <= 0) return null

    const minutes = Math.floor(remaining / (60 * 1000))
    const seconds = Math.floor((remaining % (60 * 1000)) / 1000)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Booking Saya</h2>
        <p className="mt-2 text-gray-600">Kelola semua booking lapangan Anda</p>
      </div>

      {bookings.length === 0 ? ( 
        <Card>
          <CardContent className="py-12 text-center">
            <Calendar className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-semibold text-gray-900">Belum ada booking</h3>
            <p className="mt-2 text-gray-600">Mulai booking lapangan untuk melihat daftar booking Anda</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {bookings.map((booking) => {
            const timeRemaining = getTimeRemaining(booking)
            const isRescheduleSuccess = showRescheduleSuccess === booking.id

            return (
              <Card key={booking.id} className="relative">
                {timeRemaining && (
                  <div className="absolute top-2 right-2 bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-medium">
                    Bayar dalam: {timeRemaining}
                  </div>
                )}

                {isRescheduleSuccess && (
                  <div className="absolute top-2 right-2 bg-green-100 text-green-800 px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Reschedule berhasil!
                  </div>
                )}

                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-blue-600" />
                        {booking.fieldName}
                        {booking.hasBeenRescheduled && (
                          <Badge variant="outline" className="text-xs">
                            Dijadwal Ulang
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription className="mt-1">Booking ID: #{booking.id}</CardDescription>
                    </div>
                    {getStatusBadge(booking.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{format(booking.date, "PPP", { locale: id })}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">
                        {booking.time} ({booking.duration} jam)
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FontAwesomeIcon icon={faRupiahSign} className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{booking.totalPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{booking.playerName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{booking.playerPhone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Wallet className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{booking.playerVirtualAccount}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={booking.paymentStatus === "paid" ? "default" : "destructive"}
                        className={booking.paymentStatus === "paid" ? "bg-green-500" : ""}
                      >
                        {booking.paymentStatus === "paid" ? "Lunas" : "Belum Bayar"}
                      </Badge>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {booking.paymentStatus === "pending" && booking.status === "pending" && (
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => handlePayment(booking)}
                      >
                        <FontAwesomeIcon icon={faMoneyBillWave} className="h-4 w-4 text-white" />
                        Bayar Sekarang
                      </Button>
                    )}

                    {canReschedule(booking) && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setRescheduleBooking(booking)}
                        className="text-blue-600 hover:text-blue-700 border-blue-300"
                      >
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Reschedule
                      </Button>
                    )}

                    {canCancel(booking) && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                            <X className="mr-2 h-4 w-4" />
                            Batalkan
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Batalkan Booking?</AlertDialogTitle>
                        <AlertDialogDescription>
                          {booking.paymentStatus === "paid"
                            ? `Apakah Anda yakin ingin membatalkan booking ini? Tindakan ini akan me-refund pembayaran Anda karena sudah lunas, dengan potongan 5% dari total pelunasan. Total refund: Rp${Math.round(booking.totalPrice * 0.95).toLocaleString("id-ID")}`
                            : `Apakah Anda yakin ingin membatalkan booking ini?`}
                        </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleCancel(booking)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Ya, Batalkan
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>

                  {booking.status === "pending" && booking.paymentStatus === "pending" && (
                    <div className="mt-3 p-3 bg-yellow-50 rounded-lg">
                      <p className="text-sm text-yellow-800">
                        ⚠️ Booking akan otomatis dibatalkan jika pembayaran tidak diselesaikan dalam 15 menit.
                      </p>
                    </div>
                  )}

                  {booking.hasBeenRescheduled && (
                    <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800">
                         Booking ini telah dijadwal ulang. Reschedule lebih lanjut tidak diperbolehkan.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Reschedule Dialog */}
      {rescheduleBooking && (
        <RescheduleDialog
          booking={rescheduleBooking}
          isOpen={!!rescheduleBooking}
          onClose={() => setRescheduleBooking(null)}
          onReschedule={handleReschedule}
          existingBookings={bookings}
        />
      )}
    </div>
  )
}
