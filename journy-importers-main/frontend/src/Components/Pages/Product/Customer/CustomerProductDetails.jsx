import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProduct } from '../../../../Services/HttpClient';
import { SelectLanguage } from '../../../layout/SelectLanguage';
import styles from '../../../../styles/customerProductDetails.module.scss';
import en from '../../../../Utils/languages/customerPage/en.json';
import it from '../../../../Utils/languages/customerPage/it.json';
import fr from '../../../../Utils/languages/customerPage/fr.json';
import es from '../../../../Utils/languages/customerPage/es.json';
import sv from '../../../../Utils/languages/customerPage/sv.json';
import pt from '../../../../Utils/languages/customerPage/pt.json';
import el from '../../../../Utils/languages/customerPage/el.json';
import bg from '../../../../Utils/languages/customerPage/bg.json';
import hr from '../../../../Utils/languages/customerPage/hr.json';
import cs from '../../../../Utils/languages/customerPage/cs.json';
import da from '../../../../Utils/languages/customerPage/da.json';
import nl from '../../../../Utils/languages/customerPage/nl.json';
import et from '../../../../Utils/languages/customerPage/et.json';
import fi from '../../../../Utils/languages/customerPage/fi.json';
import de from '../../../../Utils/languages/customerPage/de.json';
import hu from '../../../../Utils/languages/customerPage/hu.json';
import ga from '../../../../Utils/languages/customerPage/ga.json';
import lv from '../../../../Utils/languages/customerPage/lv.json';
import lt from '../../../../Utils/languages/customerPage/lt.json';
import mt from '../../../../Utils/languages/customerPage/mt.json';
import pl from '../../../../Utils/languages/customerPage/pl.json';
import ro from '../../../../Utils/languages/customerPage/ro.json';
import sk from '../../../../Utils/languages/customerPage/sk.json';
import sl from '../../../../Utils/languages/customerPage/sl.json';
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
import { Footer } from '../../../layout/Footer';
import { ProductPassport } from '../WineData/Documents/ProductPassport';
import { SustainabilityInformation } from '../WineData/Documents/SustainabilityInformation';
import { NutritionDeclaration } from '../WineData/ProductInfo/NutritionDeclaration';
import { ProductInfo } from '../WineData/ProductInfo/ProductInfo';
import { ProductionDetails } from '../WineData/ProductionProcess/ProductionDetails';
import { SparklingWineDetails } from '../WineData/ProductionProcess/SparklingWineDetails';

export const CustomerProductDetails = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state
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

  // Extracting wineId parameter URL from root path
  const { id } = useParams();

  // fetch wine data based on wineId
  useEffect(() => {
    const fetchWine = async () => {
      try {
        const response = await getProduct(id);

        if (response.data) {
          setProduct(response.data);
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching wine data:', error);
      } finally {
        setLoading(false); // Set loading to false once fetch is done
      }
    };

    fetchWine();
  }, [id]);

  // Display a loading indicator while data is being fetched
  if (loading) {
    return <div>{translatedText['Loading']}...</div>;
  }

  // Handle case where the wine data is null or not found
  if (!product) {
    return <div>{translatedText['Product not found']}</div>;
  }

  const getSulphiteCategory = (amount) => {
    if (!amount || amount === 0) return '';
    if (amount < 50)
      return `${translatedText['Low in sulphites']}: ${amount}${translatedText['mg/L']}`;
    if (amount <= 150)
      return `${translatedText['Moderate in sulphites']}: ${amount}${translatedText['mg/L']}`;
    if (amount <= 350)
      return `${translatedText['High in sulphites']}: ${amount}${translatedText['mg/L']}`;
    return `${amount}${translatedText['mg/L']}`;
  };

  const sulphiteContent = getSulphiteCategory(product.sulphites);

  return (
    <>
      <div className={styles['producer-product-details']}>
        <div className={styles['content-container']}>
          {/* Header and disclaimer */}
          <div className={styles.appHeader}>
            <span className={styles.journyHeader}>
              <span className={styles.appName}>Journy</span>
              <SelectLanguage
                handleLanguageChange={handleLanguageChange}
                language={language}
                styles={styles.inputField}
              />
            </span>
            <div className={styles.disclaimer}>
              <span className={styles.infoIcon}>!</span>
              <p className={styles.disclaimerText}>
                {translatedText['educational purposes']}
              </p>
            </div>
          </div>

          <div className={styles.passportGrid}>
            <ProductPassport
              product={product}
              translatedText={translatedText}
            />
          </div>

          {/* Info + Nutrition */}
          <div className={styles.cardSection}>
            <ProductInfo product={product} translatedText={translatedText} />
            <NutritionDeclaration
              product={product}
              translatedText={translatedText}
            />
          </div>

          {/* Production */}
          {product?.productionDetails &&
            Object.values(product.productionDetails).some(
              (val) => val !== ''
            ) && (
              <div className={styles.cardSection}>
                <ProductionDetails
                  wineData={product}
                  translatedText={translatedText}
                />
                <SparklingWineDetails
                  wineData={product}
                  translatedText={translatedText}
                />
              </div>
            )}

          {/* Sustainability */}
          <div className={styles.cardSection}>
            <SustainabilityInformation
              product={product}
              translatedText={translatedText}
            />
          </div>

          {/* Responsible Consumption */}
          <div className={styles.cardSection}>
            <h2 className={styles.responsibilityTitle}>
              {translatedText['Responsible Consumption']}
            </h2>
            <div className={styles.responsibilityContent}>
              <p>
                {
                  translatedText[
                    'Excessive alcohol consumption is harmful to your health'
                  ]
                }
                .
              </p>
              <p>{translatedText['Always drink responsibly']}.</p>
              <ul className={styles.responsibilityList}>
                <li>{translatedText[`Don't drink and drive`]}.</li>
                <li>{translatedText[`Don't drink while pregnant`]}.</li>
                <li>
                  {
                    translatedText[
                      'It is illigal for those under the legal drinking age'
                    ]
                  }
                  .
                </li>
              </ul>
            </div>
          </div>
          <div className={styles.journyFooterContent}>
            <h4 className={styles.journyFooterTitle}>
              {translatedText['Do you want to find out more?']}
            </h4>
            <div className={styles.journyFooter}>
              <a
                style={{ textDecoration: 'none', color: 'inherit' }}
                href='https://www.journy.se/'
                target='_blank'
              >
                <p>Journy</p>
              </a>
            </div>
          </div>
        </div>
      </div>

      <Footer translatedText={translatedText} />
    </>
  );
};
