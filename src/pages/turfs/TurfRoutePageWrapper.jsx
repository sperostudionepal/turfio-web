import { useTurf } from '../../hooks/useTurf';
import TurfRoutePage from './TurfRoutePage';
import { useNavigate } from 'react-router-dom';

export default function TurfRoutePageWrapper() {
  const { turf } = useTurf();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  const handleBookTurf = (turfToBook) => {
    const turfId = turfToBook.slug || turfToBook.id || turfToBook._id;
    navigate(`/turfs/${turfId}/book?step=1`);
  };

  return (
    <TurfRoutePage
      initialTurf={turf}
      onBack={handleBack}
      onBookTurf={handleBookTurf}
    />
  );
}
