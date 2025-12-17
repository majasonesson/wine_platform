import React, { useEffect, useState } from 'react';
import { useNavigate, NavLink, json } from 'react-router-dom';
import { fetchUser, updateUser } from '../../../../Services/Httpclient';
import styles from '../../../../styles/EditProfile.module.scss';
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
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import BrandInput from '../../../layout/BrandInput';
import { Footer } from '../../../layout/Footer';

const ImporterEditProfile = () => {
  const [translatedText, setTranslatedText] = useState({});
  const [language, setLanguage] = useState(
    localStorage.getItem('language') || ''
  );
  const [formData, setFormData] = useState({
    company: [],
    country: '',
    district: '',
    region: '',
    address: '',
    profileImageUrl: null,
  });
  const [imageUrl, setImageUrl] = useState(null);
  const [userData, setUserData] = useState(null);

  const navigate = useNavigate();
  const token = Cookies.get('token');

  useEffect(() => {
    const loadUser = async () => {
      try {
        if (!token) {
          return;
        }
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.id;

        const response = await fetchUser(userId);
        if (response && response.data) {
          setFormData(response.data);
        }
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

  useEffect(() => {
    const loadUser = async () => {
      try {
        if (!token) {
          setUserData(null);
          return;
        }

        const decodedToken = jwtDecode(token);
        const userId = decodedToken.id;

        const response = await fetchUser(userId);
        setUserData(response.data);
      } catch (error) {
        console.error('Error loading user data:', error);
        setUserData(null);
      }
    };

    loadUser();
  }, [token]);

  useEffect(() => {
    if (userData?.profileImageUrl) {
      setImageUrl(userData?.profileImageUrl);
    }
  }, [userData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // instant preview
    const url = URL.createObjectURL(file);
    setImageUrl(url);

    // merge the File into your formData
    setFormData((prev) => ({
      ...prev,
      profileImageUrl: file,
    }));
  };

  const handleLogout = () => {
    console.log('Logging out user');
  };

  // Update the prepareFormData function
  const prepareFormData = () => {
    const form = new FormData();
    const isFile = formData.profileImageUrl instanceof File;

    // Add the user data
    form.append(
      'data',
      JSON.stringify({
        company: formData.company,
        country: formData.country,
        district: formData.district,
        region: formData.region,
        address: formData.address,
        profileImageUrl: isFile ? null : formData.profileImageUrl, // send the existing URL back if it’s a string
      })
    );

    if (formData.profileImageUrl) {
      form.append('profileImage', formData.profileImageUrl);
    }

    return form;
  };

  // Update the handleSubmit function
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting form with data:', formData);

    try {
      const formDataToSend = prepareFormData();
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.id;

      const data = await updateUser(userId, formDataToSend);

      if (data) {
        const sanitizedData = {
          company: data.company,
          country: data.country,
          district: data.district,
          region: data.region,
          address: data.address,
          profileImageUrl: data.profileImageUrl,
        };

        console.log('Sanitized data:', sanitizedData);
        setFormData(sanitizedData);
        navigate(`/importer/profile`);
      } else {
        console.error('Invalid response from updateUser:', data);
        throw new Error('Invalid response format from server');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert(translatedText['Failed to update profile. Please try again.']);
    }
  };

  const companyValue =
    typeof formData.company === 'string' ? formData.company : '';
  // Then split only if it's a string
  const companyBrands = companyValue ? companyValue.split(', ') : [];

  return (
    <>
      <div className={styles.header}>
        <Header />

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

      <div className={styles.container}>
        <h1 className={styles.profileH1}>{translatedText['Edit Profile']}</h1>

        <div className={styles.imageUpload}>
          <div
            className={styles.imagePreview}
            style={imageUrl && { background: '#ffffff' }}
          >
            {imageUrl ? (
              <img src={imageUrl} alt='Preview' />
            ) : (
              <div className={styles.uploadPlaceholder}>
                <svg
                  width='52'
                  height='52'
                  viewBox='0 0 52 52'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M52 46.2222V5.77778C52 2.6 49.4 0 46.2222 0H5.77778C2.6 0 0 2.6 0 5.77778V46.2222C0 49.4 2.6 52 5.77778 52H46.2222C49.4 52 52 49.4 52 46.2222ZM17.0444 31.72L23.1111 39.0289L32.0667 27.5022C32.6444 26.7511 33.8 26.7511 34.3778 27.5311L44.5178 41.0511C44.6787 41.2657 44.7767 41.5209 44.8008 41.7881C44.8249 42.0552 44.7741 42.3238 44.6542 42.5638C44.5342 42.8037 44.3498 43.0055 44.1216 43.1465C43.8934 43.2875 43.6305 43.3622 43.3622 43.3622H8.72444C7.51111 43.3622 6.84667 41.9756 7.59778 41.0222L14.7911 31.7778C15.34 31.0267 16.4378 30.9978 17.0444 31.72Z'
                    fill='#9E9E9E'
                  />
                </svg>
              </div>
            )}
          </div>
          <label className={styles.uploadButton}>
            {translatedText['Upload Image']}
            <input
              type='file'
              accept='image/*'
              onChange={handleImageUpload}
              style={{ display: 'none' }}
            />
          </label>
        </div>

        <div className={styles.buttons}>
          <button
            type='submit'
            onClick={handleSubmit}
            className={styles.btnProfile}
          >
            {translatedText['Save']}
            <img src='/assets/Images/saveIcon.png' alt='save' />
          </button>
          <NavLink
            to='/importer/profile/settings'
            className={styles.btnProfile}
          >
            Settings
            <img src='/assets/Images/settings.png' alt='settings' />
          </NavLink>
          <button
            className={styles.btnProfile}
            onClick={() => {
              Cookies.remove('token');
              window.location.href = '/login';
            }}
          >
            {translatedText['Log Out']}
            <img src='/assets/Images/logout.png' alt='logout' />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.formGroup}>
          <div className={styles.formTitle}>
            {translatedText['Information']}
          </div>

          <div>
            <label className={styles.label}>
              {translatedText['Company Name']}:
            </label>
            <BrandInput
              name='company'
              brands={companyBrands}
              setBrands={(newBrands) => {
                // Convert array back to comma-separated string if saving to API
                const companyValue = Array.isArray(newBrands)
                  ? newBrands.join(', ')
                  : newBrands;

                setFormData((prev) => ({
                  ...prev,
                  company: companyValue,
                }));
              }}
              onChange={handleInputChange}
              translatedText={translatedText}
            />
          </div>

          <div>
            <label className={styles.label}>{translatedText['Country']}:</label>
            <input
              className={styles.inputField}
              type='text'
              name='country'
              value={formData.country || ''}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label className={styles.label}>
              {translatedText['District']}:
            </label>
            <input
              className={styles.inputField}
              type='text'
              name='district'
              value={formData.district || ''}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label className={styles.label}>{translatedText['Region']}:</label>
            <input
              className={styles.inputField}
              type='text'
              name='region'
              value={formData.region || ''}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label className={styles.label}>{translatedText['Address']}:</label>
            <input
              className={styles.inputField}
              type='text'
              name='address'
              value={formData.address || ''}
              onChange={handleInputChange}
            />
          </div>
        </form>
      </div>
      <Footer translatedText={translatedText} />
    </>
  );
};

export default ImporterEditProfile;
