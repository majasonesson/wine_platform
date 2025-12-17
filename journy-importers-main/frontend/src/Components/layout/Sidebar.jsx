import { useEffect, useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { fetchUser } from '../../Services/Httpclient';
import styles from '../../styles/sidebar.module.scss';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import en from '../../Utils/languages/auth/en.json';
import it from '../../Utils/languages/auth/it.json';
import fr from '../../Utils/languages/auth/fr.json';
import es from '../../Utils/languages/auth/es.json';
import sv from '../../Utils/languages/auth/sv.json';
import pt from '../../Utils/languages/auth/pt.json';
import el from '../../Utils/languages/auth/el.json';
import bg from '../../Utils/languages/auth/bg.json';
import hr from '../../Utils/languages/auth/hr.json';
import cs from '../../Utils/languages/auth/cs.json';
import da from '../../Utils/languages/auth/da.json';
import nl from '../../Utils/languages/auth/nl.json';
import et from '../../Utils/languages/auth/et.json';
import fi from '../../Utils/languages/auth/fi.json';
import de from '../../Utils/languages/auth/de.json';
import hu from '../../Utils/languages/auth/hu.json';
import ga from '../../Utils/languages/auth/ga.json';
import lv from '../../Utils/languages/auth/lv.json';
import lt from '../../Utils/languages/auth/lt.json';
import mt from '../../Utils/languages/auth/mt.json';
import pl from '../../Utils/languages/auth/pl.json';
import ro from '../../Utils/languages/auth/ro.json';
import sk from '../../Utils/languages/auth/sk.json';
import sl from '../../Utils/languages/auth/sl.json';

export const Sidebar = ({ sidebarOptions }) => {
  const [user, setUser] = useState(null);
  const [translatedText, setTranslatedText] = useState({});
  const [language, setLanguage] = useState(
    localStorage.getItem('language') || ''
  );

  const token = Cookies.get('token');

  const handleUser = async () => {
    try {
      if (!token) {
        throw new Error('No token found');
      }
      const decodedToken = jwtDecode(token);
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
    localStorage.setItem('language', language);
  }, [language]);

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
    handleUser();
  }, []);

  const userFullName = user ? user.FullName : 'Guest';
  // const companyName = user ? user.Company : 'No company';

  const styleActiveLink = ({ isActive }) => {
    return isActive
      ? {
          backgroundColor: '#FF7373',
        }
      : {};
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.profileContainer}>
        <div
          className={styles.profileImage}
          style={{
            backgroundImage: user?.profileImage
              ? `url(${user.profileImage})`
              : 'none',
          }}
        />
        <h1 className={styles.username}>{userFullName}</h1>
        <ul className={styles.navLinks}>
          {sidebarOptions.map((option, i) => {
            return (
              <NavLink to={option.to} style={styleActiveLink} key={i} className={styles.navLink}>
                <img src={option.img} alt={option.alt} className={styles.navIcon} />
                {option.text}
              </NavLink>
            );
          })}
        </ul>
        {/* <h2 className={styles.companyname}>{companyName} </h2> */}
      </div>
      <div className={styles.logoutContainer}>
        <button
          onClick={() => {
            Cookies.remove('token');
            window.location.href = '/login';
          }}
          className={styles.logoutButton}
        >
          {translatedText['Log out']}
        </button>
        <h2 className={styles.logo}>Journy</h2>
      </div>
    </div>
  );
};
