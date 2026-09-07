import { useEffect, useRef } from 'react';
import lottie from 'lottie-web';

export default function LottieAnimation({
  src = '/Football.json',
  loop = true,
  autoplay = true,
  className = 'w-full h-full',
  style = {},
}) {
  const containerRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    if (animRef.current) {
      animRef.current.destroy();
    }

    try {
      animRef.current = lottie.loadAnimation({
        container: containerRef.current,
        renderer: 'svg',
        loop: loop !== false,
        autoplay: autoplay !== false,
        path: src,
      });
    } catch (e) {
      console.error('Failed to load lottie animation:', e);
    }

    return () => {
      if (animRef.current) {
        animRef.current.destroy();
        animRef.current = null;
      }
    };
  }, [src, loop, autoplay]);

  return <div ref={containerRef} className={className} style={style} />;
}
