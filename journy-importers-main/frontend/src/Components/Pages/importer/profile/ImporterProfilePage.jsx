import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { fetchUser } from '../../../../Services/Httpclient';
import styles from '../../../../styles/ProfilePage.module.scss';
import { LoadingModal } from '../../../layout/LoadingModal';
import { Header } from '../../../layout/Header';
import en from '../../../../Utils/languages/profile/en.json';
import it from '../../../../Utils/languages/profile/it.json';
import fr from '../../../../Utils/languages/profile/fr.json';
import es from '../../../../Utils/languages/profile/es.json';
import sv from '../../../../Utils/languages/profile/sv.json';
import pt from '../../../../Utils/languages/profile/pt.json';
import el from '../../../../Utils/languages/profile/el.json';
import bg from '../../../../Utils/languages/profile/bg.json';
import hr from '../../../../Utils/languages/profile/hr.json';
import cs from '../../../../Utils/languages/profile/cs.json';
import da from '../../../../Utils/languages/profile/da.json';
import nl from '../../../../Utils/languages/profile/nl.json';
import et from '../../../../Utils/languages/profile/et.json';
import fi from '../../../../Utils/languages/profile/fi.json';
import de from '../../../../Utils/languages/profile/de.json';
import hu from '../../../../Utils/languages/profile/hu.json';
import ga from '../../../../Utils/languages/profile/ga.json';
import lv from '../../../../Utils/languages/profile/lv.json';
import lt from '../../../../Utils/languages/profile/lt.json';
import mt from '../../../../Utils/languages/profile/mt.json';
import pl from '../../../../Utils/languages/profile/pl.json';
import ro from '../../../../Utils/languages/profile/ro.json';
import sk from '../../../../Utils/languages/profile/sk.json';
import sl from '../../../../Utils/languages/profile/sl.json';
import { Footer } from '../../../layout/Footer';

const ImporterProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [translatedText, setTranslatedText] = useState({});
  const [language, setLanguage] = useState(
    localStorage.getItem('language') || ''
  );
  const [imageUrl, setImageUrl] = useState(null);

  const navigate = useNavigate();
  const token = Cookies.get('token');

  const certificationOptions = [
    {
      value: 'SQNPI',
      label: 'SQNPI',
      image: '/assets/Images/SQPNI.png',
    },
    {
      value: 'KRAV',
      label: 'KRAV',
      image: '/assets/Images/Krav.png',
    },
    {
      value: 'EU_ORGANIC',
      label: 'EU Organic',
      image: '/assets/Images/EU.png',
    },
  ];

  useEffect(() => {
    const loadUser = async () => {
      try {
        if (!token) {
          setUserData(null);
          return;
        }

        const decodedToken = jwtDecode(token);
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
    localStorage.setItem('language', language);
  }, [language]);

  useEffect(() => {
    if (userData?.profileImageUrl) {
      setImageUrl(userData?.profileImageUrl);
    }
  }, [userData]);

  const handleLanguageChange = (e) => setLanguage(e.target.value);

  useEffect(() => {
    switch (language) {
      case 'en':
      default:
        setTranslatedText(en);
        break;
      case 'it':
        setTranslatedText(it);
        break;
      case 'fr':
        setTranslatedText(fr);
        break;
      case 'es':
        setTranslatedText(es);
        break;
      case 'sv':
        setTranslatedText(sv);
        break;
      case 'pt':
        setTranslatedText(pt);
        break;
      case 'el':
        setTranslatedText(el);
        break;
      case 'bg':
        setTranslatedText(bg);
        break;
      case 'hr':
        setTranslatedText(hr);
        break;
      case 'cs':
        setTranslatedText(cs);
        break;
      case 'da':
        setTranslatedText(da);
        break;
      case 'nl':
        setTranslatedText(nl);
        break;
      case 'et':
        setTranslatedText(et);
        break;
      case 'fi':
        setTranslatedText(fi);
        break;
      case 'de':
        setTranslatedText(de);
        break;
      case 'hu':
        setTranslatedText(hu);
        break;
      case 'ga':
        setTranslatedText(ga);
        break;
      case 'lv':
        setTranslatedText(lv);
        break;
      case 'lt':
        setTranslatedText(lt);
        break;
      case 'mt':
        setTranslatedText(mt);
        break;
      case 'pl':
        setTranslatedText(pl);
        break;
      case 'ro':
        setTranslatedText(ro);
        break;
      case 'sk':
        setTranslatedText(sk);
        break;
      case 'sl':
        setTranslatedText(sl);
        break;
    }
  }, [language]);

  const handleLogout = () => {
    // Add logout logic here
  };

  if (!userData)
    return (
      <div>
        <LoadingModal isLoading={true} translatedText={translatedText} />
      </div>
    );

  return (
    <>
      <div className={styles.header}>
        <Header />
        <div className={styles.navigationContainer}>
          <img
            src='/assets/Images/logo.png'
            alt='Company Logo'
            className={styles.logo}
          />
          <div className={styles.backNavigation}>
            <button type='button' onClick={() => navigate(-1)}>
              {translatedText['Back']}
            </button>
          </div>
        </div>
      </div>

      <div className={styles.container}>
        <h1 className={styles.profileH1}>Profile</h1>

        <div className={styles.buttons}>
          <NavLink to='/importer/profile/edit' className={styles.btnProfile}>
            {translatedText['Edit']}
            <img src='/assets/Images/pencil.png' alt='edit' />
          </NavLink>

          <NavLink
            to='/importer/profile/settings'
            className={styles.btnProfile}
          >
            {translatedText['Settings']}
            <img src='/assets/Images/settings.png' alt='settings' />
          </NavLink>

          <button
            className={styles.btnProfile}
            onClick={() => {
              Cookies.remove('token');
              window.location.href = '/login';
            }}
          >
            {translatedText['Log Out']}
            <img src='/assets/Images/logout.png' alt='logout' />
          </button>
        </div>

        <div className={styles.imageUpload}>
          <div
            className={styles.imagePreview}
            style={imageUrl && { background: '#ffffff' }}
          >
            {imageUrl ? (
              <img src={imageUrl} alt='Preview' />
            ) : (
              <div className={styles.uploadPlaceholder}>
                <img
                  className={styles.uploadImage}
                  src='/assets/Images/uploadImage1.png'
                  alt='Upload-image'
                />
              </div>
            )}
          </div>
        </div>

        <form className={styles.formGroup}>
          <div className={styles.formTitle}>
            {translatedText['Information']}
          </div>
          <div>
            <label className={styles.label}>
              {translatedText['Company Name']}:
            </label>
            <div className={styles.inputFieldCompany} aria-label='Company name'>
              {userData.company}
            </div>
          </div>

          <div>
            <label className={styles.label}>{translatedText['Country']}:</label>
            <input
              className={styles.inputField}
              type='text'
              value={userData.country}
              disabled
            />
          </div>
          <div>
            <label className={styles.label}>
              {translatedText['District']}:
            </label>
            <input
              className={styles.inputField}
              type='text'
              value={userData.district}
              disabled
            />
          </div>

          <div>
            <label className={styles.label}>{translatedText['Region']}:</label>
            <input
              className={styles.inputField}
              type='text'
              value={userData.region}
              disabled
            />
          </div>

          <div>
            <label className={styles.label}>{translatedText['Address']}:</label>
            <input
              className={styles.inputField}
              type='text'
              value={userData.address}
              disabled
            />
          </div>
        </form>
      </div>
      <Footer translatedText={translatedText} />
    </>
  );
};

export default ImporterProfilePage;
