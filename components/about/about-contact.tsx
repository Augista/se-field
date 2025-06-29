import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Phone, Mail, Clock } from "lucide-react"

export function AboutContact() {
  return (
    <section className="py-20 bg-white w-full">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Hubungi Kami</h2>
          <p className="mt-4 text-lg text-gray-600">Kami siap membantu Anda kapan saja</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Contact Info */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  Alamat Kantor
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Jl. Sudirman No. 123, Blok M<br />
                  Jakarta Selatan 12190
                  <br />
                  Indonesia
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-green-600" />
                  Telepon & WhatsApp
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  +62 21-1234-5678
                  <br />
                  +62 812-3456-7890 (WhatsApp)
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-purple-600" />
                  Email
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  info@sefield.com
                  <br />
                  support@sefield.com
                  <br />
                  partnership@sefield.com
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-orange-600" />
                  Jam Operasional
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Senin - Jumat: 08:00 - 22:00
                  <br />
                  Sabtu - Minggu: 06:00 - 24:00
                  <br />
                  Customer Support: 24/7
                </p>
              </CardContent>
            </Card>
          </div>

          {/* CTA Section */}
          <div className="flex flex-col justify-center">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-blue-900">Siap Memulai?</CardTitle>
                <CardDescription className="text-blue-700">
                  Bergabunglah dengan ribuan pengguna yang sudah merasakan kemudahan SeField
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">Daftar Sekarang</Button>
                  <Button variant="outline" className="w-full border-blue-300 text-blue-700 hover:bg-blue-50">
                    Download Mobile App
                  </Button>
                </div>

                <div className="text-center pt-4">
                  <p className="text-sm text-blue-600 mb-2">Atau ikuti kami di:</p>
                  <div className="flex justify-center space-x-4">
                    <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                      Facebook
                    </Button>
                    <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                      Instagram
                    </Button>
                    <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                      Twitter
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* FAQ Quick Links */}
            <div className="mt-8 space-y-3">
              <h3 className="font-semibold text-gray-900">Pertanyaan Umum:</h3>
              <div className="space-y-2">
                <Button variant="ghost" className="w-full justify-start text-left h-auto p-3 text-sm">
                  Bagaimana cara membatalkan booking?
                </Button>
                <Button variant="ghost" className="w-full justify-start text-left h-auto p-3 text-sm">
                  Apakah bisa reschedule booking?
                </Button>
                <Button variant="ghost" className="w-full justify-start text-left h-auto p-3 text-sm">
                  Metode pembayaran apa saja yang tersedia?
                </Button>
                <Button variant="ghost" className="w-full justify-start text-left h-auto p-3 text-sm">
                  Bagaimana jika lapangan tidak sesuai?
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
