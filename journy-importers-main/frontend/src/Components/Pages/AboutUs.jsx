import { NavLink } from 'react-router-dom';
import styles from '../../styles/aboutUs.module.scss';
import journyLogo from '/public/assets/Images/Logo.png';
import aboutUsVideo from '/public/assets/Videos/AboutUs.mp4';
import MajaImg from '/public/assets/Images/Maja.jpg';
import markusImg from '/public/assets/Images/markus.jpg';
import en from '../../Utils/languages/aboutUs/en.json';
import it from '../../Utils/languages/aboutUs/it.json';
import fr from '../../Utils/languages/aboutUs/fr.json';
import es from '../../Utils/languages/aboutUs/es.json';
import sv from '../../Utils/languages/aboutUs/sv.json';
import pt from '../../Utils/languages/aboutUs/pt.json';
import el from '../../Utils/languages/aboutUs/el.json';
import bg from '../../Utils/languages/aboutUs/bg.json';
import hr from '../../Utils/languages/aboutUs/hr.json';
import cs from '../../Utils/languages/aboutUs/cs.json';
import da from '../../Utils/languages/aboutUs/da.json';
import nl from '../../Utils/languages/aboutUs/nl.json';
import et from '../../Utils/languages/aboutUs/et.json';
import fi from '../../Utils/languages/aboutUs/fi.json';
import de from '../../Utils/languages/aboutUs/de.json';
import hu from '../../Utils/languages/aboutUs/hu.json';
import ga from '../../Utils/languages/aboutUs/ga.json';
import lv from '../../Utils/languages/aboutUs/lv.json';
import lt from '../../Utils/languages/aboutUs/lt.json';
import mt from '../../Utils/languages/aboutUs/mt.json';
import pl from '../../Utils/languages/aboutUs/pl.json';
import ro from '../../Utils/languages/aboutUs/ro.json';
import sk from '../../Utils/languages/aboutUs/sk.json';
import sl from '../../Utils/languages/aboutUs/sl.json';
import { useEffect, useState } from 'react';
import { SelectLanguage } from '../layout/SelectLanguage';
import { Footer } from '../layout/Footer';
export const AboutUs = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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

  return (
    <div className={styles.aboutUsContainer}>
      {/* Header Video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        preload='metadata'
        controls={false}
        className={styles.headerVideo}
      >
        <source src={aboutUsVideo} type='video/mp4' />
      </video>

      {/* Navbar */}
      <nav className={styles.navbar}>
        <div className={styles['nav-content']}>
          <NavLink to='/' className={styles.navLink}>
            <img src={journyLogo} alt='Journy Logo' className={styles.logo} />
          </NavLink>

          <button
            className={`${styles.hamburger} ${isMenuOpen ? styles.active : ''}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          <div
            className={`${styles.navLinks} ${isMenuOpen ? styles.active : ''}`}
          >
            <SelectLanguage
              handleLanguageChange={handleLanguageChange}
              language={language}
              styles={styles.languageSelect}
            />
            <NavLink to='/' className={styles.navLink}>
              {translatedText['Home']}
            </NavLink>
            <NavLink to='/login' className={styles.navLink}>
              {translatedText['Log in']}
            </NavLink>
            <NavLink to='/signup' className={styles.signupButton}>
              {translatedText['Sign up']}
            </NavLink>
          </div>
        </div>
      </nav>

      {/* <div className={styles.hamburger} onClick={() => setIsOpen(!isOpen)}>
        <span></span>
        <span>
          {' '}
          <NavLink to='/' className={styles.navLink}>
            Home
          </NavLink>
          <NavLink to='/login' className={styles.navLink}>
            Log in
          </NavLink>
        </span>
        <span>
          <NavLink to='/coming-soon' className={styles.signupButton}>
            Sign up
          </NavLink>
        </span>
      </div> */}

      <div className={styles.transparencySection}>
        <h1 className={styles.transparencyTitle}>
          {translatedText['Transparency']}
          <br />
          {translatedText['meets']}&nbsp;
          <span className={styles.traditionText}>
            {translatedText['tradition']}
          </span>
        </h1>
        <p className={styles.transparencyText}>
          {translatedText['WHO ARE WE text']}.
        </p>
      </div>

      <div className={styles.teamContainer}>
        <span className={styles.whoAreWe}>{translatedText['WHO ARE WE']}</span>
        <h2 className={styles.ourTeam}>{translatedText['OUR TEAM']}</h2>
        <div className={styles.teamMembers}>
          <div className={styles.teamMember}>
            <img
              src={MajaImg}
              alt={translatedText['Team member']}
              className={styles.memberImage}
            />
            <h3 className={styles.memberName}>Maja Sonesson</h3>
            <p className={styles.memberRole}>
              {translatedText['Founder and CEO']}
            </p>
          </div>

          <div className={styles.teamMember}>
            <img
              src={markusImg}
              alt={translatedText['Team member']}
              className={styles.memberImage}
            />
            <h3 className={styles.memberName}>Markus Bielaszka</h3>
            <p className={styles.memberRole}>
              {translatedText['Blockchain Developer']}
            </p>
          </div>
        </div>
      </div>

      <div className={styles.storySection}>
        <div className={styles.storyHeader}>
          <h3 className={styles.ourStory}>{translatedText['OUR STORY']}</h3>
        </div>
        <div className={styles.storyContent}>
          <div className={styles.mainStory}>
            <p>{translatedText['OUR STORY text']}.</p>
          </div>
          <div className={styles.mainStory}>
            <p>{translatedText['New regulations text']}.</p>
          </div>

          <div className={styles.mainStory}>
            <p>{translatedText['Here to help text']}.</p>
          </div>
          <div className={styles.storyQuote}>
            <p>
              {translatedText['By combining cutting-edge technology text']}.
            </p>
          </div>
        </div>
      </div>

      <footer className={styles.footer}>
        <div className={styles.logoSection}>
          <img src={journyLogo} alt='Journy' className={styles.logo} />
        </div>

        <div className={styles.rightSection}>
          <div className={styles.linkColumn}>
            <a href='/signup'>{translatedText['Sign up']}</a>
            <a href='/login'>{translatedText['Log in']}</a>
          </div>
          <div className={styles.linkColumn}>
            <a href='/'>{translatedText['Home']}</a>
            <a href='/contact'>{translatedText['Contact']}</a>
          </div>
          <div className={styles.linkColumn}>
            <a href='/privacy'>{translatedText['Privacy Policy']}</a>
            <a href='/terms'>{translatedText['Terms & Conditions']}</a>
          </div>
        </div>

        <Footer translatedText={translatedText} />
      </footer>
    </div>
  );
};
