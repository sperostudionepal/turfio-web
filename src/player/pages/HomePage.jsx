import HeroSection from '../components/home/HeroSection';
import HeroStats from '../components/home/HeroStats';
import TurfSection from '../components/home/TurfSection';
import HowItWorksSection from '../components/home/HowItWorksSection';
import DownloadAppSection from '../components/home/DownloadAppSection';
import PricingSection from '../components/home/PricingSection';
import ReviewsSection from '../components/home/ReviewsSection';
import AboutUsSection from '../components/home/AboutUsSection';
import CtaBannerSection from '../components/home/CtaBannerSection';
import { useNavHandlers } from '../../shared/hooks/useNavHandlers';
import { buildTurfSearchPath } from '../../shared/utils/turfSearch';
import { getTurfRoutePath } from '../../shared/utils/turfPaths';

export default function HomePage() {
  const { onFindTurfs, navigate } = useNavHandlers();

  const handleViewTurfDetails = (turf) => {
    navigate(`/turfs/${turf.slug || turf.id || turf._id}`);
  };

  return (
    <>
      <HeroSection onFindTurfs={(search) => navigate(buildTurfSearchPath(search))} />
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
