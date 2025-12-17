import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import productTemplate from '../../../../Utils/productTemplate';
import {
  updateProduct,
  getProduct,
  getCertifications,
} from '../../../../Services/Httpclient';
import { flattenWineData } from '../../../../Utils/flattenWineData';
import { GeneralProductInformation } from '../ProductInformations/GeneralProductInformation';
import { ProductInformation } from '../ProductInformations/ProductInformation';
import { Modal } from '../../../layout/Modal';
import styles from '../../../../styles/updateProduct.module.scss';
import { LoadingModal } from '../../../layout/LoadingModal';
import { Header } from '../../../layout/Header';
import { Footer } from '../../../layout/Footer';
import { ProductionProcess } from '../ProductionProcess/ProductionProcess';
import { Nutrition } from '../Nutrition/Nutrition';
import { useNavigate } from 'react-router-dom';
import en from '../../../../Utils/languages/addUpdateProduct/en.json';
import it from '../../../../Utils/languages/addUpdateProduct/it.json';
import fr from '../../../../Utils/languages/addUpdateProduct/fr.json';
import es from '../../../../Utils/languages/addUpdateProduct/es.json';
import sv from '../../../../Utils/languages/addUpdateProduct/sv.json';
import pt from '../../../../Utils/languages/addUpdateProduct/pt.json';
import el from '../../../../Utils/languages/addUpdateProduct/el.json';
import bg from '../../../../Utils/languages/addUpdateProduct/bg.json';
import hr from '../../../../Utils/languages/addUpdateProduct/hr.json';
import cs from '../../../../Utils/languages/addUpdateProduct/cs.json';
import da from '../../../../Utils/languages/addUpdateProduct/da.json';
import nl from '../../../../Utils/languages/addUpdateProduct/nl.json';
import et from '../../../../Utils/languages/addUpdateProduct/et.json';
import fi from '../../../../Utils/languages/addUpdateProduct/fi.json';
import de from '../../../../Utils/languages/addUpdateProduct/de.json';
import hu from '../../../../Utils/languages/addUpdateProduct/hu.json';
import ga from '../../../../Utils/languages/addUpdateProduct/ga.json';
import lv from '../../../../Utils/languages/addUpdateProduct/lv.json';
import lt from '../../../../Utils/languages/addUpdateProduct/lt.json';
import mt from '../../../../Utils/languages/addUpdateProduct/mt.json';
import pl from '../../../../Utils/languages/addUpdateProduct/pl.json';
import ro from '../../../../Utils/languages/addUpdateProduct/ro.json';
import sk from '../../../../Utils/languages/addUpdateProduct/sk.json';
import sl from '../../../../Utils/languages/addUpdateProduct/sl.json';
import ingredients_en from '../../../../Utils/languages/ingredients/ingredients_en.json';
import ingredients_it from '../../../../Utils/languages/ingredients/ingredients_it.json';
import ingredients_fr from '../../../../Utils/languages/ingredients/ingredients_fr.json';
import ingredients_es from '../../../../Utils/languages/ingredients/ingredients_es.json';
import ingredients_sv from '../../../../Utils/languages/ingredients/ingredients_sv.json';
import ingredients_pt from '../../../../Utils/languages/ingredients/ingredients_pt.json';
import ingredients_el from '../../../../Utils/languages/ingredients/ingredients_el.json';
import ingredients_bg from '../../../../Utils/languages/ingredients/ingredients_bg.json';
import ingredients_hr from '../../../../Utils/languages/ingredients/ingredients_hr.json';
import ingredients_cs from '../../../../Utils/languages/ingredients/ingredients_cs.json';
import ingredients_da from '../../../../Utils/languages/ingredients/ingredients_da.json';
import ingredients_nl from '../../../../Utils/languages/ingredients/ingredients_nl.json';
import ingredients_et from '../../../../Utils/languages/ingredients/ingredients_et.json';
import ingredients_fi from '../../../../Utils/languages/ingredients/ingredients_fi.json';
import ingredients_de from '../../../../Utils/languages/ingredients/ingredients_de.json';
import ingredients_hu from '../../../../Utils/languages/ingredients/ingredients_hu.json';
import ingredients_ga from '../../../../Utils/languages/ingredients/ingredients_ga.json';
import ingredients_lv from '../../../../Utils/languages/ingredients/ingredients_lv.json';
import ingredients_lt from '../../../../Utils/languages/ingredients/ingredients_lt.json';
import ingredients_mt from '../../../../Utils/languages/ingredients/ingredients_mt.json';
import ingredients_pl from '../../../../Utils/languages/ingredients/ingredients_pl.json';
import ingredients_ro from '../../../../Utils/languages/ingredients/ingredients_ro.json';
import ingredients_sk from '../../../../Utils/languages/ingredients/ingredients_sk.json';
import ingredients_sl from '../../../../Utils/languages/ingredients/ingredients_sl.json';

export const UpdateProduct = () => {
  const [wineData, setWineData] = useState(productTemplate);
  const [modalMessage, setModalMessage] = useState('');
  const [image, setImage] = useState(null);
  const [imageRemoved, setImageRemoved] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [translatedText, setTranslatedText] = useState({});
  const [ingredientsLang, setIngredientsLang] = useState({});
  const [language, setLanguage] = useState(
    localStorage.getItem('language') || ''
  );
  const [userCertifications, setUserCertifications] = useState([]);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [selectedCertifications, setSelectedCertifications] = useState([]);
  const navigate = useNavigate();

  if (!wineData) return;

  useEffect(() => {
    // Fetch user's certifications on component mount
    const fetchUserCertifications = async () => {
      const certifications = await getCertifications();

      setUserCertifications(certifications);
    };

    fetchUserCertifications();
  }, []);

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const { id } = useParams();

  const handleLanguageChange = (e) => setLanguage(e.target.value);

  useEffect(() => {
    switch (language) {
      case 'en':
      default:
        setTranslatedText(en);
        setIngredientsLang(ingredients_en);
        break;
      case 'it':
        setTranslatedText(it);
        setIngredientsLang(ingredients_it);
        break;
      case 'fr':
        setTranslatedText(fr);
        setIngredientsLang(ingredients_fr);
        break;
      case 'es':
        setTranslatedText(es);
        setIngredientsLang(ingredients_es);
        break;
      case 'sv':
        setTranslatedText(sv);
        setIngredientsLang(ingredients_sv);
        break;
      case 'pt':
        setTranslatedText(pt);
        setIngredientsLang(ingredients_pt);
        break;
      case 'el':
        setTranslatedText(el);
        setIngredientsLang(ingredients_el);
        break;
      case 'bg':
        setTranslatedText(bg);
        setIngredientsLang(ingredients_bg);
        break;
      case 'hr':
        setTranslatedText(hr);
        setIngredientsLang(ingredients_hr);
        break;
      case 'cs':
        setTranslatedText(cs);
        setIngredientsLang(ingredients_cs);
        break;
      case 'da':
        setTranslatedText(da);
        setIngredientsLang(ingredients_da);
        break;
      case 'nl':
        setTranslatedText(nl);
        setIngredientsLang(ingredients_nl);
        break;
      case 'et':
        setTranslatedText(et);
        setIngredientsLang(ingredients_et);
        break;
      case 'fi':
        setTranslatedText(fi);
        setIngredientsLang(ingredients_fi);
        break;
      case 'de':
        setTranslatedText(de);
        setIngredientsLang(ingredients_de);
        break;
      case 'hu':
        setTranslatedText(hu);
        setIngredientsLang(ingredients_hu);
        break;
      case 'ga':
        setTranslatedText(ga);
        setIngredientsLang(ingredients_ga);
        break;
      case 'lv':
        setTranslatedText(lv);
        setIngredientsLang(ingredients_lv);
        break;
      case 'lt':
        setTranslatedText(lt);
        setIngredientsLang(ingredients_lt);
        break;
      case 'mt':
        setTranslatedText(mt);
        setIngredientsLang(ingredients_mt);
        break;
      case 'pl':
        setTranslatedText(pl);
        setIngredientsLang(ingredients_pl);
        break;
      case 'ro':
        setTranslatedText(ro);
        setIngredientsLang(ingredients_ro);
        break;
      case 'sk':
        setTranslatedText(sk);
        setIngredientsLang(ingredients_sk);
        break;
      case 'sl':
        setTranslatedText(sl);
        setIngredientsLang(ingredients_sl);
        break;
    }
  }, [language, ingredientsLang]);

  const parsedCertificates =
    typeof wineData.Certificates === 'string'
      ? wineData.Certificates.split(', ').map((entry) => {
          const [type, ref] = entry.split('::');
          return { type, ref };
        })
      : [];

  useEffect(() => {
    const fetchWineData = async () => {
      try {
        const response = await getProduct(id);
        const wineData = response.data;

        setWineData({
          ...wineData,
          productInfo: {
            Ingredients: wineData.Ingredients || '',
            Grape: wineData.Grape,
            NetQuantity: wineData.NetQuantity,
            Sulphites: wineData.Sulphites,
            AlcoholVolume: wineData.AlcoholVolume,
            OrganicAcid: wineData.OrganicAcid,
            ResidualSugar: wineData.ResidualSugar,
            Type: wineData.Type,
            ExpiryDate: wineData.ExpiryDate,
            Category: wineData.Category,
            Certificates: wineData.Certificates,
            MajorGrape: wineData.MajorGrape || '',
            MajorGrapePercentage: wineData.MajorGrapePercentage || 0,

            SecondGrape: wineData.SecondGrape || '',
            SecondGrapePercentage: wineData.SecondGrapePercentage || 0,

            ThirdGrape: wineData.ThirdGrape || '',
            ThirdGrapePercentage: wineData.ThirdGrapePercentage || 0,

            FourthGrape: wineData.FourthGrape || '',
            FourthGrapePercentage: wineData.FourthGrapePercentage || 0,
          },
          Nutrition: {
            KJ: wineData.KJ || '',
            Kcal: wineData.Kcal || '',
            Carbs: wineData.Carbs || '',
            CarbsOfSugar: wineData.CarbsOfSugar || '',
          },
        });

        // Handle other states as before
        setImage(wineData.ImageURL);

        if (wineData.Ingredients && ingredientsLang?.ingredients) {
          const previousIngredients = wineData.Ingredients.split(', ');
          const ingredientCategories = Object.values(
            ingredientsLang.ingredients
          );

          const preSelectedIngredients = previousIngredients
            .map((ingredient) => {
              const [category, index, name] = ingredient.split('-');

              // Find matching category and ingredient
              const matchingCategory = ingredientCategories.find(
                (cat) => cat.category === category && cat.items[name]
              );

              if (matchingCategory) {
                return {
                  label: matchingCategory.items[name],
                  value: `${category}-${index}-${name}`,
                  category: category,
                };
              }
              return null;
            })
            .filter(Boolean);

          setSelectedIngredients(preSelectedIngredients);
        }
      } catch (error) {
        console.error('Error fetching wine data: ', error);
      }
    };

    fetchWineData();
  }, [id, ingredientsLang, userCertifications]);

  useEffect(() => {
    if (typeof wineData?.Certificates === 'string') {
      const selected = wineData.Certificates.split(', ').map((entry) => {
        const [type] = entry.split('::');
        return {
          label: type === 'EU_ORGANIC' ? 'EU Organic' : type,
          value: type,
        };
      });

      setSelectedCertifications(selected);
    }
  }, [wineData?.Certificates]);

  const handleWineChange = (e, section = null) => {
    const { name, value, type } = e.target;

    // Handle inputs within a specific section (like nutrition or productInfo)
    if (section) {
      setWineData((prev) => {
        // Create deep copy of the section
        const updatedSection = {
          ...prev[section],
          [name]: value,
        };

        // Special handling for grape-related fields
        if (name.includes('Grape')) {
          // If clearing a grape variety, also clear its percentage and other value
          if (value === '') {
            const baseField = name
              .replace('Other', '')
              .replace('Percentage', '');
            updatedSection[`${baseField}Percentage`] = 0;
            updatedSection[`${baseField}Other`] = '';
          }
          // If setting a non-"Other" grape variety, clear the "Other" field
          else if (!name.includes('Other') && !name.includes('Percentage')) {
            updatedSection[`${name}Other`] = '';
          }
        }

        // Handle KJ/Kcal conversions
        if (name === 'KJ') {
          updatedSection.Kcal = value
            ? Math.round(Number(value) * 0.239005736)
            : '';
        } else if (name === 'Kcal') {
          updatedSection.KJ = value
            ? Math.round(Number(value) / 0.239005736)
            : '';
        }

        const newState = {
          ...prev,
          [section]: updatedSection,
        };
        return newState;
      });
    } else if (type === 'checkbox') {
      setWineData((prev) => ({
        ...prev,
        [name]: e.target.checked,
      }));
    } else {
      setWineData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (event) => {
    setLoading(true);
    event.preventDefault();

    const formData = new FormData();

    // Handle image file
    if (wineData.image) {
      formData.append('image', wineData.image);
    }

    // Flatten the wine data
    const flattenedWineData = flattenWineData(wineData);
    formData.append('wineData', JSON.stringify(flattenedWineData));

    try {
      await updateProduct(id, formData);
      showModal(translatedText['Update Successfull']);
    } catch (error) {
      showModal(translatedText['Update Error']);
      console.error('Error updating product: ', error);
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
      title: 'General Information',
      completed: false,
    },
    {
      number: 2,
      title: 'Product Information',
      completed: false,
    },
    {
      number: 3,
      title: 'Production Process',
      completed: false,
    },
    {
      number: 4,
      title: 'Submit',
      completed: false,
    },
  ];

  return (
    <>
      <Header />

      <div className={styles.wrapper}>
        {loading && <LoadingModal translatedText={translatedText} />}

        <h1>Edit Product</h1>
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
            <span>Back</span>
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
                  console.log('Setting step to 3');
                  setCurrentStep(3);
                }}
                onPrevious={() => setCurrentStep(1)}
                showModal={showModal}
              />
              <div style={{ display: 'none' }}>
                <Nutrition
                  wineData={wineData}
                  setWineData={setWineData}
                  handleWineChange={handleWineChange}
                  translatedText={translatedText}
                />
              </div>
            </>
          )}
          {currentStep === 3 && (
            <ProductionProcess
              wineData={wineData}
              handleWineChange={handleWineChange}
              translatedText={translatedText}
              onNext={() => setCurrentStep(4)}
              onPrevious={() => setCurrentStep(2)}
              isSparklingWine={
                wineData.productInfo.Category === 'Sparkling Wine'
              }
            />
          )}

          {currentStep === 4 && (
            <button
              className={styles.submitButtonEditWine}
              onClick={() => setCurrentStep(3)}
              type='button'
            >
              {translatedText['Previous'] || 'Previous'}
            </button>
          )}
          {currentStep === 4 && (
            <button
              className={styles.submitButtonEditWine}
              onClick={handleSubmit}
              type='button'
            >
              {translatedText['Submit Changes'] || 'Submit Changes'}
            </button>
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
