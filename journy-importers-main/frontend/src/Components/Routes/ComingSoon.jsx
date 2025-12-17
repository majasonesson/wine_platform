import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import styles from '../../styles/comingSoon.module.scss';
import en from '../../Utils/languages/comingSoon/en.json';
import it from '../../Utils/languages/comingSoon/it.json';
import fr from '../../Utils/languages/comingSoon/fr.json';
import es from '../../Utils/languages/comingSoon/es.json';
import sv from '../../Utils/languages/comingSoon/sv.json';
import pt from '../../Utils/languages/comingSoon/pt.json';
import el from '../../Utils/languages/comingSoon/el.json';
import bg from '../../Utils/languages/comingSoon/bg.json';
import hr from '../../Utils/languages/comingSoon/hr.json';
import cs from '../../Utils/languages/comingSoon/cs.json';
import da from '../../Utils/languages/comingSoon/da.json';
import nl from '../../Utils/languages/comingSoon/nl.json';
import et from '../../Utils/languages/comingSoon/et.json';
import fi from '../../Utils/languages/comingSoon/fi.json';
import de from '../../Utils/languages/comingSoon/de.json';
import hu from '../../Utils/languages/comingSoon/hu.json';
import ga from '../../Utils/languages/comingSoon/ga.json';
import lv from '../../Utils/languages/comingSoon/lv.json';
import lt from '../../Utils/languages/comingSoon/lt.json';
import mt from '../../Utils/languages/comingSoon/mt.json';
import pl from '../../Utils/languages/comingSoon/pl.json';
import ro from '../../Utils/languages/comingSoon/ro.json';
import sk from '../../Utils/languages/comingSoon/sk.json';
import sl from '../../Utils/languages/comingSoon/sl.json';

export const ComingSoon = () => {
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

  return (
    <div className={styles.container}>
      <nav className={styles.navbar}>
        <div className={styles.navContent}>
          <NavLink to='/'>
            <img src={'/assets/Images/logo.png'} alt='Journy Logo' className={styles.logo} />
          </NavLink>
        </div>
      </nav>

      <div className={styles.content}>
        <h1 className={styles.title}>{translatedText['Coming Soon']}</h1>
        <p className={styles.description}>
          {translatedText[`We're working hard to bring you something amazing. Stay tuned!`]}
        </p>
        <NavLink to='/' className={styles.backButton}>
          {translatedText['Back to Home']}
        </NavLink>
      </div>
    </div>
  );
};
