'use client';

import React, { useEffect, useState } from 'react';
import { useCartStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/components/auth-provider';
import { createOrder } from '@/lib/firebase';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const { items, removeItem, updateQuantity, total, clearCart } = useCartStore();
  const [isMounted, setIsMounted] = useState(false);
  const { user, signIn } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // Hydration fix for zustand persist
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null; // Or a loading skeleton
  }

  const handleCheckout = async () => {
    if (!user) {
      toast.error('Please sign in to place an order');
      signIn();
      return;
    }

    if (items.length === 0) return;

    setIsSubmitting(true);
    try {
      const orderItems = items.map((item) => ({
        menuItemId: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      }));

      await createOrder({
        userId: user.uid,
        items: orderItems,
        totalAmount: total(),
        status: 'pending',
      });

      toast.success('Order placed successfully!');
      clearCart();
      router.push('/orders');
    } catch (error: any) {
      console.error('Checkout error:', error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center gap-3 mb-8">
        <ShoppingCart className="w-8 h-8" />
        <h1 className="text-3xl font-bold tracking-tight">Your Cart</h1>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-16 px-4 bg-muted/30 rounded-lg border border-dashed border-border/50">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingCart className="w-8 h-8 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground mb-6">Looks like you haven't added anything to your cart yet.</p>
          <Button asChild>
            <Link href="/">Browse Menu</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  {item.imageUrl && (
                    <div className="w-20 h-20 rounded-md bg-muted shrink-0 overflow-hidden hidden sm:block">
                      <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex-grow">
                    <h3 className="font-semibold text-lg">{item.name}</h3>
                    <p className="text-muted-foreground">${item.price.toFixed(2)}</p>
                  </div>
                  
                  <div className="flex items-center justify-between w-full sm:w-auto gap-6 mt-4 sm:mt-0">
                    <div className="flex items-center border rounded-md">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 rounded-none rounded-l-md"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-10 text-center text-sm font-medium">{item.quantity}</span>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 rounded-none rounded-r-md"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <span className="font-semibold hidden sm:inline-block w-16 text-right">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="md:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4">Order Summary</h3>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${total().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax (Calculated at checkout)</span>
                    <span>--</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>${total().toFixed(2)}</span>
                  </div>
                </div>
                
                <Button 
                  className="w-full" 
                  size="lg" 
                  onClick={handleCheckout}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Processing...' : 'Checkout'}
                  {!isSubmitting && <ArrowRight className="ml-2 h-4 w-4" />}
                </Button>
                
                {!user && (
                  <p className="text-xs text-center text-muted-foreground mt-4">
                    You will be asked to sign in to complete your order.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
