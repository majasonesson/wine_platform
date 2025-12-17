'use client';

import { useEffect, useState } from 'react';
import { getPublishedWines } from '@/lib/connection-service';
import Link from 'next/link';
import styles from '@/app/styles/importerPage.module.scss';
import { Wine } from '@/types/wine.types';

export default function ImporterPage() {
  const [wines, setWines] = useState<Wine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWines = async () => {
      try {
        const data = await getPublishedWines();
        setWines(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch wines');
      } finally {
        setLoading(false);
      }
    };

    fetchWines();
  }, []);

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>Error: {error}</div>;

  return (
    <main className={styles.importerPage}>
      <div className={styles.header}>
        <h1 className={styles.title}>Available Wines</h1>
        <Link href="/importer/connect" className={styles.connectButton}>
          Connect with Producers
        </Link>
      </div>

      <div className={styles.infoBox}>
        <p>
          <strong>Note:</strong> You can only view wines from producers you've connected with and
          that have published their wines.
        </p>
      </div>

      {wines.length === 0 ? (
        <p className={styles.emptyState}>
          No wines available. Connect with producers to see their published wines.
        </p>
      ) : (
        <div className={styles.wineGrid}>
          {wines.map((wine) => (
            <div key={wine.WineID} className={styles.wineCard}>
              <h2 className={styles.wineName}>{wine.Name}</h2>
              {wine.BrandName && <p className={styles.brandName}>{wine.BrandName}</p>}
              {wine.Country && wine.Region && (
                <p className={styles.location}>
                  {wine.Country}, {wine.Region}
                </p>
              )}
              {wine.WineYear && <p className={styles.vintage}>Vintage: {wine.WineYear}</p>}
              <Link href={`/importer/product/${wine.WineID}`} className={styles.viewButton}>
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
