import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '../layout/Header';
import styles from '../../styles/importerProductDetails.module.scss';
import { getPublishedWine } from '../../Services/connectionService';
import { SustainabilityInformation } from './Product/WineData/Documents/SustainabilityInformation';
import { SparklingWineDetails } from './Product/WineData/ProductionProcess/SparklingWineDetails';
import { ProductionDetails } from './Product/WineData/ProductionProcess/ProductionDetails';
import { NutritionDeclaration } from './Product/WineData/ProductInfo/NutritionDeclaration';
import { ProductInfo } from './Product/WineData/ProductInfo/ProductInfo';
import { ProductPassport } from './Product/WineData/Documents/ProductPassport';
import en from '../../Utils/languages/producerProduct/en.json';
import it from '../../Utils/languages/producerProduct/it.json';
import fr from '../../Utils/languages/producerProduct/fr.json';
import es from '../../Utils/languages/producerProduct/es.json';
import sv from '../../Utils/languages/producerProduct/sv.json';
import pt from '../../Utils/languages/producerProduct/pt.json';
import el from '../../Utils/languages/producerProduct/el.json';
import bg from '../../Utils/languages/producerProduct/bg.json';
import hr from '../../Utils/languages/producerProduct/hr.json';
import cs from '../../Utils/languages/producerProduct/cs.json';
import da from '../../Utils/languages/producerProduct/da.json';
import nl from '../../Utils/languages/producerProduct/nl.json';
import et from '../../Utils/languages/producerProduct/et.json';
import fi from '../../Utils/languages/producerProduct/fi.json';
import de from '../../Utils/languages/producerProduct/de.json';
import hu from '../../Utils/languages/producerProduct/hu.json';
import ga from '../../Utils/languages/producerProduct/ga.json';
import lv from '../../Utils/languages/producerProduct/lv.json';
import lt from '../../Utils/languages/producerProduct/lt.json';
import mt from '../../Utils/languages/producerProduct/mt.json';
import pl from '../../Utils/languages/producerProduct/pl.json';
import ro from '../../Utils/languages/producerProduct/ro.json';
import sk from '../../Utils/languages/producerProduct/sk.json';
import sl from '../../Utils/languages/producerProduct/sl.json';
import ingredients_en from '../../Utils/languages/ingredients/ingredients_en.json';
import ingredients_it from '../../Utils/languages/ingredients/ingredients_it.json';
import ingredients_fr from '../../Utils/languages/ingredients/ingredients_fr.json';
import ingredients_es from '../../Utils/languages/ingredients/ingredients_es.json';
import ingredients_sv from '../../Utils/languages/ingredients/ingredients_sv.json';
import ingredients_pt from '../../Utils/languages/ingredients/ingredients_pt.json';
import ingredients_el from '../../Utils/languages/ingredients/ingredients_el.json';
import ingredients_bg from '../../Utils/languages/ingredients/ingredients_bg.json';
import ingredients_hr from '../../Utils/languages/ingredients/ingredients_hr.json';
import ingredients_cs from '../../Utils/languages/ingredients/ingredients_cs.json';
import ingredients_da from '../../Utils/languages/ingredients/ingredients_da.json';
import ingredients_nl from '../../Utils/languages/ingredients/ingredients_nl.json';
import ingredients_et from '../../Utils/languages/ingredients/ingredients_et.json';
import ingredients_fi from '../../Utils/languages/ingredients/ingredients_fi.json';
import ingredients_de from '../../Utils/languages/ingredients/ingredients_de.json';
import ingredients_hu from '../../Utils/languages/ingredients/ingredients_hu.json';
import ingredients_ga from '../../Utils/languages/ingredients/ingredients_ga.json';
import ingredients_lv from '../../Utils/languages/ingredients/ingredients_lv.json';
import ingredients_lt from '../../Utils/languages/ingredients/ingredients_lt.json';
import ingredients_mt from '../../Utils/languages/ingredients/ingredients_mt.json';
import ingredients_pl from '../../Utils/languages/ingredients/ingredients_pl.json';
import ingredients_ro from '../../Utils/languages/ingredients/ingredients_ro.json';
import ingredients_sk from '../../Utils/languages/ingredients/ingredients_sk.json';
import ingredients_sl from '../../Utils/languages/ingredients/ingredients_sl.json';
import { Footer } from '../layout/Footer';

export const ImporterProductDetails = () => {
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [translatedText, setTranslatedText] = useState({});
  const [language, setLanguage] = useState(
    localStorage.getItem('language') || ''
  );
  const [showSyncOptions, setShowSyncOptions] = useState(false);
  const [syncSystem, setSyncSystem] = useState('');
  const [syncStatus, setSyncStatus] = useState('');
  const [isSynced, setIsSynced] = useState(false);
  const [syncError, setSyncError] = useState('');
  const [downloadError, setDownloadError] = useState('');
  const syncDropdownRef = useRef(null);

  const navigate = useNavigate();
  const { id } = useParams();

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

  useEffect(() => {
    const fetchWine = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const wineData = await getPublishedWine(id);

        if (!wineData) {
          throw new Error('No wine data received');
        }

        setProduct(wineData);

        // Check if this product was previously synced
        const syncedProducts = JSON.parse(
          localStorage.getItem('syncedProducts') || '{}'
        );
        if (syncedProducts[id]) {
          setIsSynced(true);
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch wine details');
        console.error('Error fetching wine:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWine();
  }, [id]);

  useEffect(() => {
    // Update localStorage whenever sync status changes
    if (isSynced) {
      const syncedProducts = JSON.parse(
        localStorage.getItem('syncedProducts') || '{}'
      );
      if (!syncedProducts[id]) {
        syncedProducts[id] = {
          timestamp: new Date().toISOString(),
          status: 'success',
        };
        localStorage.setItem('syncedProducts', JSON.stringify(syncedProducts));
      }
    }
  }, [isSynced, id]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        syncDropdownRef.current &&
        !syncDropdownRef.current.contains(event.target)
      ) {
        setShowSyncOptions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Helper function to format the text
  const formatText = (text) => {
    if (!text) return '';
    return text
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const handleCSVDownload = () => {
    try {
      if (!product) {
        throw new Error('No product data available');
      }

      // Process ingredients - remove 'General-0-' prefix
      const cleanIngredients = product.Ingredients
        ? product.Ingredients.replace('General-0-', '')
        : 'N/A';

      // Process certificates - separate type and number
      const certificatesArray = product.Certificates
        ? product.Certificates.split(',').map((cert) => {
            const [type, number] = cert.split('::');
            return { type, number };
          })
        : [];

      const wineData = {
        // Basic Information
        'Product Name': product.Name || 'N/A',
        'Brand Name': product.BrandName || 'N/A',
        Type: product.Type || 'N/A',
        'Wine Year': product.WineYear || 'N/A',
        'Wine ID': product.WineID || 'N/A',

        // Location Information
        Country: product.Country || 'N/A',
        Region: product.Region || 'N/A',
        District: product.District || 'N/A',

        // Technical Details
        'Alcohol Volume': product.AlcoholVolume ? `${product.AlcoholVolume} %` : 'N/A',
        'Net Quantity': product.NetQuantity || 'N/A',
        EAN: product.EAN || 'N/A',
        Category: product.Category || 'N/A',

        // Ingredients and Grape Information
        Ingredients: cleanIngredients,
        'Major Grape': product.MajorGrape || 'N/A',
        'Major Grape Percentage': product.MajorGrapePercentage ? `${product.MajorGrapePercentage} %` : 'N/A',
        'Second Grape': product.SecondGrape || 'N/A',
        'Second Grape Percentage': product.SecondGrapePercentage ? `${product.SecondGrapePercentage} %` : 'N/A',
        'Third Grape': product.ThirdGrape || 'N/A',
        'Third Grape Percentage': product.ThirdGrapePercentage ? `${product.ThirdGrapePercentage} %` : 'N/A',
        'Fourth Grape': product.FourthGrape || 'N/A',
        'Fourth Grape Percentage': product.FourthGrapePercentage ? `${product.FourthGrapePercentage} %` : 'N/A',

        // Nutritional Information
        Carbs: product.Carbs ? `${product.Carbs} g/L` : 'N/A',
        'Carbs of Sugar': product.CarbsOfSugar ? `${product.CarbsOfSugar} g/L` : 'N/A',
        'Residual Sugar': product.ResidualSugar ? `${product.ResidualSugar} g/L` : 'N/A',
        KJ: product.KJ || 'N/A',
        Kcal: product.Kcal || 'N/A',

        // Production Details
        'Harvest Method':
          translatedText[product.productionDetails?.harvestMethod] || 'N/A',
        'Fermentation Process':
          translatedText[
            formatText(product.productionDetails?.fermentationProcess)
          ] || 'N/A',
        'Aging Process':
          translatedText[formatText(product.productionDetails?.agingProcess)] ||
          'N/A',
        'Aging Months': product.productionDetails?.agingMonths
          ? `${product.productionDetails?.agingMonths} months`
          : 'N/A',
        'Grape Origin':
          translatedText[formatText(product.productionDetails?.grapeOrigin)] ||
          'N/A',

        'Primary Fermentation':
          translatedText[
            formatText(product.productionDetails?.primaryFermentation)
          ] || 'N/A',
        'Secondary Fermentation': product.productionDetails?.secondaryFermentation ?
          `${product.productionDetails?.secondaryFermentation} months` : 'N/A',
        Riddling:
          translatedText[formatText(product.productionDetails?.riddling)] ||
          'N/A',
        Disgorgement:
          translatedText[formatText(product.productionDetails?.disgorgement)] ||
          'N/A',
        'Sugar Dosage':
          translatedText[formatText(product.productionDetails?.dosage)] ||
          'N/A',
        Aging: product.productionDetails?.aging ? `${product.productionDetails?.aging} months` : 'N/A',
        Pressure: product.productionDetails?.pressure ? `${product.productionDetails?.pressure} Bars` : 'N/A',
      };

      // Add certificates as separate columns
      certificatesArray.forEach((cert, index) => {
        wineData[`Certificate ${index + 1} Type`] = cert.type || 'N/A';
        wineData[`Certificate ${index + 1} Number`] = cert.number || 'N/A';
      });

      // Add remaining fields
      Object.assign(wineData, {
        'Organic Acid': product.OrganicAcid ? `${product.OrganicAcid} g/L` : 'N/A',
      });

      // Create CSV content
      const headers = Object.keys(wineData);
      const values = Object.values(wineData).map((value) => {
        if (Array.isArray(value)) {
          return `"${value.join(', ')}"`;
        }
        return typeof value === 'string'
          ? `"${value.replace(/"/g, '""')}"`
          : value;
      });

      const csvContent = [headers.join(','), values.join(',')].join('\n');

      // Create and trigger download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');

      const fileName = `${product.BrandName || 'wine'}-${
        product.Name || 'data'
      }-${product.WineYear || 'NV'}`
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-');

      link.setAttribute('href', url);
      link.setAttribute(
        'download',
        `${fileName}-${new Date().toISOString().split('T')[0]}.csv`
      );

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading CSV:', error);
    }
  };

  const handleImporterSync = async (system) => {
    if (!product || !system) {
      setSyncError('Invalid sync parameters');
      return;
    }

    setShowSyncOptions(false);
    setSyncSystem(system);
    setSyncStatus('syncing');
    setSyncError('');

    try {
      // Mock API response times (in milliseconds)
      const mockApiTime = {
        sap: 2000,
        netsuite: 1500,
        'position-green': 1800,
        default: 1500,
      };

      // Prepare sync data
      const syncData = {
        productId: product.id,
        system,
        timestamp: new Date().toISOString(),
        data: {
          name: product.name,
          producer: product.producer,
          company: product.company,
        },
      };

      // Simulate API call
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(syncData);
        }, mockApiTime[system] || mockApiTime.default);
      });

      // Store sync status in localStorage
      try {
        const syncedProducts = JSON.parse(
          localStorage.getItem('syncedProducts') || '{}'
        );
        syncedProducts[product.id] = {
          system,
          timestamp: new Date().toISOString(),
          status: 'success',
        };
        localStorage.setItem('syncedProducts', JSON.stringify(syncedProducts));
      } catch (storageError) {
        console.warn('Failed to store sync status:', storageError);
      }

      setIsSynced(true);
      setSyncStatus('success');
      setSyncError('');

      // Reset status after delay
      setTimeout(() => {
        setSyncStatus('');
        setSyncSystem('');
      }, 3000);
    } catch (error) {
      console.error('Sync error:', error);
      setSyncStatus('error');
      setSyncError(error.message || 'Sync failed');

      setTimeout(() => {
        setSyncStatus('');
        setSyncSystem('');
      }, 3000);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>{translatedText['Loading']}...</p>
      </div>
    );
  }

  if (!product) {
    return <div>{translatedText['Loading']}...</div>;
  }

  return (
    <>
      <Header />

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
              {isSynced && <div className={styles.syncedBadge}>{'Synced'}</div>}
              <ProductPassport
                product={product}
                translatedText={translatedText}
              />
            </div>

            <div className={styles.passportRight}>
              <button
                onClick={handleCSVDownload}
                className={styles.labelButtons}
                disabled={!product || isLoading}
              >
                {'Download as CSV'}
              </button>

              <div ref={syncDropdownRef} className={styles.syncSection}>
                <button
                  onClick={() => setShowSyncOptions(!showSyncOptions)}
                  className={styles.labelButtons}
                  disabled={!product || isLoading || syncStatus === 'syncing'}
                >
                  {syncStatus === 'syncing' ? 'Syncing...' : 'Sync wine'}
                </button>
                {showSyncOptions && (
                  <div className={styles.syncOptions}>
                    <button
                      className={styles.labelButtons}
                      onClick={() => handleImporterSync('sap')}
                    >
                      SAP
                    </button>
                    <button
                      className={styles.labelButtons}
                      onClick={() => handleImporterSync('netsuite')}
                    >
                      NetSuite
                    </button>
                    <button
                      className={styles.labelButtons}
                      onClick={() => handleImporterSync('position-green')}
                    >
                      Position Green
                    </button>
                  </div>
                )}
                {syncStatus === 'success' && (
                  <div className={styles.labelButtons}>
                    {translatedText['Sync successful'] || 'Sync successful'}
                  </div>
                )}
                {syncStatus === 'error' && (
                  <div className={styles.labelButtons}>
                    {translatedText['Sync failed'] || 'Sync failed'}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className={styles.cardSection}>
            <ProductInfo product={product} translatedText={translatedText} />
            <NutritionDeclaration
              product={product}
              translatedText={translatedText}
            />
          </div>

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

          <div className={styles.cardSection}>
            <SustainabilityInformation
              product={product}
              translatedText={translatedText}
            />
          </div>

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
                href='https://www.journy.se/'
                target='_blank'
                rel='noopener noreferrer'
                style={{ textDecoration: 'none', color: 'inherit' }}
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
