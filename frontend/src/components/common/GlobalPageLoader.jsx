import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { requestTracker } from '../../api/axios';

export default function GlobalPageLoader() {
  const [isLoading, setIsLoading] = useState(false);
  const [fadeAway, setFadeAway] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Start loading on route change
    setIsLoading(true);
    setFadeAway(false);

    // Initial delay ensures we capture requests triggered immediately on route mount
    let pollInterval;
    const initialDelay = setTimeout(() => {
      pollInterval = setInterval(() => {
        const noActiveRequests = requestTracker.active <= 0; // fallback in case counter glitches
        
        // Convert NodeList to array and check if all have 'complete' true
        const images = Array.from(document.images);
        const allImagesLoaded = images.length === 0 || images.every((img) => img.complete);

        if (noActiveRequests && allImagesLoaded) {
          clearInterval(pollInterval);
          setFadeAway(true);
          setTimeout(() => setIsLoading(false), 500); // Wait for fade out animation
        }
      }, 100);
    }, 200);

    return () => {
      clearTimeout(initialDelay);
      clearInterval(pollInterval);
    };
  }, [location.pathname]); // Only trigger on path change, not query params

  if (!isLoading) return null;

  return (
    <div className={`global-loader-overlay ${fadeAway ? 'fade-out' : ''}`}>
      <div className="global-loader-spinner"></div>
      <div className="global-loader-text">Loading...</div>
    </div>
  );
}
