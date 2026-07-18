'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { AboutInfo, getAboutInfo, saveAboutInfo } from '@/lib/firebase';

export function AboutTab() {
  const [aboutInfo, setAboutInfo] = useState<AboutInfo>({ name: '', phone: '', location: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadInfo() {
      try {
        const info = await getAboutInfo();
        if (info) {
          setAboutInfo({ name: info.name || '', phone: info.phone || '', location: info.location || '' });
        }
      } catch (e) {
        console.log("Failed to load about info:", e);
      } finally {
        setLoading(false);
      }
    }
    loadInfo();
  }, []);

  const handleSaveAbout = async () => {
    if (!aboutInfo.name.trim() || !aboutInfo.phone.trim() || !aboutInfo.location.trim()) {
      toast.error('All fields are required');
      return;
    }
    try {
      await saveAboutInfo({
        name: aboutInfo.name.trim(),
        phone: aboutInfo.phone.trim(),
        location: aboutInfo.location.trim()
      });
      toast.success('About page info saved');
    } catch (e: any) {
      console.log(e);
      toast.error(`Failed to save about info: ${e.message}`);
    }
  };

  return (
    <div className="flex-1 overflow-auto outline-none">
      <h2 className="text-xl font-bold text-[#0f172a] mb-6">About Page Info</h2>
      <div className="space-y-4 max-w-md">
        <div>
          <label className="text-sm font-medium text-[#0f172a] mb-1.5 block">Restaurant Name</label>
          <Input placeholder="Restaurant Name" value={aboutInfo.name} onChange={e => setAboutInfo({...aboutInfo, name: e.target.value})} className="border-[#e2e8f0] focus-visible:ring-[#0f172a]" />
        </div>
        <div>
          <label className="text-sm font-medium text-[#0f172a] mb-1.5 block">Phone Number</label>
          <Input placeholder="Phone Number" value={aboutInfo.phone} onChange={e => setAboutInfo({...aboutInfo, phone: e.target.value})} className="border-[#e2e8f0] focus-visible:ring-[#0f172a]" />
        </div>
        <div>
          <label className="text-sm font-medium text-[#0f172a] mb-1.5 block">Location</label>
          <Input placeholder="Location" value={aboutInfo.location} onChange={e => setAboutInfo({...aboutInfo, location: e.target.value})} className="border-[#e2e8f0] focus-visible:ring-[#0f172a]" />
        </div>
        <Button onClick={handleSaveAbout} className="bg-[#0f172a] text-white hover:bg-slate-800 mt-4">Save Information</Button>
      </div>
    </div>
  );
}
