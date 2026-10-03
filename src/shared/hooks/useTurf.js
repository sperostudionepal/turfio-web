import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import turfService from '../services/turfService';

export function useTurf() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();

  const idOrSlug = slug || searchParams.get('turfId') || searchParams.get('id');

  const [turf, setTurf] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!idOrSlug) {
      setLoading(false);
      setError('No turf identifier provided.');
      return;
    }

    let isMounted = true;
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    turfService.getTurfById(idOrSlug, { signal: controller.signal })
      .then((data) => {
        if (!isMounted) return;
        setTurf(data);
        setLoading(false);
      })
      .catch((err) => {
        if (!isMounted || err?.code === 'ERR_CANCELED' || err?.name === 'CanceledError') return;
        setError(err.message || 'Failed to load turf details');
        setLoading(false);
      });

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [idOrSlug]);

  return { turf, setTurf, loading, error, idOrSlug };
}
