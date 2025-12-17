'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { fetchUser } from '@/lib/api-client';
import styles from '@/app/styles/sidebar.module.scss';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

// Import language files
import en from '@/lib/i18n/auth/en.json';
import it from '@/lib/i18n/auth/it.json';
import fr from '@/lib/i18n/auth/fr.json';
import es from '@/lib/i18n/auth/es.json';
import sv from '@/lib/i18n/auth/sv.json';
import pt from '@/lib/i18n/auth/pt.json';
import el from '@/lib/i18n/auth/el.json';
import bg from '@/lib/i18n/auth/bg.json';
import hr from '@/lib/i18n/auth/hr.json';
import cs from '@/lib/i18n/auth/cs.json';
import da from '@/lib/i18n/auth/da.json';
import nl from '@/lib/i18n/auth/nl.json';
import et from '@/lib/i18n/auth/et.json';
import fi from '@/lib/i18n/auth/fi.json';
import de from '@/lib/i18n/auth/de.json';
import hu from '@/lib/i18n/auth/hu.json';
import ga from '@/lib/i18n/auth/ga.json';
import lv from '@/lib/i18n/auth/lv.json';
import lt from '@/lib/i18n/auth/lt.json';
import mt from '@/lib/i18n/auth/mt.json';
import pl from '@/lib/i18n/auth/pl.json';
import ro from '@/lib/i18n/auth/ro.json';
import sk from '@/lib/i18n/auth/sk.json';
import sl from '@/lib/i18n/auth/sl.json';

interface SidebarOption {
  to: string;
  img: string;
  alt: string;
  text: string;
}

interface SidebarProps {
  sidebarOptions: SidebarOption[];
}

interface DecodedToken {
  id: number;
  role: string;
}

export const Sidebar = ({ sidebarOptions }: SidebarProps) => {
  const [user, setUser] = useState<any>(null);
  const [translatedText, setTranslatedText] = useState<Record<string, string>>({});
  const [language, setLanguage] = useState('en');
  const pathname = usePathname();

  const token = Cookies.get('token');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('language') || 'en';
      setLanguage(savedLang);
    }
  }, []);

  const handleUser = async () => {
    try {
      if (!token) {
        throw new Error('No token found');
      }
      const decodedToken = jwtDecode<DecodedToken>(token);
      const userId = decodedToken.id;

      const response = await fetchUser(userId);

      if (response.data && response.data.length > 0) {
        setUser(response.data[0]);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error fetching user', error);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', language);
    }
  }, [language]);

  useEffect(() => {
    const languages: Record<string, any> = {
      en,
      it,
      fr,
      es,
      sv,
      pt,
      el,
      bg,
      hr,
      cs,
      da,
      nl,
      et,
      fi,
      de,
      hu,
      ga,
      lv,
      lt,
      mt,
      pl,
      ro,
      sk,
      sl,
    };
    setTranslatedText(languages[language] || en);
  }, [language]);

  useEffect(() => {
    handleUser();
  }, []);

  const userFullName = user ? user.FullName : 'Guest';

  const isActiveLink = (path: string) => {
    return pathname === path;
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.profileContainer}>
        <div
          className={styles.profileImage}
          style={{
            backgroundImage: user?.profileImageUrl
              ? `url(${user.profileImageUrl})`
              : 'none',
          }}
        />
        <h1 className={styles.username}>{userFullName}</h1>
        <ul className={styles.navLinks}>
          {sidebarOptions.map((option, i) => {
            const active = isActiveLink(option.to);
            return (
              <Link
                href={option.to}
                key={i}
                className={styles.navLink}
                style={active ? { backgroundColor: '#FF7373' } : {}}
              >
                <img src={option.img} alt={option.alt} className={styles.navIcon} />
                {option.text}
              </Link>
            );
          })}
        </ul>
      </div>
      <div className={styles.logoutContainer}>
        <button
          onClick={() => {
            Cookies.remove('token');
            window.location.href = '/login';
          }}
          className={styles.logoutButton}
        >
          {translatedText['Log out'] || 'Log out'}
        </button>
        <h2 className={styles.logo}>Journy</h2>
      </div>
    </div>
  );
};

