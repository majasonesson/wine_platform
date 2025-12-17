import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { createPassword } from '../../Services/Httpclient';
import { useNavigate } from 'react-router-dom';
import { Modal } from '../layout/Modal';
import styles from './ResetPasswordForm.module.scss';
import en from '../../Utils/languages/passwordForm/en.json';
import it from '../../Utils/languages/passwordForm/it.json';
import fr from '../../Utils/languages/passwordForm/fr.json';
import es from '../../Utils/languages/passwordForm/es.json';
import sv from '../../Utils/languages/passwordForm/sv.json';
import pt from '../../Utils/languages/passwordForm/pt.json';
import el from '../../Utils/languages/passwordForm/el.json';
import bg from '../../Utils/languages/passwordForm/bg.json';
import hr from '../../Utils/languages/passwordForm/hr.json';
import cs from '../../Utils/languages/passwordForm/cs.json';
import da from '../../Utils/languages/passwordForm/da.json';
import nl from '../../Utils/languages/passwordForm/nl.json';
import et from '../../Utils/languages/passwordForm/et.json';
import fi from '../../Utils/languages/passwordForm/fi.json';
import de from '../../Utils/languages/passwordForm/de.json';
import hu from '../../Utils/languages/passwordForm/hu.json';
import ga from '../../Utils/languages/passwordForm/ga.json';
import lv from '../../Utils/languages/passwordForm/lv.json';
import lt from '../../Utils/languages/passwordForm/lt.json';
import mt from '../../Utils/languages/passwordForm/mt.json';
import pl from '../../Utils/languages/passwordForm/pl.json';
import ro from '../../Utils/languages/passwordForm/ro.json';
import sk from '../../Utils/languages/passwordForm/sk.json';
import sl from '../../Utils/languages/passwordForm/sl.json';

const ResetPasswordForm = () => {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [translatedText, setTranslatedText] = useState({});
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
    try {
      await createPassword(newPassword, token);
      setNewPassword('');
      showModal(translatedText['Password updated successfully!']);
      navigate('/login');
    } catch (error) {
      console.error('Error updating password:', error);
      showModal(translatedText['Failed to update password. Please try again.']);
    }
  };

  return (
    <>
      <div className={styles.resetPasswordWrapper}>
        <div className={styles.resetPasswordContainer}>
          <h1 className={styles.resetTitle}>
            {translatedText['Create New Password']}
          </h1>
          <form onSubmit={handleSubmit} className={styles.resetForm}>
            <div className={styles.formGroup}>
              <label>{translatedText['New Password']} </label>
              <input
                type='password'
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={styles.inputField}
              />
            </div>
            <div className={styles.buttonContainer}>
              <button className={styles.resetButton}>Change Password</button>
            </div>
          </form>
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

export default ResetPasswordForm;
