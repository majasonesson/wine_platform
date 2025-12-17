import { useEffect, useState } from 'react';
import { GeneralProductInformation } from './ProductInformations/GeneralProductInformation';
import { ProductInformation } from './ProductInformations/ProductInformation';
import { Nutrition } from './Nutrition/Nutrition';
import { Modal } from '../../layout/Modal';
import productTemplate from '../../../Utils/productTemplate';
import { addProduct, fetchUser } from '../../../Services/HttpClient';
import { flattenWineData } from '../../../Utils/flattenWineData';
import styles from '../../../styles/addProduct.module.scss';
import { LoadingModal } from '../../layout/LoadingModal';
import { ProductionProcess } from './ProductionProcess/ProductionProcess';
import { useNavigate } from 'react-router-dom';
import { Header } from '../../layout/Header';
import { Footer } from '../../layout/Footer';
import { ELabelPreview } from './ELabelPreview/ELabelPreview';
import en from '../../../Utils/languages/addUpdateProduct/en.json';
import it from '../../../Utils/languages/addUpdateProduct/it.json';
import fr from '../../../Utils/languages/addUpdateProduct/fr.json';
import es from '../../../Utils/languages/addUpdateProduct/es.json';
import sv from '../../../Utils/languages/addUpdateProduct/sv.json';
import pt from '../../../Utils/languages/addUpdateProduct/pt.json';
import el from '../../../Utils/languages/addUpdateProduct/el.json';
import bg from '../../../Utils/languages/addUpdateProduct/bg.json';
import hr from '../../../Utils/languages/addUpdateProduct/hr.json';
import cs from '../../../Utils/languages/addUpdateProduct/cs.json';
import da from '../../../Utils/languages/addUpdateProduct/da.json';
import nl from '../../../Utils/languages/addUpdateProduct/nl.json';
import et from '../../../Utils/languages/addUpdateProduct/et.json';
import fi from '../../../Utils/languages/addUpdateProduct/fi.json';
import de from '../../../Utils/languages/addUpdateProduct/de.json';
import hu from '../../../Utils/languages/addUpdateProduct/hu.json';
import ga from '../../../Utils/languages/addUpdateProduct/ga.json';
import lv from '../../../Utils/languages/addUpdateProduct/lv.json';
import lt from '../../../Utils/languages/addUpdateProduct/lt.json';
import mt from '../../../Utils/languages/addUpdateProduct/mt.json';
import pl from '../../../Utils/languages/addUpdateProduct/pl.json';
import ro from '../../../Utils/languages/addUpdateProduct/ro.json';
import sk from '../../../Utils/languages/addUpdateProduct/sk.json';
import sl from '../../../Utils/languages/addUpdateProduct/sl.json';
import ingredients_en from '../../../Utils/languages/ingredients/ingredients_en.json';
import ingredients_it from '../../../Utils/languages/ingredients/ingredients_it.json';
import ingredients_fr from '../../../Utils/languages/ingredients/ingredients_fr.json';
import ingredients_es from '../../../Utils/languages/ingredients/ingredients_es.json';
import ingredients_sv from '../../../Utils/languages/ingredients/ingredients_sv.json';
import ingredients_pt from '../../../Utils/languages/ingredients/ingredients_pt.json';
import ingredients_el from '../../../Utils/languages/ingredients/ingredients_el.json';
import ingredients_bg from '../../../Utils/languages/ingredients/ingredients_bg.json';
import ingredients_hr from '../../../Utils/languages/ingredients/ingredients_hr.json';
import ingredients_cs from '../../../Utils/languages/ingredients/ingredients_cs.json';
import ingredients_da from '../../../Utils/languages/ingredients/ingredients_da.json';
import ingredients_nl from '../../../Utils/languages/ingredients/ingredients_nl.json';
import ingredients_et from '../../../Utils/languages/ingredients/ingredients_et.json';
import ingredients_fi from '../../../Utils/languages/ingredients/ingredients_fi.json';
import ingredients_de from '../../../Utils/languages/ingredients/ingredients_de.json';
import ingredients_hu from '../../../Utils/languages/ingredients/ingredients_hu.json';
import ingredients_ga from '../../../Utils/languages/ingredients/ingredients_ga.json';
import ingredients_lv from '../../../Utils/languages/ingredients/ingredients_lv.json';
import ingredients_lt from '../../../Utils/languages/ingredients/ingredients_lt.json';
import ingredients_mt from '../../../Utils/languages/ingredients/ingredients_mt.json';
import ingredients_pl from '../../../Utils/languages/ingredients/ingredients_pl.json';
import ingredients_ro from '../../../Utils/languages/ingredients/ingredients_ro.json';
import ingredients_sk from '../../../Utils/languages/ingredients/ingredients_sk.json';
import ingredients_sl from '../../../Utils/languages/ingredients/ingredients_sl.json';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

export const AddProduct = () => {
  const [wineData, setWineData] = useState(productTemplate);
  const [modalMessage, setModalMessage] = useState('');
  const [image, setImage] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [translatedText, setTranslatedText] = useState({});
  const [currentStep, setCurrentStep] = useState(1);
  const [imageUrl, setImageUrl] = useState(null);
  const [selectedCertifications, setSelectedCertifications] = useState([]);
  const [language, setLanguage] = useState(
    localStorage.getItem('language') || ''
  );
  const [userCertifications, setUserCertifications] = useState([]);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [userData, setUserData] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const handleLanguageChange = (e) => setLanguage(e.target.value);

  useEffect(() => {
    switch (language) {
      case 'en':
      default:
        setTranslatedText({ ...en, ...ingredients_en });
        break;
      case 'it':
        setTranslatedText({ ...it, ...ingredients_it });
        break;
      case 'fr':
        setTranslatedText({ ...fr, ...ingredients_fr });
        break;
      case 'es':
        setTranslatedText({ ...es, ...ingredients_es });
        break;
      case 'sv':
        setTranslatedText({ ...sv, ...ingredients_sv });
        break;
      case 'pt':
        setTranslatedText({ ...pt, ...ingredients_pt });
        break;
      case 'el':
        setTranslatedText({ ...el, ...ingredients_el });
        break;
      case 'bg':
        setTranslatedText({ ...bg, ...ingredients_bg });
        break;
      case 'hr':
        setTranslatedText({ ...hr, ...ingredients_hr });
        break;
      case 'cs':
        setTranslatedText({ ...cs, ...ingredients_cs });
        break;
      case 'da':
        setTranslatedText({ ...da, ...ingredients_da });
        break;
      case 'nl':
        setTranslatedText({ ...nl, ...ingredients_nl });
        break;
      case 'et':
        setTranslatedText({ ...et, ...ingredients_et });
        break;
      case 'fi':
        setTranslatedText({ ...fi, ...ingredients_fi });
        break;
      case 'de':
        setTranslatedText({ ...de, ...ingredients_de });
        break;
      case 'hu':
        setTranslatedText({ ...hu, ...ingredients_hu });
        break;
      case 'ga':
        setTranslatedText({ ...ga, ...ingredients_ga });
        break;
      case 'lv':
        setTranslatedText({ ...lv, ...ingredients_lv });
        break;
      case 'lt':
        setTranslatedText({ ...lt, ...ingredients_lt });
        break;
      case 'mt':
        setTranslatedText({ ...mt, ...ingredients_mt });
        break;
      case 'pl':
        setTranslatedText({ ...pl, ...ingredients_pl });
        break;
      case 'ro':
        setTranslatedText({ ...ro, ...ingredients_ro });
        break;
      case 'sk':
        setTranslatedText({ ...sk, ...ingredients_sk });
        break;
      case 'sl':
        setTranslatedText({ ...sl, ...ingredients_sl });
        break;
    }
  }, [language]);

  const token = Cookies.get('token');
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

  if (!userData) return;

  // Handle changes to wine data inputsx
  const handleWineChange = (e, section = null) => {
    const { name, value, type } = e.target;

    if (section) {
      setWineData((prev) => ({
        ...prev,
        [section]: {
          ...(prev[section] || {}),
          [name]: value,
        },
      }));
    } else if (type === 'checkbox') {
      setWineData((prev) => ({
        ...prev,
        [name]: e.target.checked,
      }));
    } else {
      setWineData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handles the form submission process
  const handleSubmit = async () => {
    setLoading(true);

    const formData = new FormData();

    // Append the product image file
    if (wineData.image) {
      formData?.append('image', wineData.image); // Attach the image file
    }

    const flattenedWineData = flattenWineData({
      ...wineData,
      District: userData?.district || '',
    });

    // Append the wine data as a stringified JSON object
    formData.append('wineData', JSON.stringify(flattenedWineData));

    try {
      // Submit the formData to the backend via addProduct
      await addProduct(formData);

      // Reset the form to the template
      setWineData(productTemplate);
      setImage(null); // Reset the image state
      setDocuments([]);
      setUserCertifications([]);
    } catch (error) {
      console.error('Error uploading data: ', error);
      showModal(translatedText['Upload Error']); // Show error message
    } finally {
      setLoading(false);
    }
  };

  const showModal = (message) => {
    setModalMessage(message);
  };

  const handleModalClose = () => {
    setModalMessage('');
  };

  const steps = [
    {
      number: 1,
      title: translatedText['General Information'],
      completed: false,
    },
    {
      number: 2,
      title: translatedText['Product Information'],
      completed: false,
    },
    {
      number: 3,
      title: translatedText['Production Process'],
      completed: false,
    },
    {
      number: 4,
      title: translatedText['Generate QR Code'],
      completed: false,
    },
  ];

  // Enkel navigation tillbaka
  const handleBackClick = () => {
    navigate(-1); // Detta bör gå tillbaka till föregående sida
  };

  return (
    <>
      <Header />
      <div className={styles.wrapper}>
        {loading && <LoadingModal translatedText={translatedText} />}

        {/* Steps indicator */}
        <div className={styles.stepsContainer}>
          {steps.map((step, index) => (
            <div
              key={step.number}
              className={`${styles.step} ${
                currentStep === index + 1 ? styles.active : ''
              }`}
            >
              <div className={styles.stepNumber}>{step.number}</div>
              <div className={styles.stepTitle}>{step.title}</div>
            </div>
          ))}
        </div>

        {/* Förenklad back-knapp */}
        {currentStep === 1 && (
          <button
            className={styles.backButton}
            onClick={() => navigate(-1)}
            type='button'
          >
            <svg
              width='14'
              height='24'
              viewBox='0 0 14 24'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M13 1L2 12L13 23'
                stroke='#808080'
                strokeWidth='2'
                strokeLinecap='round'
              />
            </svg>
            <span>{translatedText['Back']}</span>
          </button>
        )}

        {/* Form container */}
        <div className={styles.formContainer}>
          {currentStep === 1 && (
            <GeneralProductInformation
              wineData={wineData}
              handleWineChange={handleWineChange}
              translatedText={translatedText}
              onNext={() => setCurrentStep(2)}
              selectedCertifications={selectedCertifications}
              setSelectedCertifications={setSelectedCertifications}
              imageUrl={imageUrl}
              setImageUrl={setImageUrl}
              showModal={showModal}
            />
          )}
          {currentStep === 2 && (
            <>
              <ProductInformation
                wineData={wineData}
                handleWineChange={handleWineChange}
                selectedIngredients={selectedIngredients}
                setSelectedIngredients={setSelectedIngredients}
                translatedText={translatedText}
                language={language}
                onNext={() => {
                  setCurrentStep(3);
                }}
                onPrevious={() => setCurrentStep(1)}
                showModal={showModal}
              />
            </>
          )}
          {currentStep === 3 && (
            <ProductionProcess
              wineData={wineData}
              handleWineChange={handleWineChange}
              translatedText={translatedText}
              onNext={() => setCurrentStep(4)}
              onPrevious={() => setCurrentStep(2)}
            />
          )}
          {currentStep === 4 && (
            <ELabelPreview
              wineData={wineData}
              handleWineChange={handleWineChange}
              setWineData={setWineData}
              image={image}
              onPrevious={() => setCurrentStep(3)}
              handleSubmit={handleSubmit}
              translatedText={translatedText}
              imageUrl={imageUrl}
              setImageUrl={setImageUrl}
              showModal={showModal}
            />
          )}
        </div>
      </div>

      <Modal
        message={modalMessage}
        onClose={handleModalClose}
        translatedText={translatedText}
      />
      <Footer translatedText={translatedText} />
    </>
  );
};
