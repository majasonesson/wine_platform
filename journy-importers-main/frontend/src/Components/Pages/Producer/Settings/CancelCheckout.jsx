import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../../../styles/SuccessModal.module.scss';
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

export const CancelCheckout = () => {
  const [translatedText, setTranslatedText] = useState({});
  const [language, setLanguage] = useState(
    localStorage.getItem('language') || ''
  );

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

  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/producer/profile/settings');
    }, 1000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <p>{translatedText['Redirecting to settings']}...</p>
      </div>
    </div>
  );
};
