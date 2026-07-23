'use client';

import { useState, useEffect, useCallback } from 'react';

import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Category, MenuItem, getMenuItems, addMenuItem, updateMenuItem, deleteMenuItem } from '@/lib/firebase';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface MenuItemsTabProps {
  categories: Category[];
}

export function MenuItemsTab({ categories }: MenuItemsTabProps) {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('');
  const [newItemDesc, setNewItemDesc] = useState('');

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<MenuItem | null>(null);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editItemName, setEditItemName] = useState('');
  const [editItemPrice, setEditItemPrice] = useState('');
  const [editItemCategory, setEditItemCategory] = useState('');
  const [editItemDesc, setEditItemDesc] = useState('');
  
  const loadItems = useCallback(async () => {
    try {
      const fetchedItems = await getMenuItems(selectedCategory === 'all' ? undefined : selectedCategory);
      setItems(fetchedItems);
    } catch (e) {
      console.log('Failed to load menu items', e);
    }
  }, [selectedCategory]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadItems();
  }, [loadItems]);

  const handleAddItem = async () => {
    if (!newItemName.trim() || !newItemPrice.trim() || !newItemCategory) {
      toast.error('Name, price, and category are required');
      return;
    }
    
    try {
      await addMenuItem({
        name: newItemName.trim(),
        price: parseFloat(newItemPrice),
        categoryId: newItemCategory,
        description: newItemDesc.trim() || undefined,
      });
      setIsDialogOpen(false);
      setNewItemName('');
      setNewItemPrice('');
      setNewItemDesc('');
      setNewItemCategory('');
      toast.success('Menu item added');
      loadItems();
    } catch (e: any) {
      console.log(e);
      toast.error(`Failed to add menu item: ${e.message}`);
    }
  };

  const handleDeleteClick = (item: MenuItem) => {
    setItemToDelete(item);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      await deleteMenuItem(itemToDelete.id);
      toast.success('Menu item deleted');
      setIsDeleteDialogOpen(false);
      setItemToDelete(null);
      loadItems();
    } catch (e: any) {
      console.log(e);
      toast.error(`Failed to delete menu item: ${e.message}`);
    }
  };

  const handleEditClick = (item: MenuItem) => {
    setEditingItemId(item.id);
    setEditItemName(item.name);
    setEditItemPrice(item.price.toString());
    setEditItemCategory(item.categoryId);
    setEditItemDesc(item.description || '');
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingItemId) return;
    if (!editItemName.trim() || !editItemPrice.trim() || !editItemCategory) {
      toast.error('Name, price, and category are required');
      return;
    }

    try {
      await updateMenuItem(editingItemId, {
        name: editItemName.trim(),
        price: parseFloat(editItemPrice),
        categoryId: editItemCategory,
        description: editItemDesc.trim() || undefined,
      });
      setIsEditDialogOpen(false);
      setEditingItemId(null);
      toast.success('Menu item updated');
      loadItems();
    } catch (e: any) {
      console.log(e);
      toast.error(`Failed to update menu item: ${e.message}`);
    }
  };

  return (
    <div className="flex-1 overflow-auto outline-none">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-[#0f172a]">Manage Menu Items</h2>
          <p className="text-sm text-[#64748b] mt-1">Select a category and add items to it.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#0f172a] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-slate-800 flex items-center gap-2 shadow-sm h-10">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
              Add Menu Item
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Menu Item</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Name</label>
                <Input value={newItemName} onChange={e => setNewItemName(e.target.value)} placeholder="Item name" />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Price</label>
                <Input type="number" step="0.01" value={newItemPrice} onChange={e => setNewItemPrice(e.target.value)} placeholder="0.00" />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Category</label>
                <Select value={newItemCategory} onValueChange={setNewItemCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(c => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Description (Optional)</label>
                <Input value={newItemDesc} onChange={e => setNewItemDesc(e.target.value)} placeholder="Short description" />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddItem} className="bg-[#0f172a] text-white hover:bg-slate-800">Add Item</Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Menu Item</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Name</label>
                <Input value={editItemName} onChange={e => setEditItemName(e.target.value)} placeholder="Item name" />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Price</label>
                <Input type="number" step="0.01" value={editItemPrice} onChange={e => setEditItemPrice(e.target.value)} placeholder="0.00" />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Category</label>
                <Select value={editItemCategory} onValueChange={setEditItemCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(c => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Description (Optional)</label>
                <Input value={editItemDesc} onChange={e => setEditItemDesc(e.target.value)} placeholder="Short description" />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSaveEdit} className="bg-[#0f172a] text-white hover:bg-slate-800">Save Changes</Button>
            </div>
          </DialogContent>
        </Dialog>
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Confirm Delete</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p>Are you sure you want to delete {itemToDelete?.name}? This action cannot be undone.</p>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
              <Button onClick={confirmDelete} className="bg-red-600 text-white hover:bg-red-700">Delete</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="mb-6 flex items-center gap-3">
        <label className="text-sm font-medium text-[#0f172a]">Filter by Category:</label>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map(c => (
              <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="border border-[#e2e8f0] rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-[#f8fafc] border-b border-[#e2e8f0] text-[11px] uppercase text-[#64748b] font-bold tracking-wider">
            <tr>
              <th className="px-6 py-3">Item Name</th>
              <th className="px-6 py-3">Category</th>
              <th className="px-6 py-3">Price</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e2e8f0] text-sm">
            {items.map(item => {
              const cat = categories.find(c => c.id === item.categoryId);
              return (
                <tr key={item.id} className="hover:bg-[#f8fafc]">
                  <td className="px-6 py-4">
                    <div className="font-medium text-[#0f172a]">{item.name}</div>
                    {item.description && <div className="text-xs text-[#64748b] mt-1">{item.description}</div>}
                  </td>
                  <td className="px-6 py-4 text-[#64748b]">{cat?.name || 'Unknown'}</td>
                  <td className="px-6 py-4 text-[#0f172a] font-medium">${item.price.toFixed(2)}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button onClick={() => handleEditClick(item)} className="text-indigo-600 font-semibold hover:text-indigo-800">Edit</button>
                      <button onClick={() => handleDeleteClick(item)} className="text-red-500 hover:text-red-700" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {items.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-[#64748b]">No menu items found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
