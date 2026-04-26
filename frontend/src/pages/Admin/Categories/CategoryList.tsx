import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { categoryService } from '../../../services/api';
import type { Category } from '../../../types';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Modal from '../../../components/ui/Modal';
import { TableSkeleton } from '../../../components/ui/SkeletonLoader';
import EmptyState from '../../../components/ui/EmptyState';
import toast from 'react-hot-toast';

const CategoryList = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  
  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [order, setOrder] = useState<number>(0);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const data = await categoryService.getAll();
      // Sort by order
      setCategories(data.sort((a, b) => a.order - b.order));
    } catch (error) {
      toast.error('Failed to load categories');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openModal = (category?: Category) => {
    if (category) {
      setEditingId(category.id);
      setName(category.name);
      setOrder(category.order);
    } else {
      setEditingId(null);
      setName('');
      setOrder(categories.length > 0 ? Math.max(...categories.map(c => c.order)) + 1 : 1);
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Category name is required');
      return;
    }

    try {
      if (editingId) {
        await categoryService.update(editingId, name, order);
        toast.success('Category updated successfully');
      } else {
        await categoryService.create(name, order);
        toast.success('Category created successfully');
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Operation failed');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this category? All related menu items may be affected.')) {
      return;
    }

    try {
      setIsDeleting(id);
      await categoryService.delete(id);
      toast.success('Category deleted successfully');
      fetchCategories();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to delete category');
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-text-primary">Categories</h1>
          <p className="text-text-secondary text-sm mt-1">Manage your menu categories and their display order.</p>
        </div>
        <Button onClick={() => openModal()} className="shrink-0">
          <Plus size={18} className="mr-2" />
          Add Category
        </Button>
      </div>

      <div className="bg-bg-card border border-border rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="p-6">
            <TableSkeleton rows={3} cols={3} />
          </div>
        ) : categories.length === 0 ? (
          <EmptyState
            title="No categories found"
            description="Get started by creating your first menu category."
            actionLabel="Add Category"
            onAction={() => openModal()}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-bg-elevated/50 text-text-secondary">
                <tr>
                  <th className="px-6 py-4 font-medium">Order</th>
                  <th className="px-6 py-4 font-medium">Name</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {categories.map((category) => (
                  <tr key={category.id} className="hover:bg-bg-elevated/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gold/10 text-gold font-semibold text-xs">
                        {category.order}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-text-primary">
                      {category.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right space-x-3">
                      <button
                        onClick={() => openModal(category)}
                        className="text-text-muted hover:text-gold transition-colors"
                        title="Edit"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(category.id)}
                        disabled={isDeleting === category.id}
                        className="text-text-muted hover:text-red-500 transition-colors disabled:opacity-50"
                        title="Delete"
                      >
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

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit Category' : 'Add Category'}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Category Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Starters, Main Course"
            required
            autoFocus
          />
          <Input
            type="number"
            label="Display Order"
            value={order}
            onChange={(e) => setOrder(parseInt(e.target.value) || 0)}
            helperText="Lower numbers appear first"
            required
          />
          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {editingId ? 'Save Changes' : 'Create Category'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default CategoryList;
