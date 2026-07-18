'use client';

import { useEffect, useState } from 'react';
import { getCategories, getMenuItems, getAboutInfo, Category, MenuItem, AboutInfo } from '@/lib/firebase';
import { Header } from '@/app/components/restaurant/Header';
import { MenuSection } from '@/app/components/restaurant/MenuSection';
import { Footer } from '@/app/components/restaurant/Footer';
import { Navbar } from '@/components/Navbar';

export default function Page() { 
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [aboutInfo, setAboutInfo] = useState<AboutInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [cats, items, info] = await Promise.all([
          getCategories(),
          getMenuItems(),
          getAboutInfo()
        ]);
        setCategories(cats);
        setMenuItems(items);
        setAboutInfo(info);
      } catch (e) {
        console.error("Error loading restaurant data:", e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // Filter categories to only include those that have items
  const categoriesWithItems = categories.filter(
    cat => menuItems.some(item => item.categoryId === cat.id)
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
      <Navbar />
      <Header info={aboutInfo} />
      
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
        {/* Category Navigation */}
        {categoriesWithItems.length > 0 && (
          <div className="flex gap-3 overflow-x-auto pb-4 mb-8 scrollbar-hide">
            {categoriesWithItems.map(cat => (
              <a 
                key={cat.id} 
                href={`#category-${cat.id}`}
                className="whitespace-nowrap px-4 py-2 bg-white rounded-full border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-indigo-600 hover:border-indigo-200 transition-colors"
              >
                {cat.name}
              </a>
            ))}
          </div>
        )}

        {/* Menu Sections */}
        {categoriesWithItems.length > 0 ? (
          categoriesWithItems.map(cat => (
            <MenuSection 
              key={cat.id} 
              category={cat} 
              items={menuItems.filter(i => i.categoryId === cat.id)} 
            />
          ))
        ) : (
          <div className="text-center py-20 text-slate-500">
            <p>Menu is currently empty.</p>
          </div>
        )}
      </main>

      <Footer info={aboutInfo} />
    </div>
  ); 
}
