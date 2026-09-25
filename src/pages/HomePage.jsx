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
import { getTurfRoutePath } from '../utils/turfPaths';

export default function HomePage() {
  const { onFindTurfs, navigate } = useNavHandlers();

  const handleViewTurfDetails = (turf) => {
    navigate(`/turfs/${turf.slug || turf.id || turf._id}`);
  };

  return (
    <>
      <HeroSection onFindTurfs={onFindTurfs} />
      <HeroStats />
      <TurfSection onViewDetails={handleViewTurfDetails} onNavigateRoute={(turf) => navigate(getTurfRoutePath(turf))} />
      <HowItWorksSection />
      <DownloadAppSection />
      <PricingSection />
      <ReviewsSection />
      <AboutUsSection />
      <CtaBannerSection onBookNow={onFindTurfs} />
    </>
  );
}
