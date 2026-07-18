'use client';

import { useAuth } from '@/components/auth-provider';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminSidebar } from './components/admin-sidebar';
import { AdminHeader } from './components/admin-header';
import { CategoriesTab } from './components/categories-tab';
import { MenuItemsTab } from './components/menu-items-tab';
import { AboutTab } from './components/about-tab';
import { SubscriptionTab } from './components/subscription-tab';
import { Category, getCategories } from '@/lib/firebase';

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.push('/');
    }
  }, [user, loading, router]);

  const loadCategories = useCallback(async () => {
    if (user?.role !== 'admin') return;
    try {
      const cats = await getCategories();
      setCategories(cats);
    } catch (e) {
      console.log('Failed to load categories', e);
    }
  }, [user]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadCategories();
  }, [loadCategories]);

  if (loading || !user || user.role !== 'admin') return <div className="p-8">Loading...</div>;

  return (
    <div className="flex h-screen w-full bg-[#f8fafc] text-[#0f172a] font-sans overflow-hidden">
      <AdminSidebar />
      
      <main className="flex-1 flex flex-col min-w-0">
        <AdminHeader />
        
        <div className="p-8 flex-1 overflow-auto flex flex-col">
          <div className="flex gap-4 mb-6">
            <div className="flex-1 bg-white p-4 rounded-xl border border-[#e2e8f0] shadow-sm">
              <p className="text-xs text-[#64748b] font-medium uppercase">Categories</p>
              <p className="text-2xl font-bold mt-1">{categories.length}</p>
            </div>
            <div className="flex-1 bg-white p-4 rounded-xl border border-[#e2e8f0] shadow-sm text-emerald-600">
              <p className="text-xs text-[#64748b] font-medium uppercase">System Status</p>
              <p className="text-2xl font-bold mt-1">Live</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm flex-1 flex flex-col overflow-hidden p-6">
            <Tabs defaultValue="menu" className="w-full h-full flex flex-col">
              <TabsList className="mb-6 bg-transparent border-b border-[#e2e8f0] w-full justify-start rounded-none p-0 h-auto space-x-8">
                <TabsTrigger 
                  value="menu" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#0f172a] data-[state=active]:shadow-none pb-4 pt-0 px-0 bg-transparent data-[state=active]:bg-transparent"
                >
                  Menu Items
                </TabsTrigger>
                <TabsTrigger 
                  value="categories" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#0f172a] data-[state=active]:shadow-none pb-4 pt-0 px-0 bg-transparent data-[state=active]:bg-transparent text-[#64748b] data-[state=active]:text-[#0f172a]"
                >
                  Categories
                </TabsTrigger>
                <TabsTrigger 
                  value="about" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#0f172a] data-[state=active]:shadow-none pb-4 pt-0 px-0 bg-transparent data-[state=active]:bg-transparent text-[#64748b] data-[state=active]:text-[#0f172a]"
                >
                  About Page
                </TabsTrigger>
                <TabsTrigger 
                  value="subscription" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#0f172a] data-[state=active]:shadow-none pb-4 pt-0 px-0 bg-transparent data-[state=active]:bg-transparent text-[#64748b] data-[state=active]:text-[#0f172a]"
                >
                  Subscription
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="menu" className="flex-1 overflow-auto outline-none h-full">
                <MenuItemsTab categories={categories} />
              </TabsContent>
              
              <TabsContent value="categories" className="flex-1 overflow-auto outline-none h-full">
                <CategoriesTab categories={categories} onCategoriesChange={loadCategories} />
              </TabsContent>

              <TabsContent value="about" className="flex-1 overflow-auto outline-none h-full">
                <AboutTab />
              </TabsContent>

              <TabsContent value="subscription" className="flex-1 overflow-auto outline-none h-full">
                <SubscriptionTab />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
}
