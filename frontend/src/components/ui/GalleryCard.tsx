import type { GalleryImage } from '../../types';

interface GalleryCardProps {
  image: GalleryImage;
  onClick: (image: GalleryImage) => void;
}

const GalleryCard = ({ image, onClick }: GalleryCardProps) => {
  const formattedDate = image.createdAt 
    ? new Date(image.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';

  return (
    <div className="group flex flex-col bg-bg-card border border-border rounded-xl overflow-hidden hover:border-gold/30 transition-all duration-500 hover:shadow-[0_8px_40px_rgba(201,169,110,0.08)] hover:-translate-y-1">
      {/* Image Container */}
      <div 
        className="relative aspect-square overflow-hidden cursor-pointer"
        onClick={() => onClick(image)}
      >
        <img
          src={image.imageUrl.startsWith('http') ? image.imageUrl : image.imageUrl}
          alt={image.caption || 'Gallery image'}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-500 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 text-center">
            <svg className="w-8 h-8 text-white mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
            </svg>
          </div>
        </div>
      </div>
      
      {/* Details */}
      <div className="p-4 flex flex-col gap-1 flex-grow">
        <p className="font-medium text-text-primary group-hover:text-gold transition-colors duration-300">
          {image.caption || 'Beautiful moment at La Bistro'}
        </p>
        {formattedDate && (
          <p className="text-xs text-text-muted mt-auto">
            {formattedDate}
          </p>
        )}
      </div>
    </div>
  );
};

export default GalleryCard;
