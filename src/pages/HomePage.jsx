import HeroSection from '../components/HeroSection';
import HeroStats from '../components/HeroStats';
import TurfSection from '../components/TurfSection';
import HowItWorksSection from '../components/HowItWorksSection';
import DownloadAppSection from '../components/DownloadAppSection';
import PricingSection from '../components/PricingSection';
import ReviewsSection from '../components/ReviewsSection';
import AboutUsSection from '../components/AboutUsSection';
import CtaBannerSection from '../components/CtaBannerSection';
import { useNavHandlers } from '../hooks/useNavHandlers';

export default function HomePage() {
  const { onFindTurfs, onListTurf, navigate } = useNavHandlers();

  const handleViewTurfDetails = (turfId) => {
    navigate(`/turfs/${turfId}`);
  };

  return (
    <>
      <HeroSection onFindTurfs={onFindTurfs} />
      <HeroStats />
      <TurfSection onViewTurfDetails={handleViewTurfDetails} />
      <HowItWorksSection />
      <DownloadAppSection />
      <PricingSection />
      <ReviewsSection />
      <AboutUsSection />
      <CtaBannerSection onListTurf={onListTurf} />
    </>
  );
}
