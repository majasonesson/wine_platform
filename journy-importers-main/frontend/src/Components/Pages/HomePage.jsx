import { NavLink } from 'react-router-dom';
import styles from '../../styles/homePage.module.scss';
import journyLogo from '/assets/Images/logo.png';
import arrowIcon from '/assets/Images/arrow.svg';
import wineTellsStory from '/assets/Images/WineTellsAStory.png';
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
import bild1 from '/assets/Images/bild1.png';
import bild2 from '/assets/Images/bild2.jpg';
import bild3 from '/assets/Images/bild3.jpg';
import bild4 from '/assets/Images/bild4.png';
import labelInteractionMobile from '/assets/Images/ContentMobile.png';
import { useState, useRef, useEffect } from 'react';
import { SelectLanguage } from '../layout/SelectLanguage';
import { Footer } from '../layout/Footer';

export const Home = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [expandedCard, setExpandedCard] = useState(null);
  const faqRef = useRef(null);
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

  const faqData = [
    {
      question: translatedText['What is Journy?'],
      answer: translatedText['What is Journy text'],
    },
    {
      question: translatedText['How do E-labels work?'],
      answer: translatedText['How do E-labels work text'],
    },
    {
      question: translatedText['How many e-labels will I need?'],
      answer: `${translatedText['How many e-labels will I need text']}<br/><br/>
        ${translatedText['How many e-labels will I need 2025']}<br/><br/>
        ${translatedText['How many e-labels will I need 2026']}`,
      hasMore: true,
    },
    {
      question:
        translatedText[
          'Once I print the QR codes, can I edit the information?'
        ],
      answer: translatedText['QR codes edit information text'],
    },
    {
      question: translatedText['Do you calculate the energy content?'],
      answer: translatedText['Calculate energy text'],
    },
    {
      question:
        translatedText[`What happens if I don't follow the regulation?`],
      answer: translatedText['Follow regulations text'],
    },
    {
      question: translatedText['What kind of technology is Journy using?'],
      answer: `${translatedText['Blockchain and QR codes']}<br/><br/>
        ${translatedText['Blockchain explanation']}`,
      hasMore: true,
    },
  ];

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - faqRef.current.offsetLeft);
    setScrollLeft(faqRef.current.scrollLeft);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - faqRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Scroll-hastighet
    faqRef.current.scrollLeft = scrollLeft - walk;
  };

  const toggleCard = (index) => {
    if (expandedCard === index) {
      setExpandedCard(null);
    } else {
      setExpandedCard(index);
    }
  };

  // Add this function inside the Home component
  const scrollFAQ = (direction) => {
    if (faqRef.current) {
      const scrollAmount = 300; // Adjust scroll amount as needed
      faqRef.current.scrollLeft +=
        direction === 'left' ? -scrollAmount : scrollAmount;
    }
  };

  return (
    <div className={styles.homeContainer}>
      <nav className={styles.navbar}>
        <div className={styles['nav-content']}>
          <img src={journyLogo} alt='Journy Logo' className={styles.logo} />

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
            <NavLink to='/about' className={styles.navLink}>
              {translatedText['About us']}
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
      <div className={styles['home-container']}>
        <video
          autoPlay
          muted
          loop
          playsInline
          preload='metadata'
          controls={false} // Prevent controls from showing
          className={styles.backgroundVideo}
        >
          <source src='/assets/desktop2.mp4' type='video/mp4' />
        </video>

        <div className={styles['content-wrapper']}>
          <div className={styles['content-box']}>
            <h1 className={styles.mainHeading}>
              {translatedText['YOUR JOURNEY']},
              <br />
              {translatedText['IN EVERY SCAN']}.
            </h1>
            <p className={styles.subHeading}>
              {
                translatedText[
                  'Showcase Your Sustainability with Smart E-Labels'
                ]
              }
              .
            </p>
          </div>
          <div className={styles.startButtonWrapper}>
            <NavLink to='/signup' className={styles.startButton}>
              {translatedText['Start today']}
            </NavLink>
          </div>

          <div className={styles.scrollDown}>
            <img src={arrowIcon} alt='Scroll' className={styles.scrollArrow} />
            <span>{translatedText['Scroll down']}</span>
          </div>
        </div>
      </div>
      <div className={styles.howItWorksSection}>
        <div className={styles.howItWorksHeader}>
          <h3 className={styles.sectionTitle}>
            {translatedText['HOW IT WORKS']}
          </h3>
          <h2 className={styles.mainTitle}>
            {translatedText['SHARE YOUR JOURNEY IN 4 STEPS']}
          </h2>
          <div className={styles.showcaseVideoContainer}>
            <video
              autoPlay
              muted
              loop
              playsInline
              preload='metadata'
              controls={false}
            >
              <source src='/assets/Landingpagedemo.mp4' type='video/mp4' />
            </video>
          </div>
        </div>

        <div className={styles.labelInteractionSection}>
          <a
            href='https://www.journy.se/product/497'
            target='_blank'
            rel='noopener noreferrer'
          >
            <button className={styles.labelButton}>
              {translatedText['Click here to see an example']}
            </button>
          </a>
          <img
            src={'/assets/Images/qrcode_example.png'}
            alt='Label Interaction'
            className={styles.labelInteractionImage}
          />
          <img
            src={labelInteractionMobile}
            alt='Label Interaction Mobile'
            className={styles.labelInteractionImageMobile}
          />
        </div>
      </div>
      <div className={styles.wineTellsStorySection}>
        <h3 className={styles.whyLabelsTitle}>
          {translatedText['WHY YOU NEED E-LABELS']}
        </h3>
        <h2 className={styles.storyTitle}>
          {translatedText['YOUR WINE TELLS A STORY']}
        </h2>

        <div className={styles.storyContent}>
          <p className={styles.storyText}>{translatedText['Wine Story']}</p>
          <img
            src={wineTellsStory}
            alt='Wine Story'
            className={styles.storyImage}
          />
        </div>
      </div>
      <div className={styles.empowerSection}>
        <div className={styles.contentWrapper}>
          <div className={styles.topRow}>
            <video
              autoPlay
              muted
              loop
              playsInline
              preload='metadata'
              controls={false} // Prevent controls from showing
              className={styles.video1}
            >
              <source src='/assets/video1.mp4' type='video/mp4' />
            </video>
            <img src={bild1} alt='Vineyard' className={styles.image1} />
            <img src={bild2} alt='Wine' className={styles.image2} />
            <video
              autoPlay
              muted
              loop
              playsInline
              preload='metadata'
              controls={false} // Prevent controls from showing
              className={styles.video2}
            >
              <source src='/assets/video2.mp4' type='video/mp4' />
            </video>
            <img src={bild3} alt='Grapes' className={styles.image3} />
          </div>

          <div className={styles.textSection}>
            <p className={styles.empowerText}>
              {
                translatedText[
                  'We empower wine producers to meet the growing demands for'
                ]
              }{' '}
              <span className={styles.highlight}>
                {translatedText['transparency']}
              </span>{' '}
              {translatedText['and']}{' '}
              <span className={styles.highlight}>
                {translatedText['sustainability']}
              </span>{' '}
              {
                translatedText[
                  'while turning environmental challenges into business opportunities'
                ]
              }
              .
              <br />
              {
                translatedText[
                  'With Journy, we make it possible for consumers to know'
                ]
              }
              <br />
              {
                translatedText[
                  'who made their wine, how it was produced, and how their choices impact the planet'
                ]
              }
              .
            </p>
          </div>

          <div className={styles.bottomRow}>
            <video
              autoPlay
              muted
              loop
              playsInline
              preload='metadata'
              controls={false} // Prevent controls from showing
              className={styles.video3}
            >
              <source src='/assets/video3.mp4' type='video/mp4' />
            </video>
            <img src={bild4} alt='Winery' className={styles.image4} />
            <video
              autoPlay
              muted
              loop
              playsInline
              preload='metadata'
              controls={false} // Prevent controls from showing
              className={styles.video4}
            >
              <source src='/assets/video4.mp4' type='video/mp4' />
            </video>
          </div>
        </div>
      </div>
      <div className={styles.pricesSection}>
        <h3 className={styles.pricesTitle}>{translatedText['PRICES']}</h3>
        <h2 className={styles.planTitle}>
          {translatedText['CHOOSE YOUR E-LABEL PLAN']}
        </h2>

        <div className={styles.priceCards}>
          {/* FREE plan*/}
          <div className={styles.priceCard}>
            <h4 className={styles.labelCount}>{translatedText['3 labels']}</h4>
            <p className={styles.price}>{translatedText['€ 0/year']}</p>
            <ul className={styles.features}>
              <li>
                {
                  translatedText[
                    'Full compliance with EU e-labeling regulations'
                  ]
                }
                .
              </li>
              <li>
                {translatedText['Multilingual support in all EU languages']}.
              </li>
            </ul>
            <NavLink to='/signup' className={styles.getStartedButton}>
              {translatedText['Try for free']}
            </NavLink>
          </div>

          {/* Basic Plan */}
          <div className={styles.priceCard}>
            <h4 className={styles.labelCount}>{translatedText['15 labels']}</h4>
            <p className={styles.price}>{translatedText['€ 179/year']}</p>
            <ul className={styles.features}>
              <li>
                {
                  translatedText[
                    'Full compliance with EU e-labeling regulations'
                  ]
                }
                .
              </li>
              <li>
                {translatedText['Multilingual support in all EU languages']}.
              </li>
            </ul>
            <NavLink to='/signup' className={styles.getStartedButton}>
              {translatedText['Get started']}
            </NavLink>
          </div>

          {/* Standard Plan */}
          <div className={styles.priceCard}>
            <h4 className={styles.labelCount}>{translatedText['30 labels']}</h4>
            <p className={styles.price}>{translatedText['€ 319/year']}</p>
            <ul className={styles.features}>
              <li>
                {
                  translatedText[
                    'Full compliance with EU e-labeling regulations'
                  ]
                }
                .
              </li>
              <li>
                {translatedText['Multilingual support in all EU languages']}.
              </li>
            </ul>
            <NavLink to='/signup' className={styles.getStartedButton}>
              {translatedText['Get started']}
            </NavLink>
          </div>

          {/* Premium Plan */}
          <div className={styles.priceCard}>
            <h4 className={styles.labelCount}>{translatedText['50 labels']}</h4>
            <p className={styles.price}>{translatedText['€ 479/year']}</p>
            <ul className={styles.features}>
              <li>
                {
                  translatedText[
                    'Full compliance with EU e-labeling regulations'
                  ]
                }
                .
              </li>
              <li>
                {translatedText['Multilingual support in all EU languages']}.
              </li>
            </ul>
            <NavLink to='/signup' className={styles.getStartedButton}>
              {translatedText['Get started']}
            </NavLink>
          </div>
        </div>
      </div>
      <div className={styles.aboutSection}>
        <h3 className={styles.aboutTitle}>{translatedText['WHO ARE WE']}</h3>
        <h2 className={styles.whyTitle}>{translatedText['WHY JOURNY?']}</h2>
        <p className={styles.aboutText}>{translatedText['WHO ARE WE text']}.</p>
        <NavLink to='/about' className={styles.learnMoreButton}>
          {translatedText['Learn more']}
        </NavLink>
      </div>
      <div className={styles.readySection}>
        <div className={styles.textContent}>
          <h2 className={styles.readyTitle}>
            {translatedText['Are you ready to share your story?']}
          </h2>
          <p className={styles.readySubtitle}>
            {translatedText['Stand out and make an impact with our e-labels']}.
          </p>
          <NavLink to='/signup' className={styles.readyButton}>
            {translatedText['Start today']}
          </NavLink>
        </div>
        <div className={styles.videoContainer}>
          <video
            autoPlay
            muted
            loop
            playsInline
            preload='metadata'
            controls={false}
            className={styles.qrVideo}
          >
            <source src='/assets/QrCode.mp4' type='video/mp4' />
          </video>
        </div>
      </div>
      <div className={styles.faqSection}>
        <h3 className={styles.faqSubtitle}>
          {translatedText['FAQ AND CONTACT']}
        </h3>
        <h2 className={styles.faqTitle}>
          {translatedText['DO YOU HAVE ANY QUESTIONS?']}
        </h2>

        <button
          className={`${styles.faqNavButton} ${styles.prev}`}
          onClick={() => scrollFAQ('left')}
        >
          <svg viewBox='0 0 24 24'>
            <path d='M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z' />
          </svg>
        </button>

        <button
          className={`${styles.faqNavButton} ${styles.next}`}
          onClick={() => scrollFAQ('right')}
        >
          <svg viewBox='0 0 24 24'>
            <path d='M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z' />
          </svg>
        </button>

        <div
          ref={faqRef}
          className={styles.faqContainer}
          style={{
            display: 'flex',
            overflowX: 'auto',
            scrollBehavior: 'smooth',
            WebkitOverflowScrolling: 'touch',
            msOverflowStyle: 'none',
            scrollbarWidth: 'none',
          }}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onMouseMove={handleMouseMove}
        >
          <div className={styles.faqCardsWrapper}>
            {faqData.map((faq, index) => (
              <div
                key={index}
                className={`${styles.faqCard} ${
                  expandedCard === index ? styles.expanded : ''
                }`}
              >
                <h3 className={styles.faqQuestion}>{faq.question}</h3>
                <div className={styles.faqAnswerWrapper}>
                  <div
                    dangerouslySetInnerHTML={{ __html: faq.answer }}
                    className={styles.faqAnswer}
                  />
                </div>
                <button
                  className={styles.readMore}
                  onClick={() => toggleCard(index)}
                >
                  {expandedCard === index ? 'Read less' : 'Read more'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className={styles.contactSection}>
        <h2 className={styles.contactTitle}>{translatedText['CONTACT US']}</h2>
        <div className={styles.emailContainer}>
          <div className={styles.decorativeLeft}></div>
          <a href='mailto:hello@journy.se' className={styles.emailButton}>
            hello@journy.se
          </a>
          <div className={styles.decorativeRight}></div>
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
            <a href='/about'>{translatedText['About us']}</a>
            <a href='/contact'>{translatedText['Contact']}</a>
          </div>
          <div className={styles.linkColumn}>
            <a href='/privacy'>{translatedText['Privacy Policy']}</a>
            <a href='/terms'>{translatedText['Terms & Conditions']}</a>
          </div>
        </div>
      </footer>
      <Footer translatedText={translatedText} />
    </div>
  );
};
