'use client';

import { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from '@/app/styles/login.module.scss';
import { LoadingModal } from '@/components/layout/LoadingModal';
import { Modal } from '@/components/layout/Modal';
import { ResetPasswordModal } from '@/components/auth/ResetPasswordModal';

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

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [translatedText, setTranslatedText] = useState<Record<string, string>>({});
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [language, setLanguage] = useState('en');
  const router = useRouter();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

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
      en, it, fr, es, sv, pt, el, bg, hr, cs, da, nl, et, fi, de, hu, ga, lv, lt, mt, pl, ro, sk, sl,
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
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      const user = data.user;
      const rawRole = user?.user_metadata?.role; // 'Producer' eller 'Distributor'
      const roleTable = rawRole?.toLowerCase(); 

      if (!roleTable) {
        window.location.href = '/';
        return;
      }

      // Hämta profil för att kontrollera Steg 2 och Steg 3
      const { data: profile } = await supabase
        .from(roleTable)
        .select('company_name, founding_team_type')
        .eq('user_id', user.id)
        .single();

      // LOGIK FÖR SMART REDIRECT
      let targetPath = `/onboarding/${roleTable}/step-2`; // Default startpunkt

      if (profile) {
        const hasStep2 = profile.company_name && profile.company_name.trim() !== '';
        const hasStep3 = profile.founding_team_type && profile.founding_team_type !== 'not_specified';

        if (hasStep2 && hasStep3) {
          // Både företagsuppgifter och diversity är ifyllt -> Gå till Dashboard
          targetPath = `/dashboard/${roleTable}`;
        } else if (hasStep2) {
          // Har gjort företagsuppgifter men inte diversity -> Skicka till Steg 3
          targetPath = `/onboarding/${roleTable}/step-3`;
        }
      }

      // Tvinga hård omdirigering för att Middleware ska uppfatta sessionen korrekt
      window.location.href = targetPath;

    } catch (error: any) {
      console.error('Login Error:', error.message);
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
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.inputField}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>{translatedText['Password'] || 'Password'} </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.inputField}
                required
              />
            </div>

            <button
              type="submit"
              className={styles.loginButton}
              disabled={loading}
            >
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
            onSubmit={() => { }}
            translatedText={translatedText}
          />
        </div>
        <div className={styles.footer}>
          © Journy 2025 {translatedText['all rights reserved'] || 'all rights reserved'}
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