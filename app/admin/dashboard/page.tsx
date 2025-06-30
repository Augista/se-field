"use client"

import { AdminHeader } from "@/components/admin/AdminHeader"
import { IncomeChart } from "@/components/admin/IncomeChart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"
import { TrendingUp, Users, Calendar, DollarSign } from "lucide-react"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value)
}

export default function DashboardPage() {
  const [summary, setSummary] = useState<any>(null)

  useEffect(() => {
    fetch("https://be-sefield.vercel.app/api/admin/summary")
      .then((res) => res.json())
      .then(setSummary)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50/30 to-gray-100/50">
      <AdminHeader />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 max-w-7xl">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h2>
          <p className="text-gray-600">Ringkasan aktivitas dan performa lapangan hari ini</p>
        </div>

        {summary ? (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="shadow-lg border-0 bg-gradient-to-br from-green-500/10 to-green-600/5 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-700 mb-1">Total Pemasukan Hari Ini</p>
                      <p className="text-2xl font-bold text-green-800">{formatRupiah(summary.todayIncome)}</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-500/10 to-blue-600/5 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-700 mb-1">Total Mingguan</p>
                      <p className="text-2xl font-bold text-blue-800">
                        {formatRupiah(summary.weeklyIncome.reduce((acc: number, d: any) => acc + d.total, 0))}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0 bg-gradient-to-br from-purple-500/10 to-purple-600/5 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-purple-700 mb-1">Jumlah User Sewa</p>
                      <p className="text-2xl font-bold text-purple-800">{summary.totalUsers}</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Chart Section */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-indigo-700/10 border-b border-indigo-100">
                <CardTitle className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-indigo-600" />
                  Grafik Pemasukan Mingguan
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="h-80">
                  <IncomeChart weeklyIncome={summary.weeklyIncome} />
                </div>
              </CardContent>
            </Card>

            {/* Occupied Times Section */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-orange-500/10 border-b border-orange-100">
                <CardTitle className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-orange-600" />
                  Jam Terisi per Lapangan
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {summary.occupiedTimes.map((f: any, idx: number) => (
                    <div
                      key={idx}
                      className="p-4 border border-gray-200 rounded-lg bg-gradient-to-r from-gray-50/50 to-white hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                          <h4 className="font-semibold text-gray-900">{f.field}</h4>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {f.bookings.length > 0 ? (
                            f.bookings.map((b: any, bIdx: number) => (
                              <Badge
                                key={bIdx}
                                variant="secondary"
                                className="bg-orange-100 text-orange-800 hover:bg-orange-200"
                              >
                                {b.start} - {b.end}
                              </Badge>
                            ))
                          ) : (
                            <Badge variant="outline" className="text-gray-500 border-gray-300">
                              Kosong
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Today's Bookings Table */}
            <Card className="shadow-lg border-0 bg-white/80 from-emerald-500/10 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-emerald-500/10 border-b border-emerald-500">
                <CardTitle className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                  <Users className="w-5 h-5 text-emerald-600" />
                  Data Penyewa Hari Ini ({summary.todayBookings.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {summary.todayBookings.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                      <Calendar className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500">Belum ada booking hari ini</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Nama</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Lapangan</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Jam</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {summary.todayBookings.map((b: any, i: number) => (
                          <tr
                            key={i}
                            className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-emerald-50/50 hover:to-transparent transition-all duration-200"
                          >
                            <td className="py-3 px-4">
                              <div className="font-medium text-gray-900">{b.user_name}</div>
                            </td>
                            <td className="py-3 px-4">
                              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                                {b.field_name}
                              </Badge>
                            </td>
                            <td className="py-3 px-4">
                              <span className="text-gray-600">{b.time}</span>
                            </td>
                            <td className="py-3 px-4">
                              <span className="font-semibold text-emerald-600">{formatRupiah(b.amount)}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
              <p className="text-gray-600 text-lg">Loading dashboard...</p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
