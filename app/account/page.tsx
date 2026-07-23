'use client';
import React from 'react';
import { useAuth } from '@/components/auth-provider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Mail, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/Navbar';

export default function AccountPage() {
  const { user, loading, signOut } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc]">
        <Navbar />
        <div className="container mx-auto px-4 py-16 max-w-4xl flex justify-center">
          <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#f8fafc]">
        <Navbar />
        <div className="container mx-auto px-4 py-16 max-w-4xl text-center">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Sign in to view account</h2>
          <p className="text-muted-foreground mb-6">Please sign in to view your account details.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="flex items-center gap-3 mb-8">
        <User className="w-8 h-8" />
        <h1 className="text-3xl font-bold tracking-tight">My Account</h1>
      </div>

      <Card>
        <CardHeader className="bg-slate-50 border-b pb-4 pt-6 px-6">
          <CardTitle className="text-xl">Account Information</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Email Address</div>
              <div className="font-medium">{user.email || 'No email associated'}</div>
            </div>
          </div>

          <div className="pt-6 border-t mt-6">
            <Button variant="destructive" onClick={signOut} className="w-full sm:w-auto flex items-center gap-2">
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
    </div>
  );
}
