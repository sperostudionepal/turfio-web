import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { appUrl } from '../../shared/config/appContext';

export function PortalRedirect({ app, path }) {
  const location = useLocation();
  const target = appUrl(app, (path || location.pathname) + location.search + location.hash);
  useEffect(() => { window.location.replace(target); }, [target]);
  return <p className="p-8">Opening the Turfio portal… <a href={target}>Continue</a></p>;
}
