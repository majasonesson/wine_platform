'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { fetchUser } from '@/lib/api-client';
import styles from '@/app/styles/header.module.scss';

interface DecodedToken {
  id: number;
  role: string;
  email: string;
}

export default function Header() {
  const [userData, setUserData] = useState<any>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const pathname = usePathname();

  const token = Cookies.get('token');

  useEffect(() => {
    if (token) {
      try {
        const decodedToken = jwtDecode<DecodedToken>(token);
        const role = (decodedToken.role || '').toLowerCase();
        setUserRole(role);
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }, [token]);

  useEffect(() => {
    const loadUser = async () => {
      try {
        if (!token) {
          setUserData(null);
          return;
        }

        const decodedToken = jwtDecode<DecodedToken>(token);
        const userId = decodedToken.id;

        const response = await fetchUser(userId);
        setUserData(response.data);
      } catch (error) {
        console.error('Error loading user data:', error);
        setUserData(null);
      }
    };

    loadUser();
  }, [token]);

  useEffect(() => {
    if (userData?.profileImageUrl) {
      setImageUrl(userData.profileImageUrl);
    }
  }, [userData]);

  const isImporter = userRole === 'importer';
  const isProducer = userRole === 'producer';

  // Don't show header on public pages
  if (!token || (!isImporter && !isProducer)) {
    return null;
  }

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <Link href={isImporter ? '/importer' : '/producer'} className={styles.navLink}>
          <img src="/assets/Images/logo.png" alt="Journy" className={styles.logo} />
        </Link>
        <div className={styles.rightSection}>
          {isImporter ? (
            <>
              <Link href="/importer" className={styles.navLink}>
                Home
              </Link>
              <Link href="/importer/connect" className={styles.navLink}>
                Connect
              </Link>
            </>
          ) : (
            <>
              <Link href="/producer" className={styles.navLink}>
                Home
              </Link>
              <Link href="/producer/connections" className={styles.navLink}>
                Connection Requests
              </Link>
            </>
          )}

          <Link
            href="/profile"
            className={styles.navLink}
          >
            <div
              className={styles.profileImgContainer}
              style={imageUrl ? { background: '#ffffff' } : {}}
            >
              {imageUrl ? (
                <img
                  className={styles.profileImage}
                  src={imageUrl}
                  alt="Profile"
                />
              ) : (
                <div className={styles.profileCircle}>
                  <div className={styles.profileHead}></div>
                  <div className={styles.profileBody}></div>
                </div>
              )}
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}

