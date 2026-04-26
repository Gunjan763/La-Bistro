import { useEffect, useState } from 'react';
import { galleryService } from '../../services/api';
import type { GalleryImage } from '../../types';
import SectionHeading from '../../components/ui/SectionHeading';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorMessage from '../../components/ui/ErrorMessage';

import { useRestaurant } from '../../hooks/useRestaurant';

const GalleryPreview = () => {
  const { restaurant } = useRestaurant();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  const fetchGallery = () => {
    setLoading(true);
    setError(null);
    galleryService
      .getFeatured()
      .then(setImages)
      .catch((err) => setError(err.message || 'Failed to load gallery'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  // Close lightbox on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedImage(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Use fallback images if no gallery images from API
  const fallbackImages = [
    { id: '1', imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80', caption: 'Our Restaurant', isFeatured: true, displayOrder: 0, createdAt: '', updatedAt: '' },
    { id: '2', imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80', caption: 'Signature Dish', isFeatured: true, displayOrder: 1, createdAt: '', updatedAt: '' },
    { id: '3', imageUrl: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=600&q=80', caption: 'Fresh Ingredients', isFeatured: true, displayOrder: 2, createdAt: '', updatedAt: '' },
    { id: '4', imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80', caption: 'Wood-fired Perfection', isFeatured: true, displayOrder: 3, createdAt: '', updatedAt: '' },
    { id: '5', imageUrl: 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=600&q=80', caption: 'Plated Elegance', isFeatured: true, displayOrder: 4, createdAt: '', updatedAt: '' },
    { id: '6', imageUrl: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600&q=80', caption: 'Cozy Ambiance', isFeatured: true, displayOrder: 5, createdAt: '', updatedAt: '' },
  ];

  const displayImages = images.length > 0 ? images : (!loading && !error ? fallbackImages : []);

  return (
    <section id="gallery" className="section-padding bg-bg-primary">
      <div className="container-layout px-6 md:px-8">
        <SectionHeading
          subtitle="Visual Journey"
          title="Our Gallery"
          description={`A glimpse into the ambiance, artistry, and culinary craft that defines ${restaurant?.name || 'La Bistro'}.`}
        />

        {loading && <LoadingSpinner text="Loading gallery..." />}
        {error && <ErrorMessage message={error} onRetry={fetchGallery} />}

        {!loading && displayImages.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {displayImages.slice(0, 6).map((image, i) => (
              <div
                key={image.id}
                className={`group relative rounded-xl overflow-hidden cursor-pointer animate-fade-in-up ${
                  i === 0 ? 'md:col-span-2 md:row-span-2' : ''
                }`}
                style={{ animationDelay: `${i * 100}ms` }}
                onClick={() => setSelectedImage(image)}
              >
                <div className={`${i === 0 ? 'aspect-square' : 'aspect-square'}`}>
                  <img
                    src={image.imageUrl.startsWith('http') ? image.imageUrl : image.imageUrl}
                    alt={image.caption || 'Gallery image'}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-500 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 text-center">
                    <svg className="w-8 h-8 text-white mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
                    </svg>
                    {image.caption && (
                      <p className="text-white text-sm font-medium">{image.caption}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors cursor-pointer"
            onClick={() => setSelectedImage(null)}
          >
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <img
            src={selectedImage.imageUrl}
            alt={selectedImage.caption || 'Gallery image'}
            className="max-w-full max-h-[85vh] object-contain rounded-lg animate-fade-in-up"
            onClick={(e) => e.stopPropagation()}
          />
          {selectedImage.caption && (
            <p className="absolute bottom-8 text-white text-sm font-medium bg-black/50 px-4 py-2 rounded-full">
              {selectedImage.caption}
            </p>
          )}
        </div>
      )}
    </section>
  );
};

export default GalleryPreview;
