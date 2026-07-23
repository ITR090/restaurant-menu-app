'use client';

import { Category, MenuItem } from '@/lib/firebase';
import { MenuItemCard } from './MenuItemCard';

interface MenuSectionProps {
  category: Category;
  items: MenuItem[];
}

export function MenuSection({ category, items }: MenuSectionProps) {
  if (items.length === 0) return null;

  return (
    <section id={`category-${category.id}`} className="mb-12">
      <h2 className="text-2xl font-bold text-slate-800 mb-6 border-b border-slate-200 pb-2">
        {category.name}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map(item => (
          <MenuItemCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
