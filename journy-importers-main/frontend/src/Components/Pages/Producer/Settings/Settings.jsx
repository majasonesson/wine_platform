import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { NavLink, useNavigate } from 'react-router-dom';
import ChangePasswordModal from '../../../Auth/ChangePasswordModal';
import styles from '../../../../styles/Settings.module.scss';
import { changePassword, fetchUser } from '../../../../Services/Httpclient';
import { LoadingModal } from '../../../layout/LoadingModal';
import CancelModal from '../../../layout/CancelModal';
import { Header } from '../../../layout/Header';
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
import { SelectLanguage } from '../../../layout/SelectLanguage';
import { cancelSubscription } from '../../../../Services/stripe';
import { Footer } from '../../../layout/Footer';

const Settings = () => {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const token = Cookies.get('token');
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [translatedText, setTranslatedText] = useState({});
  const [language, setLanguage] = useState(
    localStorage.getItem('language') || ''
  );

  useEffect(() => {
    const loadUser = async () => {
      try {
        if (!token) {
          setUserData(null);
          return;
        }

        loading && setLoading(false);
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.id;

        const response = await fetchUser(userId);

        console.log('User data:', response.data); // Debug log

        setUserData(response.data);
      } catch (error) {
        console.error('Error loading user data:', error);
        setUserData(null);
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

  if (!userData)
    return (
      <div>
        <LoadingModal isLoading={true} translatedText={translatedText} />
      </div>
    );

  const handleChangePassword = async (currentPassword, newPassword) => {
    try {
      if (!token) {
        alert(translatedText['You must be logged in to change your password']);
        return;
      }

      const decodedToken = jwtDecode(token);
      const userId = decodedToken.id;

      const response = await changePassword(
        userId,
        currentPassword,
        newPassword
      );

      alert(translatedText['Password changed successfully']);
      setIsPasswordModalOpen(false);
      setError(''); // Clear any previous errors
    } catch (error) {
      console.error('Error changing password:', error);

      // Set the error message based on the backend response
      if (error.message === 'Current password is incorrect') {
        setError(
          translatedText[
            'The current password you entered is incorrect. Please try again.'
          ]
        );
      } else {
        setError(
          translatedText['Failed to change password:'] + ' ' + error.message
        );
      }
    }
  };

  const handleLogout = () => {
    // Add logout logic here
  };

  const handleCancelSubscription = async () => {
    setIsModalOpen(true);
  };

  const confirmCancellation = async () => {
    setIsModalOpen(false);
    try {
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.id;

      await cancelSubscription(userId);

      // Refresh user data
      const response = await fetchUser(userId);
      setUserData(response.data);

      alert(
        translatedText[
          'Subscription cancelled successfully. Your remaining labels are still available for use.'
        ]
      );
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      alert(
        translatedText['Failed to cancel subscription:'] + ' ' + error.message
      );
    }
  };

  const priceToLabelsMap = {
    price_1QzcPLFPy4bqkt3MpWFyTCFj: 15,
    price_1QzcQ3FPy4bqkt3MWXSmL1R8: 30,
    price_1QzcQeFPy4bqkt3MGn07agJa: 50,
  };

  return (
    <>
      <div className={styles.header}>
        {/* Placeholder header content */}
        <Header />
        <div className={styles.backNavigation}>
          <button type='button' onClick={() => navigate(-1)}>
            {translatedText['Back']}
          </button>
        </div>
        <div className={styles.navigationContainer}>
          {/* <img
            src='/../../../../../public/assets/Images/logo.png'
            alt='Company Logo'
            className={styles.logo}
          /> */}
        </div>
      </div>

      <div className={styles.container}>
        <h1>{translatedText['Settings']}</h1>

        <div className={styles.buttons}>
          {/* <button className={styles.btnProfile}>
            <NavLink to={`/producer/profile/settings/edit`}>Edit</NavLink>
            <img src='/src/assets/pencil.png' alt='edit' />
          </button> */}
          <NavLink to='/producer/profile' className={styles.btnProfile}>
            {translatedText['Profile']}
            <img src='/assets/Images/profileIcon.png' alt='profile' />
          </NavLink>
          <button
            onClick={() => {
              Cookies.remove('token');
              window.location.href = '/login';
            }}
            className={styles.btnProfile}
          >
            {translatedText['Log Out']}
            <img src='/assets/Images/logout.png' alt='logout' />
          </button>
        </div>

        <form className={styles.formGroup}>
          <div className={styles.formTitle}>
            {translatedText['Information']}
          </div>
          <div>
            <label className={styles.label}>{translatedText['Email']}:</label>
            <input
              className={styles.inputField}
              type='text'
              value={userData.email}
              disabled
            />
          </div>

          <div>
            <label className={styles.label}>
              {translatedText['Username']}:
            </label>
            <input
              className={styles.inputField}
              type='text'
              value={userData.email}
              disabled
            />
          </div>

          <div>
            <label className={styles.label}>
              {translatedText['Password']}:
            </label>
            <input
              className={styles.inputField}
              type='password'
              value='********'
              disabled
            />
            <div
              className={styles.resetPassword}
              onClick={() => setIsPasswordModalOpen(true)}
            >
              {translatedText['Change Password']}
            </div>
            <label className={styles.label}>Language:</label>
            <SelectLanguage
              handleLanguageChange={handleLanguageChange}
              language={language}
              styles={styles.inputField}
            />
          </div>
        </form>
        <ChangePasswordModal
          isOpen={isPasswordModalOpen}
          onClose={() => {
            setIsPasswordModalOpen(false);
            setError(''); // Clear errors when the modal is closed
          }}
          onSubmit={handleChangePassword}
          error={error}
          translatedText={translatedText}
        />
        <form className={styles.formGroupPlan}>
          <div>
            <label className={styles.labelPlan}>
              {translatedText['Subscription Model']}
            </label>
            <input
              className={styles.inputPlan}
              type='text'
              value={
                userData.priceId
                  ? `${priceToLabelsMap[userData.priceId]} ${
                      translatedText['labels / year']
                    }`
                  : translatedText['No active plan']
              }
              disabled
            />
            <div className={styles.planActions}>
              <NavLink to='plan' className={styles.plan}>
                {translatedText['Upgrade']}
              </NavLink>
            </div>
          </div>

          <div className={styles.labelsRow}>
            <div>
              <label className={styles.labelPlan}>
                {translatedText['Subscription Status']}
              </label>
              <input
                className={styles.inputFieldPlan}
                type='text'
                value={userData.subscriptionStatus || translatedText['None']}
                disabled
              />
            </div>

            <div>
              <label className={styles.labelPlan}>
                {translatedText['Next billing date']}
              </label>
              <input
                className={styles.inputFieldPlan}
                type='text'
                value={
                  userData.subscriptionStatus === 'canceled'
                    ? translatedText['N/A']
                    : userData.subscriptionEndDate
                    ? new Date(
                        userData.subscriptionEndDate
                      ).toLocaleDateString()
                    : translatedText['N/A']
                }
                disabled
              />
            </div>

            <div>
              <label className={styles.labelPlan}>
                {translatedText['Remaining labels']}
              </label>
              <input
                className={styles.inputFieldPlan}
                type='text'
                value={userData.labels + ' ' + translatedText['labels']}
                disabled
              />
            </div>
            <div>
              {userData.subscriptionStatus === 'active' && (
                <button
                  onClick={handleCancelSubscription}
                  className={styles.cancelButton}
                  type='button'
                >
                  {translatedText['Cancel Subscription']}
                </button>
              )}
              <CancelModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={confirmCancellation}
                title={translatedText['Cancel Subscription']}
                message={translatedText['Cancel subscription message']}
                translatedText={translatedText}
              />
            </div>
          </div>
        </form>
      </div>
      <Footer translatedText={translatedText} />
    </>
  );
};

export default Settings;
