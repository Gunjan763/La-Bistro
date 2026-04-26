import { useState, useEffect, useRef } from 'react';
import { Upload, Edit2, Trash2 } from 'lucide-react';
import { galleryService } from '../../../services/api';
import type { GalleryImage } from '../../../types';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Modal from '../../../components/ui/Modal';
import { CardSkeleton } from '../../../components/ui/SkeletonLoader';
import EmptyState from '../../../components/ui/EmptyState';
import toast from 'react-hot-toast';

const GalleryManager = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  
  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    caption: '',
    isFeatured: false,
    displayOrder: 0,
  });

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const data = await galleryService.getAll();
      setImages(data.sort((a, b) => a.displayOrder - b.displayOrder));
    } catch (error) {
      toast.error('Failed to load gallery images');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const newFormData = new FormData();
    newFormData.append('image', file);
    newFormData.append('caption', '');
    newFormData.append('isFeatured', 'false');
    newFormData.append('displayOrder', (images.length > 0 ? Math.max(...images.map(i => i.displayOrder)) + 1 : 1).toString());

    try {
      toast.loading('Uploading image...', { id: 'upload' });
      await galleryService.create(newFormData);
      toast.success('Image uploaded successfully', { id: 'upload' });
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to upload image', { id: 'upload' });
    }
    
    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const openEditModal = (image: GalleryImage) => {
    setEditingId(image.id);
    setFormData({
      caption: image.caption || '',
      isFeatured: image.isFeatured,
      displayOrder: image.displayOrder,
    });
    setIsModalOpen(true);
  };

  const handleToggleFeature = async (id: string) => {
    try {
      await galleryService.toggleFeature(id);
      toast.success('Updated featured status');
      fetchData();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;

    try {
      await galleryService.update(editingId, formData);
      toast.success('Image details updated');
      setIsModalOpen(false);
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Update failed');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this image?')) return;
    try {
      setIsDeleting(id);
      await galleryService.delete(id);
      toast.success('Image deleted');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete image');
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-text-primary">Gallery</h1>
          <p className="text-text-secondary text-sm mt-1">Manage restaurant images and featured carousel.</p>
        </div>
        <div>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
          />
          <Button onClick={() => fileInputRef.current?.click()} className="shrink-0">
            <Upload size={18} className="mr-2" /> Upload Image
          </Button>
        </div>
      </div>

      <div className="bg-bg-card border border-border rounded-xl p-6">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
        ) : images.length === 0 ? (
          <EmptyState
            title="Gallery is empty"
            description="Upload some beautiful photos of your restaurant and dishes."
            actionLabel="Upload Image"
            onAction={() => fileInputRef.current?.click()}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {images.map((image) => (
              <div key={image.id} className="group relative bg-bg-elevated border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
                {/* Image */}
                <div className="aspect-square bg-bg-secondary overflow-hidden">
                  <img
                    src={image.imageUrl}
                    alt={image.caption || 'Gallery Image'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                
                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                  <span className="px-2 py-1 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold rounded-md">
                    Order: {image.displayOrder}
                  </span>
                  {image.isFeatured && (
                    <span className="px-2 py-1 bg-gold/90 text-black text-[10px] font-bold rounded-md uppercase tracking-wider">
                      Featured
                    </span>
                  )}
                </div>

                {/* Hover Actions Overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                  <button
                    onClick={() => handleToggleFeature(image.id)}
                    className={`p-2 rounded-full ${image.isFeatured ? 'bg-gold text-black hover:bg-gold-light' : 'bg-bg-elevated text-text-primary hover:bg-gold hover:text-black'} transition-colors`}
                    title="Toggle Featured"
                  >
                    <span className="text-xl leading-none">★</span>
                  </button>
                  <button
                    onClick={() => openEditModal(image)}
                    className="p-2 rounded-full bg-bg-elevated text-text-primary hover:bg-blue-500 hover:text-white transition-colors"
                    title="Edit Caption & Order"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(image.id)}
                    disabled={isDeleting === image.id}
                    className="p-2 rounded-full bg-bg-elevated text-text-primary hover:bg-red-500 hover:text-white transition-colors disabled:opacity-50"
                    title="Delete Image"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                
                {/* Details Banner */}
                {image.caption && (
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-4 pt-8">
                    <p className="text-sm font-medium text-white truncate">{image.caption}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Edit Image Details">
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <Input
            label="Caption (Optional)"
            value={formData.caption}
            onChange={e => setFormData({...formData, caption: e.target.value})}
            placeholder="e.g., Cozy interior dining area"
          />
          <Input
            type="number"
            label="Display Order"
            value={formData.displayOrder}
            onChange={e => setFormData({...formData, displayOrder: parseInt(e.target.value) || 0})}
            helperText="Determines the order in the gallery grid"
          />
          <label className="flex items-center gap-3 cursor-pointer mt-4">
            <input 
              type="checkbox" 
              checked={formData.isFeatured} 
              onChange={e => setFormData({...formData, isFeatured: e.target.checked})} 
              className="w-4 h-4 rounded border-border bg-bg-elevated text-gold focus:ring-gold" 
            />
            <span className="text-sm text-text-primary">Feature on Homepage</span>
          </label>
          <div className="flex justify-end gap-3 pt-4 border-t border-border mt-6">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default GalleryManager;
