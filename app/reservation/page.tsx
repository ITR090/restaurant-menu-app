'use client';

import { useState } from 'react';
import { useAuth } from '@/components/auth-provider';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PhoneInput } from '@/components/PhoneInput';
import { toast } from 'sonner';
import { createReservation } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function ReservationPage() {
  const { user } = useAuth();
  const router = useRouter();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [guests, setGuests] = useState('2');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('You must be logged in to make a reservation');
      return;
    }

    if (!name || !email || !phone || !date || !time || !guests) {
      toast.error('Please fill in all fields');
      return;
    }

    const phoneNumberParts = phone.split(' ');
    if (phoneNumberParts.length !== 2 || phoneNumberParts[1].length !== 10) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }

    setSubmitting(true);
    try {
      await createReservation({
        userId: user.uid,
        name,
        email,
        phone,
        date,
        time,
        guests: parseInt(guests),
        status: 'pending'
      });
      toast.success('Reservation request submitted successfully!');
      router.push('/orders');
    } catch (e: any) {
      console.error(e);
      toast.error(`Failed to submit reservation: ${e.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-12">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Make a Reservation</CardTitle>
            <CardDescription>Book a table for your upcoming visit.</CardDescription>
          </CardHeader>
          <CardContent>
            {!user ? (
              <div className="text-center py-8">
                <p className="text-slate-600 mb-4">You need to log in to make a reservation.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Name</label>
                    <Input 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <Input 
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Phone</label>
                    <PhoneInput 
                      value={phone}
                      onChange={setPhone}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Number of Guests</label>
                    <Input 
                      type="number"
                      min="1"
                      max="20"
                      value={guests}
                      onChange={(e) => setGuests(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Date</label>
                    <Input 
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Time</label>
                    <Input 
                      type="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                  disabled={submitting}
                >
                  {submitting ? 'Submitting...' : 'Confirm Reservation'}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
