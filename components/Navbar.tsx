'use client';

import Link from 'next/link';
import { useAuth } from '@/components/auth-provider';
import { ShoppingCart, ClipboardList, User as UserIcon, LogIn, LogOut } from 'lucide-react';
import { useCartStore } from '@/lib/store';
import { useEffect, useState } from 'react';

export function Navbar() {
  const { user, signIn, signOut } = useAuth();
  const { items } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl text-indigo-600">
          Home
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/cart" className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-indigo-600 transition-colors relative">
            <ShoppingCart className="w-4 h-4" />
            My Cart
            {mounted && cartItemCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-indigo-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {cartItemCount}
              </span>
            )}
          </Link>
          
          {user ? (
            <>
              <Link href="/orders" className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-indigo-600 transition-colors">
                <ClipboardList className="w-4 h-4" />
                My Orders
              </Link>
              <Link href="/account" className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-indigo-600 transition-colors">
                <UserIcon className="w-4 h-4" />
                My Account
              </Link>
              {user.role === 'admin' && (
                <Link href="/admin" className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-indigo-600 transition-colors">
                  Admin
                </Link>
              )}
              <button onClick={signOut} className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-red-600 transition-colors">
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </>
          ) : (
            <button onClick={signIn} className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-indigo-600 transition-colors">
              <LogIn className="w-4 h-4" />
              Register
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
