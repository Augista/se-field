import { Header } from "@/components/layout/header"
import { Hero } from "@/components/sections/hero"
import { Features } from "@/components/sections/features"
import { AvailableFields } from "@/components/sections/available-fields"
import { Footer } from "@/components/layout/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      <main className="w-full">
        <Hero />
        <Features />
        <AvailableFields />
      </main>
      <Footer />
    </div>
  )
}
