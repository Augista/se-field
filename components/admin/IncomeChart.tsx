"use client"

import { Line } from "react-chartjs-2"
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

export function IncomeChart({ weeklyIncome }: { weeklyIncome: { date: string, total: number }[] }) {
  const data = {
    labels: weeklyIncome.map((d) => d.date),
    datasets: [
      {
        label: "Pemasukan",
        data: weeklyIncome.map((d) => d.total),
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.3,
      },
    ],
  }

  return <Line data={data} />
}
