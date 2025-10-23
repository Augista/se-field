'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { BookingForm } from '@/components/booking/booking-form';
import { BookingList } from '@/components/booking/booking-list';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface Booking {
  id: string;
  fieldName: string;
  fieldId: string;
  date: Date;
  time: string;
  duration: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'rescheduled';
  totalPrice: number;
  paymentStatus: 'pending' | 'paid';
  playerName: string;
  playerPhone: string;
  playerVirtualAccount: number;
  createdAt: Date;
  hasBeenRescheduled?: boolean;
}

export interface PreSelectedField {
  fieldId: string;
  fieldName: string;
  fieldType: string;
  fieldPrice: string;
}

export default function BookingPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeTab, setActiveTab] = useState('new-booking');
  const [preSelectedField, setPreSelectedField] = useState<PreSelectedField | null>(null);
  const [isClient, setIsClient] = useState(false); 
  const searchParams = useSearchParams();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return; 
    const fieldId = searchParams.get('fieldId');
    const fieldName = searchParams.get('fieldName');
    const fieldType = searchParams.get('fieldType');
    const fieldPrice = searchParams.get('fieldPrice');

    if (fieldId && fieldName && fieldType && fieldPrice) {
      setPreSelectedField({ fieldId, fieldName, fieldType, fieldPrice });
      setActiveTab('new-booking');
    } else {
      setPreSelectedField(null);
    }
  }, [isClient, searchParams]);

  const addBooking = (newBooking: Omit<Booking, 'id' | 'createdAt'>) => {
    const booking: Booking = {
      ...newBooking,
      id: Date.now().toString(),
      createdAt: new Date(),
      hasBeenRescheduled: false,
    };
    setBookings((prev) => [booking, ...prev]);
    setActiveTab('my-bookings');
  };

  const updateBooking = (bookingId: string, updates: Partial<Booking>) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, ...updates } : b))
    );
  };

  const clearPreSelection = () => {
    setPreSelectedField(null);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.search = '';
      window.history.replaceState({}, '', url.toString());
    }
  };

  const bookingCount = useMemo(() => bookings.length, [bookings.length]);

  if (!isClient) return null; 

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      <main className="w-full">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="mx-auto max-w-6xl">
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                Booking Lapangan
              </h1>
              <p className="mt-2 text-lg text-gray-600">
                Kelola booking dan jadwal lapangan Anda
              </p>
            </div>

            {/* ✅ pre-selected field alert */}
            {preSelectedField && (
              <Alert className="mb-6 border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium">Lapangan dipilih: </span>
                      <span className="font-bold">
                        {preSelectedField.fieldName}
                      </span>
                      <span className="ml-2 text-sm">
                        ({preSelectedField.fieldType} - Rp{' '}
                        {Number(preSelectedField.fieldPrice).toLocaleString()}/jam)
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={clearPreSelection}
                      >
                        Ganti Lapangan
                      </Button>
                      <Link href="/">
                        <Button variant="ghost" size="sm">
                          <ArrowLeft className="h-4 w-4 mr-1" />
                          Kembali
                        </Button>
                      </Link>
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 mx-auto max-w-md">
                <TabsTrigger value="new-booking">Booking Baru</TabsTrigger>
                <TabsTrigger value="my-bookings" className="relative">
                  Booking Saya
                  {bookingCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
                      {bookingCount}
                    </span>
                  )}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="new-booking">
                <BookingForm
                  onBookingSuccess={addBooking}
                  existingBookings={bookings}
                  preSelectedField={preSelectedField}
                  onClearPreSelection={clearPreSelection}
                />
              </TabsContent>

              <TabsContent value="my-bookings">
                <BookingList
                  bookings={bookings}
                  onUpdateBooking={updateBooking}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
