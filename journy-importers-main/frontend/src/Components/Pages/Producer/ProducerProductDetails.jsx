import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '../../layout/Header';
import { ProductPassport } from '../Product/WineData/Documents/ProductPassport';
import { ProductInfo } from '../Product/WineData/ProductInfo/ProductInfo';
import { SustainabilityInformation } from '../Product/WineData/Documents/SustainabilityInformation';
import { ListIngredients } from '../Product/WineData/ProductInfo/ListIngredients';
import { NutritionDeclaration } from '../Product/WineData/ProductInfo/NutritionDeclaration';
import { Documents } from '../Product/WineData/Documents/Documents';
import { generateQRCode } from '../../../Utils/QRCode/generateQRCode';
import { getQRCodeURL } from '../../../Services/getQRCodeURL';
import { getProduct } from '../../../Services/Httpclient';
import { UpdateProductLink } from './UpdateProduct/UpdateProductLink';
import styles from '../../../styles/producerProductDetails.module.scss';
import en from '../../../Utils/languages/producerProduct/en.json';
import it from '../../../Utils/languages/producerProduct/it.json';
import fr from '../../../Utils/languages/producerProduct/fr.json';
import es from '../../../Utils/languages/producerProduct/es.json';
import sv from '../../../Utils/languages/producerProduct/sv.json';
import pt from '../../../Utils/languages/producerProduct/pt.json';
import el from '../../../Utils/languages/producerProduct/el.json';
import bg from '../../../Utils/languages/producerProduct/bg.json';
import hr from '../../../Utils/languages/producerProduct/hr.json';
import cs from '../../../Utils/languages/producerProduct/cs.json';
import da from '../../../Utils/languages/producerProduct/da.json';
import nl from '../../../Utils/languages/producerProduct/nl.json';
import et from '../../../Utils/languages/producerProduct/et.json';
import fi from '../../../Utils/languages/producerProduct/fi.json';
import de from '../../../Utils/languages/producerProduct/de.json';
import hu from '../../../Utils/languages/producerProduct/hu.json';
import ga from '../../../Utils/languages/producerProduct/ga.json';
import lv from '../../../Utils/languages/producerProduct/lv.json';
import lt from '../../../Utils/languages/producerProduct/lt.json';
import mt from '../../../Utils/languages/producerProduct/mt.json';
import pl from '../../../Utils/languages/producerProduct/pl.json';
import ro from '../../../Utils/languages/producerProduct/ro.json';
import sk from '../../../Utils/languages/producerProduct/sk.json';
import sl from '../../../Utils/languages/producerProduct/sl.json';
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
import { Footer } from '../../layout/Footer';
import { ProductionDetails } from '../Product/WineData/ProductionProcess/ProductionDetails';
import { downloadQRCode } from '../../../Utils/QRCode/downloadQRCode';
import { SparklingWineDetails } from '../Product/WineData/ProductionProcess/SparklingWineDetails';
import { updatePublishStatus } from '../../../Services/connectionService';
import { Modal } from '../../layout/Modal';

export const ProducerProductDetails = () => {
  const [product, setProduct] = useState(null);
  const [qrContent, setQrContent] = useState('');
  const [translatedText, setTranslatedText] = useState({});
  const [language, setLanguage] = useState(
    localStorage.getItem('language') || ''
  );
  const [modalMessage, setModalMessage] = useState('');

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

  // Get wineId parameter URL from root path
  const { id } = useParams();

  // Fetch wine data and generate QR code when component mounts or when wineId changes
  useEffect(() => {
    const fetchWine = async () => {
      const getProductResponse = await getProduct(id);
      setProduct(getProductResponse.data);

      const qrCodeUrlresponse = await getQRCodeURL(id);
      // Generate the QR code for wine's product page
      const qrCode = await generateQRCode(qrCodeUrlresponse.data.qrCode);

      setQrContent(qrCode);
    };

    fetchWine();
  }, [id]);

  const showModal = (message) => {
    setModalMessage(message);
  };

  const handleModalClose = () => {
    setModalMessage('');
  };

  // If wine data is not yet loaded, display a loading message
  if (!product) {
    return <div>{translatedText['Loading']}...</div>;
  }

  const downloadQR = () => {
    if (!product?.WineID) return;
    downloadQRCode(product?.WineID);
  };

  const handlePublishWine = async () => {
    if (!product?.WineID) return;

    try {
      const statusData = await updatePublishStatus(product.WineID, {
        IsPublished: 1,
      });

      // Refresh the product data to get the updated publish status
      const getProductResponse = await getProduct(product.WineID);
      setProduct(getProductResponse.data);

      // Show success modal
      if(statusData) setTimeout(() => showModal('Successfully published wine!'), 300);
    } catch (error) {
      console.error('Error publishing wine:', error);
      showModal(translatedText['Failed to publish wine'] || 'Failed to publish wine');
    }
  };

  return (
    <>
      <Header translatedText={translatedText} />

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

      <div className={styles['producer-product-details']}>
        <div className={styles['content-container']}>
          <span className={styles.previewTitle}>Preview</span>
          {/* Header and disclaimer */}
          <div className={styles.appHeader}>
            <span className={styles.appName}>Journy</span>
            <div className={styles.disclaimer}>
              <span className={styles.infoIcon}>!</span>
              <p className={styles.disclaimerText}>
                {translatedText['educational purposes']}
              </p>
            </div>
          </div>

          <div className={styles.passportGrid}>
            <div className={styles.passportLeft}>
              <ProductPassport
                product={product}
                translatedText={translatedText}
              />
            </div>

            <div className={styles.passportRight}>
              <h4 className={styles.qrTitle}>{translatedText['Qr Code']}</h4>
              <div className={styles.qrBox}>
                <img src={qrContent} alt='QR Code' className={styles.qrImage} />
              </div>

              <button onClick={downloadQR} className={styles.labelButtons}>
                {translatedText['Download']}
              </button>
              <button className={styles.labelButtons}>
                <UpdateProductLink
                  wineId={id}
                  translatedText={translatedText}
                />
              </button>
              <button
                onClick={handlePublishWine}
                className={styles.labelButtons}
              >
                Publish Wine
              </button>
            </div>
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

      <Modal
        message={modalMessage}
        onClose={handleModalClose}
        translatedText={translatedText}
      />
      <Footer translatedText={translatedText} />
    </>
  );
};
