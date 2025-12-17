import { useState, useEffect } from 'react';
import { getProducts, fetchUser } from '../../Services/Httpclient';
import { AddProductLink } from '../pages/Producer/addProductLink';
import { downloadQRCode } from '../../Utils/QRCode/downloadQRCode';
import { ProductCard } from './Product/WineCard/ProductCard';
import styles from '../../styles/producerPage.module.scss';
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
import { NavLink } from 'react-router-dom';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { Header } from '../layout/Header';
import { Footer } from '../layout/Footer';
import { useNavigate } from 'react-router-dom';

export const ProducerPage = () => {
  const [products, setProducts] = useState([]);
  const [showProducts, setShowProducts] = useState(false);
  const [loading, setLoading] = useState(false);
  const [translatedText, setTranslatedText] = useState({});
  const [user, setUser] = useState(null);
  const [language, setLanguage] = useState(
    localStorage.getItem('language') || ''
  );

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

  const handleProducts = async () => {
    try {
      setLoading(true);
      const response = await getProducts();
      setProducts(response);
      setShowProducts(true);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUser = async () => {
    try {
      const token = Cookies.get('token');
      if (!token) {
        throw new Error('No token found');
      }
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.id;

      const response = await fetchUser(userId);
      if (response.data) {
        setUser(response.data);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  useEffect(() => {
    handleProducts();
    handleUser();
  }, []);

  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      const userRole = decodedToken.Role || decodedToken.role;
      if (userRole === 'Importer') {
        navigate('/importer');
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  // Function to handle QR code download for a specific wine
  const handleDownloadQR = (wineId) => downloadQRCode(wineId);

  return (
    <>
      <Header />
      <div className={styles.pageWrapper}>
        {/* {loading && <LoadingModal translatedText={translatedText} />}*/}

        <div className={styles.headerSection}>
          <h1 className={styles.pageTitle}>
            {translatedText['Welcome']} {user?.fullName}!
          </h1>
          <div className={styles.addProductButton}>
            <AddProductLink translatedText={translatedText} user={user} />
          </div>
        </div>

        <div className={styles.productGrid}>
          {products && products.length > 0 ? (
            <ul className={styles.productList}>
              {products.map((product) => (
                <li
                  key={product.WineID}
                  className={styles.productListItem}
                >
                  <ProductCard
                    product={product}
                    setProducts={setProducts}
                    translatedText={translatedText}
                    onDownloadQR={() => handleDownloadQR(product.WineID)}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.noProductsMessage}>
              {translatedText['No products available']}
            </p>
          )}
        </div>
      </div>
      <Footer translatedText={translatedText} />
    </>
  );
};
