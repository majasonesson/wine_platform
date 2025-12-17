import { useEffect, useState } from 'react';
import styles from './LoadingModal.module.scss';

export const LoadingModal = ({
  isLoading,
  translatedText,
}) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.addEventListener('load', () => setLoading(false));

    return () => window.removeEventListener('load', () => setLoading(false));
  }, []);

  if (!isLoading) return null;

  return (
    <div className={styles.loadingModal}>
      <div className={styles.modalContent}>
        <div className={styles.loadingSpinner}></div>
        <h2>{translatedText['Loading']}...</h2> {/* No risk of undefined now */}
      </div>
    </div>
  );
};
