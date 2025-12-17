import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
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
import styles from '../../styles/RegisterUser.module.scss';
import { CertificationStep } from './registerSteps/CertificationStep';
import { RegisterStep1 } from './registerSteps/RegisterStep1';
import { RegisterStep2 } from './registerSteps/RegisterStep2';
import ChoosePlan from './registerSteps/ChoosePlan';
import { Modal } from '../layout/Modal';
import { Footer } from '../layout/Footer';

export const RegisterUser = () => {
  const [step, setStep] = useState(1);
  const [uploadDocModal, setUploadDocModal] = useState(false);
  const [uploadModalMessage, setUploadModalMessage] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [termsError, setTermsError] = useState(false);
  const [sustainabilityImages, setSustainabilityImages] = useState([]);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: '',
    Company: [],
    country: '',
    region: '',
    district: '',
    certificationDetails: {
      SQNPI: {
        expiryDate: '',
        referenceNumber: '',
        document: null,
        isActive: false,
      },
      KRAV: {
        expiryDate: '',
        referenceNumber: '',
        document: null,
        isActive: false,
      },
      EU_ORGANIC: {
        expiryDate: '',
        referenceNumber: '',
        document: null,
        isActive: false,
      },
    },
  });
  const [translatedText, setTranslatedText] = useState({});
  const [language, setLanguage] = useState(
    localStorage.getItem('language') || ''
  );
  const [registerFormData, setRegisterFormData] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const handleLanguageChange = (e) => setLanguage(e.target.value.split('|')[0]);

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
    if (formData) {
      const formDataToSend = new FormData();

      // Append basic user info
      formDataToSend.append('fullName', formData.fullName);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('password', formData.password);
      formDataToSend.append('role', formData.role);
      formDataToSend.append('Company', formData.Company);
      formDataToSend.append('country', formData.country.split('|')[1]);
      formDataToSend.append('district', formData.district);
      formDataToSend.append('region', formData.region);

      // Create certification details without the file objects
      const certDetailsForJSON = {};
      Object.entries(formData.certificationDetails).forEach(
        ([certType, details]) => {
          if (details.expiryDate || details.referenceNumber) {
            certDetailsForJSON[certType] = {
              expiryDate: details.expiryDate,
              referenceNumber: details.referenceNumber,
            };
          }
        }
      );

      formDataToSend.append(
        'certificationDetails',
        JSON.stringify(certDetailsForJSON)
      );

      // Append each file separately
      sustainabilityImages.forEach((file, index) => {
        formDataToSend.append(`sustainabilityImages`, file);
        console.log(`Appending file ${index}:`, file.name);
      });
      console.log('Sending files in useEffect:', formData);

      localStorage.setItem('signupEmail', formData.email);
      localStorage.setItem('signupPassword', formData.password);
      localStorage.setItem('signupRole', formData.role); // Store role for later use
      setRegisterFormData(formDataToSend);
    }
  }, [formData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const showModal = (message) => {
    setModalMessage(message);
  };

  const handleModalClose = () => {
    setModalMessage('');
  };

  const nextStepValidation = () => {
    if (step === 1) {
      // Get the form fields for step 1
      const nameInput = document.querySelector('input[name="fullName"]');
      const emailInput = document.querySelector('input[name="email"]');
      const passwordInput = document.querySelector('input[name="password"]');
      const roleInput = document.querySelector('select[name="role"]');

      // Check if all required fields are filled
      if (!nameInput.value || !emailInput.value || !passwordInput.value || !formData.role) {
        // Trigger browser's native validation
        if (!nameInput.value) nameInput.reportValidity();
        if (!emailInput.value) emailInput.reportValidity();
        if (!passwordInput.value) passwordInput.reportValidity();
        if (!formData.role && roleInput) roleInput.reportValidity();
        return;
      }

      // Check terms acceptance
      if (!termsAccepted) {
        setTermsError(true);
        return;
      }

      setTermsError(false);
      setStep(step + 1);
    } else if (step === 2) {
      if (formData.Company.length === 0 || !formData.country) {
        // Show validation errors
        if (formData.Company.length <= 0) {
          showModal(
            translatedText['Press Enter or click (+) to confirm a company name']
          );
        }

        const countryInput = document.querySelector('select[name="country"]');
        if (!formData.country && countryInput) countryInput.reportValidity();
        return;
      }
      if (!formData.region) {
        const regionInput = document.querySelector('select[name="region"]');
        if (!formData.region && regionInput) regionInput.reportValidity();
        return;
      }
      setStep(step + 1);
    } else if (step === 3) {
      const missingFields = [];

      if (
        !formData.certificationDetails.EU_ORGANIC.expiryDate &&
        formData.certificationDetails.EU_ORGANIC.isActive === true
      ) {
        missingFields.push(
          `EU Organic ${translatedText['Expiry Date']}` ||
            'EU Organic Expiry Date'
        );
      }
      if (
        !formData.certificationDetails.KRAV.expiryDate &&
        formData.certificationDetails.KRAV.isActive === true
      ) {
        missingFields.push(
          `KRAV ${translatedText['Expiry Date']}` || 'KRAV Expiry Date'
        );
      }
      if (
        !formData.certificationDetails.SQNPI.expiryDate &&
        formData.certificationDetails.SQNPI.isActive === true
      ) {
        missingFields.push(
          `SQNPI ${translatedText['Expiry Date']}` || 'SQNPI Expiry Date'
        );
      }

      if (
        !formData.certificationDetails.EU_ORGANIC.referenceNumber &&
        formData.certificationDetails.EU_ORGANIC.isActive === true
      ) {
        missingFields.push(
          `EU Organic ${translatedText['Reference Number']}` ||
            'EU Organic Reference Number'
        );
      }
      if (
        !formData.certificationDetails.KRAV.referenceNumber &&
        formData.certificationDetails.KRAV.isActive === true
      ) {
        missingFields.push(
          `KRAV ${translatedText['Reference Number']}` ||
            'KRAV Reference Number'
        );
      }
      if (
        !formData.certificationDetails.SQNPI.referenceNumber &&
        formData.certificationDetails.SQNPI.isActive === true
      ) {
        missingFields.push(
          `SQNPI ${translatedText['Reference Number']}` ||
            'SQNPI Reference Number'
        );
      }

      if (missingFields.length > 0) {
        const errorMessage =
          missingFields.length === 1
            ? `${translatedText['Please provide a value for']} ${missingFields[0]}`
            : `${
                translatedText['Please provide values for']
              }: ${missingFields.join(', ')}`;

        showModal(errorMessage);
      } else setStep(step + 1);
    } else if (step === 4) {
      setStep(step + 1);
    }
  };

  const prevStep = () => setStep(step - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();

      // Append basic user info
      formDataToSend.append('fullName', formData.fullName);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('password', formData.password);
      formDataToSend.append('role', formData.role);
      formDataToSend.append('Company', formData.Company);
      formDataToSend.append('country', formData.country.split('|')[1]);
      formDataToSend.append('district', formData.district);
      formDataToSend.append('region', formData.region);

      // Create certification details without the file objects
      const certDetailsForJSON = {};
      Object.entries(formData.certificationDetails).forEach(
        ([certType, details]) => {
          if (details.expiryDate || details.referenceNumber) {
            certDetailsForJSON[certType] = {
              expiryDate: details.expiryDate,
              referenceNumber: details.referenceNumber,
            };
          }
        }
      );

      formDataToSend.append(
        'certificationDetails',
        JSON.stringify(certDetailsForJSON)
      );

      // Append each file separately
      sustainabilityImages.forEach((file, index) => {
        formDataToSend.append(`sustainabilityImages`, file);
        console.log(`Appending file ${index}:`, file.name);
      });

      console.log('Sending files:', formDataToSend);
      // await register(formDataToSend);
      // navigate('/login');
    } catch (error) {
      setUploadModalMessage(
        translatedText['Registration failed. Please try again.']
      );
      setUploadDocModal(true);
    }
  };

  console.log('registerFormData useState', registerFormData);

  const renderBackButton = () => (
    <div className={styles.navigationContainer}>
      <NavLink to='/' className={styles.navLink}>
        <img
          src='/assets/Images/logo.png'
          alt='Company Logo'
          className={styles.logo}
        />
      </NavLink>
      <div className={styles.backNavigation}>
        <button
          type='button'
          onClick={() => (step === 1 ? navigate('/') : prevStep())}
        >
          {undefined ? 'Back' : translatedText['Back']}
        </button>
      </div>
    </div>
  );

  // Add this modal component inside RegisterUser component
  const UploadDocModal = () => (
    <div className={styles.modalOverlayRegister}>
      <div className={styles.modalRegister}>
        <h1 className={styles.h1Register}>!</h1>
        <h2>
          {
            translatedText[
              'Upload the official document provided by the certifying body'
            ]
          }
        </h2>
        <p>
          {
            translatedText[
              'Accepted formats: PDF, PNG, JPG. Maximum File size: 5 MB'
            ]
          }
          .
        </p>
        <button onClick={() => setUploadDocModal(false)}>
          {translatedText['Ok']}
        </button>
      </div>
    </div>
  );

  console.log('Sending files:', registerFormData);

  return (
    <>
      <div className={styles.registerContainer}>
        {uploadDocModal && <UploadDocModal />}
        {renderBackButton()}
        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <RegisterStep1
              styles={styles}
              translatedText={translatedText}
              formData={formData}
              handleChange={handleChange}
              nextStepValidation={nextStepValidation}
              termsError={termsError}
              setTermsError={setTermsError}
              termsAccepted={termsAccepted}
              setTermsAccepted={setTermsAccepted}
            />
          )}
          {step === 2 && (
            <>
              <RegisterStep2
                styles={styles}
                translatedText={translatedText}
                formData={formData}
                setFormData={setFormData}
                handleChange={handleChange}
                language={language}
                handleLanguageChange={handleLanguageChange}
                nextStepValidation={nextStepValidation}
              />
              <Footer translatedText={translatedText} />
            </>
          )}
          {step === 3 && (
            <>
              <CertificationStep
                styles={styles}
                translatedText={translatedText}
                formData={formData}
                setFormData={setFormData}
                setSustainabilityImages={setSustainabilityImages}
                setUploadModalMessage={setUploadModalMessage}
                setUploadDocModal={setUploadDocModal}
                nextStepValidation={nextStepValidation}
              />
              <Footer translatedText={translatedText} />
            </>
          )}
          {step === 4 && (
            <>
              <ChoosePlan formData={registerFormData} />
              <Footer translatedText={translatedText} />
            </>
          )}
        </form>
      </div>
      <Modal
        message={modalMessage}
        onClose={handleModalClose}
        translatedText={translatedText}
      />
    </>
  );
};
