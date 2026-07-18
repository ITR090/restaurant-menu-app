'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/components/auth-provider';
import { getUserOrders, OrderWithId } from '@/lib/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ClipboardList, Clock } from 'lucide-react';

export default function OrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<OrderWithId[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      if (user) {
        try {
          const userOrders = await getUserOrders(user.uid);
          setOrders(userOrders);
        } catch (error) {
          console.error('Failed to load orders:', error);
        } finally {
          setLoading(false);
        }
      } else if (!authLoading) {
        setLoading(false);
      }
    }

    loadOrders();
  }, [user, authLoading]);

  if (authLoading || loading) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-4xl flex justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-4xl text-center">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <ClipboardList className="w-8 h-8 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-semibold mb-2">Sign in to view orders</h2>
        <p className="text-muted-foreground mb-6">Please sign in to see your order history.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center gap-3 mb-8">
        <ClipboardList className="w-8 h-8" />
        <h1 className="text-3xl font-bold tracking-tight">My Orders</h1>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-16 px-4 bg-muted/30 rounded-lg border border-dashed border-border/50">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <ClipboardList className="w-8 h-8 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold mb-2">No orders yet</h2>
          <p className="text-muted-foreground mb-6">You haven't placed any orders.</p>
          <Button asChild>
            <Link href="/">Browse Menu</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <Card key={order.id} className="overflow-hidden">
              <CardHeader className="bg-slate-50 border-b pb-4 pt-4 px-6 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    Order #{order.id.slice(-6).toUpperCase()}
                  </CardTitle>
                  <div className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                    <Clock className="w-3.5 h-3.5" />
                    {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString() : 'Recent'}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">${order.totalAmount.toFixed(2)}</div>
                  <div className={`text-xs font-medium px-2 py-1 rounded-full mt-1 inline-block ${
                    order.status === 'completed' ? 'bg-green-100 text-green-700' :
                    order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                    order.status === 'paid' ? 'bg-blue-100 text-blue-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <ul className="space-y-3">
                  {order.items.map((item, index) => (
                    <li key={index} className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-3">
                        <span className="font-medium bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                          {item.quantity}x
                        </span>
                        <span>{item.name}</span>
                      </div>
                      <span className="text-slate-600">${(item.price * item.quantity).toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
