'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Category, addCategory, updateCategory, updateCategoriesOrder } from '@/lib/firebase';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface CategoriesTabProps {
  categories: Category[];
  onCategoriesChange: () => void;
}

export function CategoriesTab({ categories, onCategoriesChange }: CategoriesTabProps) {
  const [newCatName, setNewCatName] = useState('');
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [editingCatName, setEditingCatName] = useState('');

  const handleAddCategory = async () => {
    if (!newCatName.trim()) {
      toast.error('Category name cannot be empty');
      return;
    }
    try {
      await addCategory(newCatName.trim());
      setNewCatName('');
      toast.success('Category added');
      onCategoriesChange();
    } catch (e: any) {
      console.log(e);
      toast.error(`Failed to add category: ${e.message}`);
    }
  };

  const handleEditClick = (category: Category) => {
    setEditingCatId(category.id);
    setEditingCatName(category.name);
  };

  const handleSaveEdit = async () => {
    if (!editingCatId) return;
    if (!editingCatName.trim()) {
      toast.error('Category name cannot be empty');
      return;
    }
    try {
      await updateCategory(editingCatId, editingCatName.trim());
      setEditingCatId(null);
      setEditingCatName('');
      toast.success('Category updated');
      onCategoriesChange();
    } catch (e: any) {
      console.log(e);
      toast.error(`Failed to update category: ${e.message}`);
    }
  };

  const handleCancelEdit = () => {
    setEditingCatId(null);
    setEditingCatName('');
  };

  const saveOrder = async (newCategories: Category[]) => {
    try {
      const updates = newCategories.map((cat, i) => ({
        id: cat.id,
        order: i,
      }));
      await updateCategoriesOrder(updates);
      onCategoriesChange();
      toast.success('Categories reordered');
    } catch(e: any) {
      console.error(e); toast.error('Failed to reorder categories');
    }
  };

  const handleMoveUp = async (index: number) => {
    if (index === 0) return;
    const newCategories = [...categories];
    const temp = newCategories[index];
    newCategories[index] = newCategories[index - 1];
    newCategories[index - 1] = temp;
    await saveOrder(newCategories);
  };

  const handleMoveDown = async (index: number) => {
    if (index === categories.length - 1) return;
    const newCategories = [...categories];
    const temp = newCategories[index];
    newCategories[index] = newCategories[index + 1];
    newCategories[index + 1] = temp;
    await saveOrder(newCategories);
  };

  return (
    <div className="flex-1 overflow-auto outline-none">
      <h2 className="text-xl font-bold text-[#0f172a] mb-6">Menu Categories</h2>
      <div className="flex gap-4 mb-8">
        <Input 
          placeholder="New Category (e.g. Main Meals)" 
          value={newCatName} 
          onChange={e => setNewCatName(e.target.value)} 
          className="max-w-sm border-[#e2e8f0] focus-visible:ring-[#0f172a]"
        />
        <Button 
          onClick={handleAddCategory}
          className="bg-[#0f172a] text-white hover:bg-slate-800"
        >
          Add Category
        </Button>
      </div>
      <div className="border border-[#e2e8f0] rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-[#f8fafc] border-b border-[#e2e8f0] text-[11px] uppercase text-[#64748b] font-bold tracking-wider">
            <tr>
              <th className="px-6 py-3">Category Name</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e2e8f0] text-sm">
            {categories.map(c => (
              <tr key={c.id} className="hover:bg-[#f8fafc]">
                <td className="px-6 py-4 font-medium text-[#0f172a]">
                  {editingCatId === c.id ? (
                    <Input
                      value={editingCatName}
                      onChange={(e) => setEditingCatName(e.target.value)}
                      className="max-w-[200px]"
                    />
                  ) : (
                    c.name
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  {editingCatId === c.id ? (
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={handleCancelEdit}>Cancel</Button>
                      <Button size="sm" onClick={handleSaveEdit} className="bg-[#0f172a] text-white hover:bg-slate-800">Save</Button>
                    </div>
                  ) : (
                    <div className="flex justify-end items-center gap-3">
                      <div className="flex flex-col gap-1 mr-2">
                        <button 
                          onClick={() => handleMoveUp(categories.indexOf(c))}
                          disabled={categories.indexOf(c) === 0}
                          className="text-slate-400 hover:text-slate-700 disabled:opacity-30"
                        >
                          <ArrowUp className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleMoveDown(categories.indexOf(c))}
                          disabled={categories.indexOf(c) === categories.length - 1}
                          className="text-slate-400 hover:text-slate-700 disabled:opacity-30"
                        >
                          <ArrowDown className="w-4 h-4" />
                        </button>
                      </div>
                      <button onClick={() => handleEditClick(c)} className="text-indigo-600 font-semibold hover:text-indigo-800">Edit</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan={2} className="px-6 py-8 text-center text-[#64748b]">No categories found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
