import { useEffect, useState } from 'react';
import { signIn } from '../../Services/Httpclient';
import Cookies from 'js-cookie';
import { NavLink, useNavigate } from 'react-router-dom';
import styles from '../../styles/login.module.scss';
import { LoadingModal } from '../layout/LoadingModal';
import logo from '/assets/Images/logo.png';
import { Modal } from '../layout/Modal';
import { ResetPasswordModal } from './ResetPasswordModal';
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
import { jwtDecode } from 'jwt-decode';

export const SigninAccountForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [translatedText, setTranslatedText] = useState({});
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const [language, setLanguage] = useState(
    localStorage.getItem('language') || ''
  );

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

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

  const navigate = useNavigate(); // Initialize useNavigate

  const showModal = (message) => {
    setModalMessage(message);
  };

  const handleModalClose = () => {
    setModalMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await signIn(email, password);
      Cookies.set('token', response.token);

      setEmail('');
      setPassword('');

      // Decode token to get user role
      const decodedToken = jwtDecode(response.token);
      const userRole = decodedToken.Role || decodedToken.role;
      if (userRole === 'Importer') {
        navigate('/importer');
      } else if (userRole === 'Producer') {
        navigate('/producer');
      } else {
        // fallback, go to home or show error
        navigate('/');
      }

      showModal(translatedText['User successfully logged in']);
    } catch (error) {
      console.error(error);
      showModal(translatedText['Username or Password is invalid, Try again.']);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className={styles.loginWrapper}>
        <NavLink to='/'>
          <img src={logo} alt='Journy Logo' className={styles.logo} />
        </NavLink>
        {loading && <LoadingModal translatedText={translatedText} />}
        <h1 className={styles.loginTitle}>{translatedText['Log in']}</h1>
        <div className={styles.contentBox}>
          <form onSubmit={handleSubmit} className={styles.formLogin}>
            <div className={styles.formGroup}>
              <label>{translatedText['Email']} </label>
              <input
                type='text'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.inputField}
              />
            </div>
            <div className={styles.formGroup}>
              <label>{translatedText['Password']} </label>
              <input
                type='password'
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
                translatedText['Log in']
              )}
            </button>
            <div
              className={styles.forgotPassword}
              onClick={() => setIsPasswordModalOpen(true)}
            >
              {translatedText['Forgot password']}?
            </div>
          </form>

          <ResetPasswordModal
            isOpen={isPasswordModalOpen}
            onClose={() => setIsPasswordModalOpen(false)}
            translatedText={translatedText}
          />
        </div>
        <div className={styles.footer}>
          © Journy2025 {translatedText['all rights reserved']}
        </div>
      </div>
      <Modal
        message={modalMessage}
        onClose={handleModalClose}
        translatedText={translatedText}
      />
    </>
  );
};
