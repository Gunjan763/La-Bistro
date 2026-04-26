import { useEffect, useState } from 'react';
import { galleryService, getAssetUrl } from '../../services/api';
import type { GalleryImage } from '../../types';
import SectionHeading from '../../components/ui/SectionHeading';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorMessage from '../../components/ui/ErrorMessage';
import GalleryCard from '../../components/ui/GalleryCard';

import { useRestaurant } from '../../hooks/useRestaurant';

const GalleryPage = () => {
  const { restaurant } = useRestaurant();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  const fetchGallery = () => {
    setLoading(true);
    setError(null);
    galleryService
      .getAll()
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

  return (
    <div className="min-h-screen bg-bg-primary pt-24 pb-24">
      <div className="container-layout px-6 md:px-8">
        <SectionHeading
          subtitle="Visual Journey"
          title="Our Gallery"
          description={`A glimpse into the ambiance, artistry, and culinary craft that defines ${restaurant?.name || 'La Bistro'}.`}
        />

        {loading && <LoadingSpinner text="Loading gallery..." />}
        {error && <ErrorMessage message={error} onRetry={fetchGallery} />}

        {!loading && !error && images.length === 0 && (
          <p className="text-center text-text-secondary py-12 text-lg">
            No images available in the gallery.
          </p>
        )}

        {!loading && !error && images.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {images.map((image, i) => (
              <div
                key={image.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${(i % 8) * 100}ms` }}
              >
                <GalleryCard image={image} onClick={setSelectedImage} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors cursor-pointer bg-black/40 p-2 rounded-full"
            onClick={() => setSelectedImage(null)}
          >
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="max-w-5xl w-full flex flex-col items-center gap-4">
            <img
              src={getAssetUrl(selectedImage.imageUrl)}
              alt={selectedImage.caption || 'Gallery image'}
              className="max-w-full max-h-[80vh] object-contain rounded-lg animate-fade-in-up shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
            {selectedImage.caption && (
              <p className="text-white text-lg font-medium bg-black/50 px-6 py-2 rounded-full border border-white/10">
                {selectedImage.caption}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryPage;
