"use client"

import { Line } from "react-chartjs-2"

interface IncomeChartProps {
  weeklyIncome: Array<{ date: string; total: number }>
}

export const IncomeChart = ({ weeklyIncome }: IncomeChartProps) => {
  const data = {
    labels: weeklyIncome.map((item) => {
      const date = new Date(item.date)
      return date.toLocaleDateString("id-ID", {
        weekday: "short",
        day: "numeric",
        month: "short",
      })
    }),
    datasets: [
      {
        label: "Pemasukan Harian",
        data: weeklyIncome.map((item) => item.total),
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "rgb(59, 130, 246)",
        pointBorderColor: "white",
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointHoverBackgroundColor: "rgb(37, 99, 235)",
        pointHoverBorderColor: "white",
        pointHoverBorderWidth: 3,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "white",
        bodyColor: "white",
        borderColor: "rgb(59, 130, 246)",
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: (context: any) =>
            `Pemasukan: ${new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
              maximumFractionDigits: 0,
            }).format(context.parsed.y)}`,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
        ticks: {
          color: "rgb(107, 114, 128)",
          font: {
            size: 12,
            weight: 500,
          },
        },
      },
      y: {
        grid: {
          color: "rgba(107, 114, 128, 0.1)",
          drawBorder: false,
        },
        border: {
          display: false,
        },
        ticks: {
          color: "rgb(107, 114, 128)",
          font: {
            size: 12,
            weight: 500,
          },
          callback: (value: any) =>
            new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
              maximumFractionDigits: 0,
              notation: "compact",
            }).format(value),
        },
      },
    },
    interaction: {
      intersect: false,
      mode: "index" as const,
    },
  } as const

  return <Line data={data} options={options} />
}
