import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import styles from '../../../../styles/ChangePlan.module.scss';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
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
import { fetchUser } from '../../../../Services/Httpclient';
import { createSubscription } from '../../../../Services/stripe';
import { Modal } from '../../../layout/Modal';
import { Footer } from '../../../layout/Footer';

// Initialize Stripe
const stripePromise = loadStripe(
  process.env.NODE_ENV === 'production'
    ? import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY_PROD
    : import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY_TEST
);

export const PRICE_IDS = [
  {
    link:
      process.env.NODE_ENV === 'production'
        ? 'https://buy.stripe.com/7sIeVvdfuaEabGU7sv'
        : ' https://buy.stripe.com/7sIeVvdfuaEabGU7sv',
    priceId:
      process.env.NODE_ENV === 'production'
        ? 'price_1RBYWRFPy4bqkt3MvVg7mTbQ'
        : 'price_1RBYWRFPy4bqkt3MvVg7mTbQ',
    price: 0,
    duration: '/year',
  },
  {
    link:
      process.env.NODE_ENV === 'production'
        ? 'https://buy.stripe.com/7sI14Fb7m13A12g9AC'
        : 'https://buy.stripe.com/7sI14Fb7m13A12g9AC',
    priceId:
      process.env.NODE_ENV === 'production'
        ? 'price_1QzcPLFPy4bqkt3MpWFyTCFj'
        : 'price_1QzcPLFPy4bqkt3MpWFyTCFj',
    price: 179,
    duration: '/year',
  },
  {
    link:
      process.env.NODE_ENV === 'production'
        ? 'https://buy.stripe.com/3csaFf0sI4fM12g7st'
        : 'https://buy.stripe.com/3csaFf0sI4fM12g7st',
    priceId:
      process.env.NODE_ENV === 'production'
        ? 'price_1QzcQ3FPy4bqkt3MWXSmL1R8'
        : 'price_1QzcQ3FPy4bqkt3MWXSmL1R8',
    price: 319,
    duration: '/year',
  },
  {
    link:
      process.env.NODE_ENV === 'production'
        ? 'https://buy.stripe.com/4gw9Bbb7mfYu9yMdQQ'
        : 'https://buy.stripe.com/4gw9Bbb7mfYu9yMdQQ',
    priceId:
      process.env.NODE_ENV === 'production'
        ? 'price_1QzcQeFPy4bqkt3MGn07agJa'
        : 'price_1QzcQeFPy4bqkt3MGn07agJa',
    price: 479,
    duration: '/year',
  },
];

const ChangePlan = () => {
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [translatedText, setTranslatedText] = useState({});
  const [language, setLanguage] = useState(
    localStorage.getItem('language') || ''
  );
  const [modalMessage, setModalMessage] = useState('');

  const navigate = useNavigate();
  const token = Cookies.get('token');

  // Add useEffect to fetch user data
  useEffect(() => {
    const loadUser = async () => {
      try {
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.id;

        const userData = await fetchUser(userId);
        console.log('User hasUsedFreeTier:', userData.data.hasUsedFreeTier); // Add debug log
        setUserData(userData.data);
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };
    loadUser();
  }, [token]);

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

  const showModal = (message) => {
    setModalMessage(message);
  };

  const handleModalClose = () => {
    setModalMessage('');
  };

  // Helper function to determine button text based on priceId
  const getButtonText = (planPriceId) => {
    // If this is the free tier
    if (planPriceId === PRICE_IDS[0].priceId) {
      if (userData?.hasUsedFreeTier === true || userData?.priceId) {
        translatedText['Not Available'];
      }
      translatedText['Get Started'];
    }

    if (!userData?.priceId) return translatedText['Get started'];
    if (userData.priceId === planPriceId) return translatedText['Current Plan'];

    const currentPlanIndex = PRICE_IDS.findIndex(
      (plan) => plan.priceId === userData.priceId
    );
    const newPlanIndex = PRICE_IDS.findIndex(
      (plan) => plan.priceId === planPriceId
    );

    if (currentPlanIndex === -1) return translatedText['Get started'];
    if (newPlanIndex > currentPlanIndex) return translatedText['Upgrade'];
    return translatedText['Downgrade'];
  };

  const handleSubscription = async (priceId) => {
    try {
      setLoading(true);
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.id;

      const response = await createSubscription(priceId, userId);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || translatedText['Failed to create subscription']
        );
      }

      const { url } = await response.json();
      if (url) {
        window.location.href = url;
      } else {
        throw new Error(translatedText['No checkout URL received']);
      }
    } catch (error) {
      console.error('Error:', error);
      showModal(translatedText[error.message] || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Elements stripe={stripePromise}>
      <>
        {loading && (
          <div className={styles.modal}>
            <div className={styles.modalContent}>
              <h2>{translatedText['Processing Payment']}...</h2>
              <div className={styles.loader}></div>
            </div>
          </div>
        )}
        <div className={styles.header}>
          {/* Placeholder header content */}

          <div className={styles.navigationContainer}>
            <img
              src='/assets/Images/logo.png'
              alt='Company Logo'
              className={styles.logo}
            />
            <div className={styles.backNavigation}>
              <button type='button' onClick={() => navigate(-1)}>
                {translatedText['Back']}
              </button>
            </div>
          </div>
        </div>

        <div className={styles.pricesSection}>
          <h2 className={styles.planTitle}>{translatedText['Change Plan']}</h2>
          <div className={styles.priceCards}>
            {/* FREE plan*/}
            <div className={styles.priceCard}>
              <h4 className={styles.labelCount}>
                {translatedText['3 labels']}
              </h4>
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
              <button
                className={styles.startButton}
                onClick={() => handleSubscription(PRICE_IDS[0].priceId)}
                disabled={
                  userData?.hasUsedFreeTier === true || userData?.priceId
                }
              >
                {getButtonText(PRICE_IDS[0].priceId)}
              </button>
            </div>

            {/* Basic Plan */}
            <div className={styles.priceCard}>
              <h4 className={styles.labelCount}>
                {translatedText['15 labels']}
              </h4>
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
              <button
                className={styles.startButton}
                onClick={() => handleSubscription(PRICE_IDS[1].priceId)}
                disabled={userData?.priceId === PRICE_IDS[1].priceId}
              >
                {getButtonText(PRICE_IDS[1].priceId)}
              </button>
            </div>

            {/* Standard Plan */}
            <div className={styles.priceCard}>
              <h4 className={styles.labelCount}>
                {translatedText['30 labels']}
              </h4>
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
              <button
                className={styles.startButton}
                onClick={() => handleSubscription(PRICE_IDS[2].priceId)}
                disabled={userData?.priceId === PRICE_IDS[2].priceId}
              >
                {getButtonText(PRICE_IDS[2].priceId)}
              </button>
            </div>

            {/* Premium Plan */}
            <div className={styles.priceCard}>
              <h4 className={styles.labelCount}>
                {translatedText['50 labels']}
              </h4>
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
              <button
                className={styles.startButton}
                onClick={() => handleSubscription(PRICE_IDS[3].priceId)}
                disabled={userData?.priceId === PRICE_IDS[3].priceId}
              >
                {getButtonText(PRICE_IDS[3].priceId)}
              </button>
            </div>
          </div>
        </div>
        <Modal
          message={modalMessage}
          onClose={handleModalClose}
          translatedText={translatedText}
        />
        <Footer translatedText={translatedText} />
      </>
    </Elements>
  );
};

export default ChangePlan;
