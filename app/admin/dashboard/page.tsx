"use client"

import { AdminHeader } from "@/components/admin/AdminHeader"
import { IncomeChart } from "@/components/admin/IncomeChart"
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
    <div>
      <AdminHeader />
      <main className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Dashboard</h2>

        {summary ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white p-4 shadow rounded">
                <p className="font-semibold">Total Pemasukan Hari Ini</p>
                <p className="text-lg">{formatRupiah(summary.todayIncome)}</p>
              </div>
              <div className="bg-white p-4 shadow rounded">
                <p className="font-semibold">Total Mingguan</p>
                <p className="text-lg">
                  {formatRupiah(
                    summary.weeklyIncome.reduce((acc: number, d: any) => acc + d.total, 0)
                  )}
                </p>
              </div>
              <div className="bg-white p-4 shadow rounded">
                <p className="font-semibold">Jumlah User Sewa</p>
                <p className="text-lg">{summary.totalUsers}</p>
              </div>
            </div>

            {/* CHART PEMASUKAN */}
            <div className="bg-white p-4 shadow rounded mb-6">
              <h3 className="text-lg font-semibold mb-2">Grafik Pemasukan Mingguan</h3>
              <IncomeChart weeklyIncome={summary.weeklyIncome} />
            </div>

            {/* JAM TERISI */}
            <div className="bg-white p-4 shadow rounded mb-6">
              <h3 className="text-lg font-semibold mb-2">Jam Terisi per Lapangan</h3>
              <ul className="list-disc pl-4">
                {summary.occupiedTimes.map((f: any, idx: number) => (
                  <li key={idx}>
                    <strong>{f.field}:</strong>{" "}
                    {f.bookings.length > 0
                      ? f.bookings.map((b: any) => `${b.start} - ${b.end}`).join(", ")
                      : "Kosong"}
                  </li>
                ))}
              </ul>
            </div>

            {/* TABEL USER */}
            <div className="bg-white p-4 shadow rounded">
              <h3 className="text-lg font-semibold mb-2">Data Penyewa Hari Ini</h3>
              <table className="w-full text-sm border">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 border">Nama</th>
                    <th className="p-2 border">Lapangan</th>
                    <th className="p-2 border">Jam</th>
                    <th className="p-2 border">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {summary.todayBookings.map((b: any, i: number) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="p-2 border">{b.user_name}</td>
                      <td className="p-2 border">{b.field_name}</td>
                      <td className="p-2 border">{b.time}</td>
                      <td className="p-2 border">{formatRupiah(b.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <p>Loading...</p>
        )}
      </main>
    </div>
  )
}
