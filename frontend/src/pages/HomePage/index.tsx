import HeroSection from './HeroSection';
import FeaturedMenu from './FeaturedMenu';
import AboutSection from './AboutSection';
import GalleryPreview from './GalleryPreview';
import OpeningHours from './OpeningHours';

const HomePage = () => {
  return (
    <main>
      <HeroSection />
      <FeaturedMenu />
      <AboutSection />  
  
      <OpeningHours />
    </main>
  );
};

export default HomePage;
