'use client';

import { useEffect, useState } from 'react';
import { signIn } from '@/lib/api-client';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from '@/app/styles/login.module.scss';
import { LoadingModal } from '@/components/layout/LoadingModal';
import { Modal } from '@/components/layout/Modal';
import { ResetPasswordModal } from '@/components/auth/ResetPasswordModal';
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

interface DecodedToken {
  id: number;
  Role?: string;
  role?: string;
}

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [translatedText, setTranslatedText] = useState<Record<string, string>>({});
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [language, setLanguage] = useState('en');
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('language') || 'en';
      setLanguage(savedLang);
    }
  }, []);

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

  const showModal = (message: string) => {
    setModalMessage(message);
  };

  const handleModalClose = () => {
    setModalMessage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await signIn(email, password);
      Cookies.set('token', response.token);

      setEmail('');
      setPassword('');

      // Decode token to get user role
      const decodedToken = jwtDecode<DecodedToken>(response.token);
      const userRole = decodedToken.Role || decodedToken.role;
      if (userRole === 'Importer') {
        router.push('/importer');
      } else if (userRole === 'Producer') {
        router.push('/producer');
      } else {
        router.push('/');
      }

      showModal(translatedText['User successfully logged in'] || 'User successfully logged in');
    } catch (error) {
      console.error(error);
      showModal(
        translatedText['Username or Password is invalid, Try again.'] ||
          'Username or Password is invalid, Try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className={styles.loginWrapper}>
        <Link href="/">
          <img src="/assets/Images/logo.png" alt="Journy Logo" className={styles.logo} />
        </Link>
        {loading && <LoadingModal isLoading={loading} translatedText={translatedText} />}
        <h1 className={styles.loginTitle}>{translatedText['Log in'] || 'Log in'}</h1>
        <div className={styles.contentBox}>
          <form onSubmit={handleSubmit} className={styles.formLogin}>
            <div className={styles.formGroup}>
              <label>{translatedText['Email'] || 'Email'} </label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.inputField}
              />
            </div>
            <div className={styles.formGroup}>
              <label>{translatedText['Password'] || 'Password'} </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.inputField}
              />
            </div>

            <button className={styles.loginButton} disabled={loading}>
              {loading ? (
                <span className={styles.spinnerWrapper}>
                  <span className={styles.spinner}></span>
                </span>
              ) : (
                translatedText['Log in'] || 'Log in'
              )}
            </button>
            <div
              className={styles.forgotPassword}
              onClick={() => setIsPasswordModalOpen(true)}
            >
              {translatedText['Forgot password'] || 'Forgot password'}?
            </div>
          </form>

          <ResetPasswordModal
            isOpen={isPasswordModalOpen}
            onClose={() => setIsPasswordModalOpen(false)}
            onSubmit={() => {}}
            translatedText={translatedText}
          />
        </div>
        <div className={styles.footer}>
          © Journy2025 {translatedText['all rights reserved'] || 'all rights reserved'}
        </div>
      </div>
      <Modal
        message={modalMessage}
        onClose={handleModalClose}
        translatedText={translatedText}
      />
    </>
  );
}
