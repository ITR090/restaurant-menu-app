'use client';

import { AboutInfo } from '@/lib/firebase';

interface HeaderProps {
  info: AboutInfo | null;
}

export function Header({ info }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-5xl mx-auto px-4 py-6 text-center">
        <h1 className="text-3xl font-bold text-slate-900">
          {info?.name || 'Our Restaurant'}
        </h1>
        {info?.location && (
          <p className="text-slate-500 mt-2 text-sm">{info.location}</p>
        )}
      </div>
    </header>
  );
}
