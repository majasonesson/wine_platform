'use client';

import { useEffect, useState } from 'react';
import '../../app/styles/loadingModal.css';

interface LoadingModalProps {
  isLoading: boolean;
  translatedText?: Record<string, string>;
}

export const LoadingModal = ({
  isLoading,
  translatedText = {},
}: LoadingModalProps) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleLoad = () => setLoading(false);
    window.addEventListener('load', handleLoad);

    return () => window.removeEventListener('load', handleLoad);
  }, []);

  if (!isLoading) return null;

  return (
    <div className="loading-modal">
      <div className="modal-content">
        <div className="loading-spinner"></div>
        <h2>{translatedText['Loading'] || 'Loading'}...</h2>
      </div>
    </div>
  );
};

