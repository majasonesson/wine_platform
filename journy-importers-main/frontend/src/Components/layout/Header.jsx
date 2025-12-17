import { NavLink } from 'react-router-dom';
import styles from '../../styles/header.module.scss';
import logo from '/assets/Images/logo.png';
import en from '../../Utils/languages/homePage/en.json';
import it from '../../Utils/languages/homePage/it.json';
import fr from '../../Utils/languages/homePage/fr.json';
import es from '../../Utils/languages/homePage/es.json';
import sv from '../../Utils/languages/homePage/sv.json';
import pt from '../../Utils/languages/homePage/pt.json';
import el from '../../Utils/languages/homePage/el.json';
import bg from '../../Utils/languages/homePage/bg.json';
import hr from '../../Utils/languages/homePage/hr.json';
import cs from '../../Utils/languages/homePage/cs.json';
import da from '../../Utils/languages/homePage/da.json';
import nl from '../../Utils/languages/homePage/nl.json';
import et from '../../Utils/languages/homePage/et.json';
import fi from '../../Utils/languages/homePage/fi.json';
import de from '../../Utils/languages/homePage/de.json';
import hu from '../../Utils/languages/homePage/hu.json';
import ga from '../../Utils/languages/homePage/ga.json';
import lv from '../../Utils/languages/homePage/lv.json';
import lt from '../../Utils/languages/homePage/lt.json';
import mt from '../../Utils/languages/homePage/mt.json';
import pl from '../../Utils/languages/homePage/pl.json';
import ro from '../../Utils/languages/homePage/ro.json';
import sk from '../../Utils/languages/homePage/sk.json';
import sl from '../../Utils/languages/homePage/sl.json';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { fetchUser } from '../../Services/Httpclient';

export const Header = () => {
  const [translatedText, setTranslatedText] = useState({});
  const [language, setLanguage] = useState(
    localStorage.getItem('language') || ''
  );
  const [userData, setUserData] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [userRole, setUserRole] = useState(null);

  const token = Cookies.get('token');

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  useEffect(() => {
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const role = (decodedToken.Role || decodedToken.role || '').toLowerCase();
        setUserRole(role);
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }, [token]);

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
    if (userData?.profileImageUrl) {
      setImageUrl(userData?.profileImageUrl);
    }
  }, [userData]);

  const isImporter = userRole === 'importer';

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <NavLink to={isImporter ? '/importer' : '/producer'} className={styles.navLink}>
          <img src={logo} alt='Journy' className={styles.logo} />
        </NavLink>
        <div className={styles.rightSection}>
          {isImporter ? (
            <>
              <NavLink to='/importer' className={styles.navLink}>
                {translatedText['Home'] || 'Home'}
              </NavLink>
              <NavLink to='/importer/connect' className={styles.navLink}>
                {'Connect'}
              </NavLink>
            </>
          ) : (
            <>
              <NavLink to='/producer' className={styles.navLink}>
                {translatedText['Home']}
              </NavLink>
              <NavLink to='/producer/connections' className={styles.navLink}>
                {translatedText['Connection Requests'] || 'Connection Requests'}
              </NavLink>
            </>
          )}

          <NavLink to={isImporter ? '/importer/profile' : '/producer/profile'} className={styles.navLink}>
            <div
              className={styles.profileImgContainer}
              style={imageUrl && { background: '#ffffff' }}
            >
              {imageUrl ? (
                <img
                  className={styles.profileImage}
                  src={imageUrl}
                  alt='Preview'
                />
              ) : (
                <div className={styles.profileCircle}>
                  <div className={styles.profileHead}></div>
                  <div className={styles.profileBody}></div>
                </div>
              )}
            </div>
          </NavLink>
        </div>
      </div>
    </header>
  );
};
