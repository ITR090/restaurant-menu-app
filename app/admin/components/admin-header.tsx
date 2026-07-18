'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export function AdminHeader() {
  const router = useRouter();
  
  return (
    <header className="h-16 bg-white border-b border-[#e2e8f0] flex items-center justify-between px-8">
      <div className="flex items-center gap-2 text-sm text-[#64748b]">
        <span>Dashboard</span>
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
        <span className="text-[#0f172a] font-medium">Menu Builder</span>
      </div>
      <div className="flex items-center gap-4">
         <Button variant="outline" size="sm" onClick={() => router.push('/')}>View Site</Button>
      </div>
    </header>
  );
}
