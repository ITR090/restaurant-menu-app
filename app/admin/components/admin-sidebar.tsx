'use client';

import { useAuth } from '@/components/auth-provider';

export function AdminSidebar() {
  const { user } = useAuth();
  
  return (
    <aside className="w-64 bg-white border-r border-[#e2e8f0] flex flex-col hidden md:flex">
      <div className="p-6 border-b border-[#e2e8f0]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#0f172a] rounded-lg flex items-center justify-center text-white font-bold">G</div>
          <span className="font-bold text-lg tracking-tight">GourmetOS</span>
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        <div className="text-[10px] font-bold text-[#64748b] uppercase tracking-wider mb-2 px-2">Management</div>
        <div className="flex items-center gap-3 px-3 py-2 bg-[#f1f5f9] text-[#0f172a] rounded-md font-medium cursor-pointer">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
          Dashboard
        </div>
        <div className="flex items-center gap-3 px-3 py-2 text-[#64748b] hover:bg-[#f1f5f9] rounded-md cursor-pointer">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
          Reservations
        </div>
      </nav>
      <div className="p-4 border-t border-[#e2e8f0]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white shadow-sm flex items-center justify-center font-bold text-slate-500">A</div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">Admin User</p>
            <p className="text-xs text-[#64748b] truncate">{user?.email || 'admin@restaurant.com'}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
