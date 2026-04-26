const LoadingSpinner = ({ size = 'md', text }: { size?: 'sm' | 'md' | 'lg'; text?: string }) => {
  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-10 h-10 border-3',
    lg: 'w-16 h-16 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12">
      <div
        className={`${sizeClasses[size]} rounded-full border-gold/20 border-t-gold animate-spin`}
      />
      {text && (
        <p className="text-text-secondary text-sm font-body tracking-wide">{text}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;
