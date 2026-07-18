'use client';

import { Button } from '@/components/ui/button';

export function SubscriptionTab() {
  return (
    <div className="flex-1 overflow-auto outline-none">
      <h2 className="text-xl font-bold text-[#0f172a] mb-6">Subscription Plan</h2>
      <div className="p-6 border border-[#e2e8f0] rounded-xl flex items-center justify-between max-w-2xl bg-[#f8fafc]">
        <div>
          <p className="font-semibold text-[#0f172a]">Current Plan</p>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-2xl font-bold">Free</span>
            <span className="bg-slate-200 text-slate-700 text-[9px] px-2 py-0.5 rounded font-bold uppercase tracking-wider">Basic</span>
          </div>
        </div>
        <Button className="bg-[#0f172a] text-white hover:bg-slate-800">Upgrade to Paid</Button>
      </div>
    </div>
  );
}
