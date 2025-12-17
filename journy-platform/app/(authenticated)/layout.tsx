'use client';

import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import producerSidebarOptions from '@/lib/sidebarOptions/producerSidebarOptions';
import importerSidebarOptions from '@/lib/sidebarOptions/importerSidebarOptions';
import styles from '@/app/styles/appLayout.module.scss';

interface DecodedToken {
  id: number;
  role: string;
}

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOptions, setSidebarOptions] = useState(producerSidebarOptions);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get('token');

    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const decodedToken = jwtDecode<DecodedToken>(token);
      const role = (decodedToken.role || '').toLowerCase();

      if (role === 'importer') {
        setSidebarOptions(importerSidebarOptions);
      } else {
        setSidebarOptions(producerSidebarOptions);
      }
    } catch (error) {
      console.error('Error decoding token:', error);
      router.push('/login');
    }
  }, [router]);

  return (
    <>
      <Header />
      <div className={styles.appLayout}>
        <Sidebar sidebarOptions={sidebarOptions} />
        <main className={styles.mainContent}>{children}</main>
      </div>
    </>
  );
}

