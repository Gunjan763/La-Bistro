import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Image as ImageIcon, CheckCircle, XCircle } from 'lucide-react';
import { menuService, categoryService, getAssetUrl } from '../../../services/api';
import type { MenuItem, Category } from '../../../types';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Modal from '../../../components/ui/Modal';
import { TableSkeleton } from '../../../components/ui/SkeletonLoader';
import EmptyState from '../../../components/ui/EmptyState';
import toast from 'react-hot-toast';

const MenuList = () => {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState<string>('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  
  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    categoryId: '',
    isVeg: true,
    isSpicy: false,
    isAvailable: true,
    isFeatured: false,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [menuData, categoryData] = await Promise.all([
        menuService.getAll(),
        categoryService.getAll()
      ]);
      setItems(menuData);
      setCategories(categoryData.sort((a, b) => a.order - b.order));
    } catch (error) {
      toast.error('Failed to load menu data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredItems = filterCategory 
    ? items.filter(item => item.categoryId === filterCategory)
    : items;

  const openModal = (item?: MenuItem) => {
    if (item) {
      setEditingId(item.id);
      setFormData({
        name: item.name,
        description: item.description,
        price: item.price.toString(),
        categoryId: item.categoryId,
        isVeg: item.isVeg,
        isSpicy: item.isSpicy,
        isAvailable: item.isAvailable,
        isFeatured: item.isFeatured,
      });
    } else {
      setEditingId(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        categoryId: categories[0]?.id || '',
        isVeg: true,
        isSpicy: false,
        isAvailable: true,
        isFeatured: false,
      });
    }
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleToggle = async (id: string, field: 'availability' | 'featured') => {
    try {
      if (field === 'availability') {
        await menuService.toggleAvailability(id);
      } else {
        await menuService.toggleFeatured(id);
      }
      toast.success(`Updated ${field}`);
      fetchData();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.categoryId) {
      toast.error('Please fill required fields');
      return;
    }

    try {
      if (editingId) {
        // Update data
        await menuService.update(editingId, {
          ...formData,
          price: parseFloat(formData.price)
        });
        
        // Update image separately if a new one was selected
        if (imageFile) {
          const imgFormData = new FormData();
          imgFormData.append('image', imageFile);
          await menuService.updateImage(editingId, imgFormData);
        }
        toast.success('Menu item updated');
      } else {
        // Create new
        const newFormData = new FormData();
        newFormData.append('name', formData.name);
        newFormData.append('description', formData.description);
        newFormData.append('price', formData.price);
        newFormData.append('categoryId', formData.categoryId);
        newFormData.append('isVeg', formData.isVeg.toString());
        newFormData.append('isSpicy', formData.isSpicy.toString());
        newFormData.append('isAvailable', formData.isAvailable.toString());
        newFormData.append('isFeatured', formData.isFeatured.toString());
        if (imageFile) {
          newFormData.append('image', imageFile);
        }
        
        await menuService.create(newFormData);
        toast.success('Menu item created');
      }
      setIsModalOpen(false);
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Operation failed');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      setIsDeleting(id);
      await menuService.delete(id);
      toast.success('Item deleted');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete item');
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-text-primary">Menu Items</h1>
          <p className="text-text-secondary text-sm mt-1">Manage dishes, prices, and availability.</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            className="bg-bg-elevated border border-border rounded-lg px-4 py-2 text-sm text-text-primary focus:outline-none focus:border-gold flex-1 sm:w-48"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <Button onClick={() => openModal()} className="shrink-0">
            <Plus size={18} className="mr-2" /> Add Item
          </Button>
        </div>
      </div>

      <div className="bg-bg-card border border-border rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="p-6"><TableSkeleton rows={5} cols={5} /></div>
        ) : filteredItems.length === 0 ? (
          <EmptyState
            title="No menu items"
            description="Start adding delicious dishes to your menu."
            actionLabel="Add Item"
            onAction={() => openModal()}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-bg-elevated/50 text-text-secondary">
                <tr>
                  <th className="px-6 py-4 font-medium">Item</th>
                  <th className="px-6 py-4 font-medium">Category</th>
                  <th className="px-6 py-4 font-medium">Price</th>
                  <th className="px-6 py-4 font-medium text-center">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-bg-elevated/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-bg-elevated overflow-hidden border border-border shrink-0">
                          {item.imageUrl ? (
                            <img src={getAssetUrl(item.imageUrl)} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-text-muted">
                              <ImageIcon size={20} />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-text-primary">{item.name}</p>
                          <div className="flex gap-2 mt-1">
                            <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${item.isVeg ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                              {item.isVeg ? 'Veg' : 'Non-Veg'}
                            </span>
                            {item.isSpicy && (
                              <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-orange-500/10 text-orange-500">Spicy</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-text-secondary">
                      {categories.find(c => c.id === item.categoryId)?.name || 'Unknown'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-text-primary">
                      ${parseFloat(item.price.toString()).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center space-x-2">
                      <button
                        onClick={() => handleToggle(item.id, 'availability')}
                        className={`inline-flex p-1 rounded-full ${item.isAvailable ? 'text-emerald-500 hover:bg-emerald-500/10' : 'text-text-muted hover:bg-bg-elevated'}`}
                        title="Toggle Availability"
                      >
                        {item.isAvailable ? <CheckCircle size={18} /> : <XCircle size={18} />}
                      </button>
                      <button
                        onClick={() => handleToggle(item.id, 'featured')}
                        className={`inline-flex p-1 rounded-full ${item.isFeatured ? 'text-gold hover:bg-gold/10' : 'text-text-muted hover:bg-bg-elevated'}`}
                        title="Toggle Featured"
                      >
                        <span className="text-lg">★</span>
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right space-x-3">
                      <button onClick={() => openModal(item)} className="text-text-muted hover:text-gold transition-colors">
                        <Edit2 size={18} />
                      </button>
                      <button onClick={() => handleDelete(item.id)} disabled={isDeleting === item.id} className="text-text-muted hover:text-red-500 transition-colors disabled:opacity-50">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? 'Edit Menu Item' : 'Add Menu Item'} maxWidth="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required className="col-span-2" />
            <Input label="Price" type="number" step="0.01" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} required />
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-text-secondary">Category</label>
              <select
                className="w-full bg-bg-elevated border border-border rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:border-gold"
                value={formData.categoryId}
                onChange={e => setFormData({...formData, categoryId: e.target.value})}
                required
              >
                <option value="">Select Category</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>
          
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text-secondary">Description</label>
            <textarea
              className="w-full bg-bg-elevated border border-border rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:border-gold resize-none"
              rows={3}
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text-secondary">Image Upload</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              className="w-full bg-bg-elevated border border-border rounded-lg px-4 py-2 text-sm text-text-primary file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gold/10 file:text-gold hover:file:bg-gold/20"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={formData.isVeg} onChange={e => setFormData({...formData, isVeg: e.target.checked})} className="w-4 h-4 rounded border-border bg-bg-elevated text-gold focus:ring-gold" />
              <span className="text-sm text-text-primary">Vegetarian</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={formData.isSpicy} onChange={e => setFormData({...formData, isSpicy: e.target.checked})} className="w-4 h-4 rounded border-border bg-bg-elevated text-gold focus:ring-gold" />
              <span className="text-sm text-text-primary">Spicy</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={formData.isAvailable} onChange={e => setFormData({...formData, isAvailable: e.target.checked})} className="w-4 h-4 rounded border-border bg-bg-elevated text-gold focus:ring-gold" />
              <span className="text-sm text-text-primary">Available</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={formData.isFeatured} onChange={e => setFormData({...formData, isFeatured: e.target.checked})} className="w-4 h-4 rounded border-border bg-bg-elevated text-gold focus:ring-gold" />
              <span className="text-sm text-text-primary">Featured</span>
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-border mt-6">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">{editingId ? 'Save Changes' : 'Add Item'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default MenuList;
