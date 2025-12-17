import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/importerPage.module.scss';
import en from '../../Utils/languages/producerPage/en.json';
import it from '../../Utils/languages/producerPage/it.json';
import fr from '../../Utils/languages/producerPage/fr.json';
import es from '../../Utils/languages/producerPage/es.json';
import sv from '../../Utils/languages/producerPage/sv.json';
import pt from '../../Utils/languages/producerPage/pt.json';
import el from '../../Utils/languages/producerPage/el.json';
import bg from '../../Utils/languages/producerPage/bg.json';
import hr from '../../Utils/languages/producerPage/hr.json';
import cs from '../../Utils/languages/producerPage/cs.json';
import da from '../../Utils/languages/producerPage/da.json';
import nl from '../../Utils/languages/producerPage/nl.json';
import et from '../../Utils/languages/producerPage/et.json';
import fi from '../../Utils/languages/producerPage/fi.json';
import de from '../../Utils/languages/producerPage/de.json';
import hu from '../../Utils/languages/producerPage/hu.json';
import ga from '../../Utils/languages/producerPage/ga.json';
import lv from '../../Utils/languages/producerPage/lv.json';
import lt from '../../Utils/languages/producerPage/lt.json';
import mt from '../../Utils/languages/producerPage/mt.json';
import pl from '../../Utils/languages/producerPage/pl.json';
import ro from '../../Utils/languages/producerPage/ro.json';
import sk from '../../Utils/languages/producerPage/sk.json';
import sl from '../../Utils/languages/producerPage/sl.json';
import { Header } from '../layout/Header';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import {
  getAllUsers,
  getPublishedWines,
} from '../../Services/connectionService';
import { fetchUser } from '../../Services/Httpclient';
import { Footer } from '../layout/Footer';

export const ImporterPage = () => {
  const [loading, setLoading] = useState(false);
  const [translatedText, setTranslatedText] = useState({});
  const [language, setLanguage] = useState(
    localStorage.getItem('language') || ''
  );
  const [syncedProducts, setSyncedProducts] = useState({});
  const [publishedWines, setPublishedWines] = useState(null);
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [userLoading, setUserLoading] = useState(true);

  const navigate = useNavigate();

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
    const loadUsers = async () => {
      try {
        const userList = await getAllUsers();
        setUsers(userList);
      } catch (error) {
        console.error('Error loading users:', error);
        setError('Failed to load users');
      }
    };

    loadUsers();
  }, []);

  useEffect(() => {
    const handleUser = async () => {
      try {
        setUserLoading(true);
        const token = Cookies.get('token');
        if (!token) {
          throw new Error('No token found');
        }
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.id;

        const response = await fetchUser(userId);
        if (response.data) {
          setUser(response.data);
        } else {
          throw new Error('Failed to fetch user data');
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        setError('Failed to fetch user data');
        navigate('/login');
      } finally {
        setUserLoading(false);
      }
    };

    handleUser();
  }, []);

  useEffect(() => {
    const fetchPublishedWines = async () => {
      try {
        setLoading(true);
        setError(null);
        const wines = await getPublishedWines();
        setPublishedWines(wines);
      } catch (err) {
        setError(err.message || 'Failed to fetch published wines');
        console.error('Error fetching published wines:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPublishedWines();
  }, []);

  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      const userRole = decodedToken.Role || decodedToken.role;
      if (userRole === 'Producer') {
        navigate('/producer');
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    // Load synced products from localStorage
    const synced = JSON.parse(localStorage.getItem('syncedProducts') || '{}');
    setSyncedProducts(synced);
  }, []);

  return (
    <>
      <Header />
      <div className={styles.pageWrapper}>
        <div className={styles.headerSection}>
          <h1 className={styles.pageTitle}>
            {userLoading
              ? translatedText['Loading']
              : user
              ? `${translatedText['Welcome']} ${user.fullName}!`
              : translatedText['Welcome']}
          </h1>
        </div>

        <div className={styles.productGrid}>
          {loading ? (
            <p className={styles.loadingText}>{translatedText['Loading']}...</p>
          ) : publishedWines?.length > 0 ? (
            <div className={styles.productList}>
              {publishedWines.map((wine) => (
                <div key={wine.WineID} className={styles['product-card']}>
                  {syncedProducts[wine.WineID] && (
                    <span className={styles.syncedBadge}>
                      {'Synced'}
                    </span>
                  )}
                  <div className={styles['image-container']}>
                    {wine.ImageURL ? (
                      <img
                        src={wine.ImageURL}
                        alt={wine.Name}
                        className={styles['product-image']}
                      />
                    ) : (
                      <div className={styles['placeholder-image']}></div>
                    )}
                  </div>
                  <div className={styles['product-info']}>
                    <h3 className={styles['product-title']}>{wine.Name}</h3>
                    <div className={styles['wine-details']}>
                      <p>
                        <strong>Producer:</strong>{' '}
                        {users.find((user) => user.UserID === wine.UserID)
                          ?.FullName || 'Unknown Producer'}
                      </p>
                    </div>
                  </div>
                  <button
                    className={styles['details-button']}
                    onClick={() => navigate(`/importer/product/${wine.WineID}`)}
                  >
                    {translatedText['View']}
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.noProductsMessage}>
              <p>No imported wines available.</p>
              <p>Connect with producers to see their wines here.</p>
              <button
                className={styles.connectButton}
                onClick={() => navigate('/importer/connect')}
              >
                Find Producers
              </button>
            </div>
          )}
        </div>
      </div>
      <Footer translatedText={translatedText} />
    </>
  );
};
