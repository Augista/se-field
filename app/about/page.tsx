import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { AboutHero } from "@/components/about/about-hero"
import { AboutMission } from "@/components/about/about-mission"
import { AboutStats } from "@/components/about/about-stats"
import { AboutContact } from "@/components/about/about-contact"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      <main className="w-full">
        <AboutHero />
        <AboutMission />
        <AboutStats />
        <AboutContact />
      </main>
      <Footer />
    </div>
  )
}
