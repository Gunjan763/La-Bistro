const SectionHeading = ({
  subtitle,
  title,
  description,
  align = 'center',
}: {
  subtitle?: string;
  title: string;
  description?: string;
  align?: 'center' | 'left';
}) => {
  return (
    <div className={`mb-12 md:mb-16 ${align === 'center' ? 'text-center' : 'text-left'}`}>
      {subtitle && (
        <p className="text-gold font-body text-xs md:text-sm font-semibold tracking-[0.25em] uppercase mb-3">
          {subtitle}
        </p>
      )}
      <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary mb-4">
        {title}
      </h2>
      <div className={`ornament-divider mb-5 ${align === 'left' ? 'justify-start' : ''}`}>
        <span className="text-gold text-lg">✦</span>
      </div>
      {description && (
        <p className={`text-text-secondary text-base md:text-lg max-w-4xl leading-relaxed ${align === 'center' ? 'mx-auto' : ''}`}>
          {description}
        </p>
      )}
    </div>
  );
};

export default SectionHeading;
