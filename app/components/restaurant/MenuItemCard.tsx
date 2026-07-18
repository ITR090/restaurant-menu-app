'use client';
import { MenuItem } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/lib/store';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';

interface MenuItemCardProps {
  item: MenuItem;
}

export function MenuItemCard({ item }: MenuItemCardProps) {
  const { addItem } = useCartStore();

  const handleAddToCart = () => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      imageUrl: item.imageUrl,
    });
    toast.success(`${item.name} added to cart`);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-slate-900 text-lg">{item.name}</h3>
          <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md text-sm">
            ${item.price.toFixed(2)}
          </span>
        </div>
        {item.description && (
          <p className="text-slate-500 text-sm leading-relaxed mb-4">
            {item.description}
          </p>
        )}
        {item.imageUrl && (
          <div className="mb-4 aspect-video relative overflow-hidden rounded-md bg-muted">
             <img src={item.imageUrl} alt={item.name} className="object-cover w-full h-full" />
          </div>
        )}
      </div>
      <Button 
        onClick={handleAddToCart}
        className="w-full mt-4 flex items-center justify-center gap-2"
        variant="outline"
      >
        <Plus className="w-4 h-4" />
        Add to cart
      </Button>
    </div>
  );
}
