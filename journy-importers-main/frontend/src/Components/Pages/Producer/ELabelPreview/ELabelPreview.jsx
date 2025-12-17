import { useEffect, useState } from 'react';
import styles from '../../../../styles/eLabelPreview.module.scss';
import iPhoneSvg from '/assets/Images/Iphone 14.svg';
import { fetchUser, getCertifications } from '../../../../Services/HttpClient';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { Nutrition } from '../Nutrition/Nutrition';
import { useNavigate } from 'react-router-dom';
import { ProductionDetailsPreview } from '../../Product/WineData/ProductionProcess/ProductionDetailsPreview';
import { SparklingWinePreview } from '../../Product/WineData/ProductionProcess/sparklingWinePreview';
import EU_ORGANIC from '/assets/Images/EU.png';
import KRAV from '/assets/Images/Krav.png';
import SQNPI from '/assets/Images/SQPNI.png';

export const ELabelPreview = ({
  wineData,
  handleWineChange,
  setWineData,
  handleSubmit,
  onPrevious,
  image,
  translatedText,
  imageUrl,
  setImageUrl,
  showModal,
}) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [userCertifications, setUserCertifications] = useState([]);
  const [userData, setUserData] = useState(null);

  // Define a mapping of certification types to imported images
  const certificationImages = {
    KRAV: KRAV,
    SQNPI: SQNPI,
    EU_ORGANIC: EU_ORGANIC,
  };

  const token = Cookies.get('token');
  const navigate = useNavigate();

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
    // Fetch user's certifications on component mount
    const fetchUserCertifications = async () => {
      const fetchCertifications = await getCertifications();

      setUserCertifications(fetchCertifications);
    };

    fetchUserCertifications();
  }, []);

  useEffect(() => {
    setImageUrl(imageUrl);
  }, [imageUrl]);

  if (!userData) return;

  const getGrapeText = (grape, percentage, translatedText) => {
    if (!grape || !percentage) return null;

    // Check if it's not "Other" and has a translation
    if (
      translatedText[grape] &&
      translatedText[grape] !== translatedText['Other (please specify)']
    ) {
      return `${percentage}% ${translatedText[grape]}`;
    }
    // If no translation exists or it's a custom entry, return the original text
    return `${percentage}% ${grape}`;
  };

  const productInfo = wineData.productInfo;

  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
  };

  if (!wineData) return null;

  const ingredientsValues = productInfo?.Ingredients?.split(', ');
  const ingredients = ingredientsValues?.map((ingredient) =>
    ingredient.split('-').pop()
  );

  const ingredientList =
    translatedText?.ingredients && ingredients
      ? ingredients
          .map((ingredient) => {
            const translatedIngredient = Object.values(
              translatedText.ingredients
            ).find((category) => category.items[ingredient]);
            return translatedIngredient
              ? translatedIngredient.items[ingredient]
              : null;
          })
          .filter(Boolean)
      : [];

  if (typeof wineData?.Certificates !== 'string') return;
  const parsedCertificates = wineData?.Certificates?.split(', ').map(
    (entry) => {
      const [type, ref] = entry.split('::');
      return { type, ref };
    }
  );

  return (
    <div className={styles.previewContainer}>
      <div className={styles.navigation}>
        <button className={styles.previousButton} onClick={onPrevious}>
          <svg viewBox='0 0 24 24' fill='none'>
            <path d='M15 18L9 12L15 6' stroke='white' strokeWidth='2' />
          </svg>
          <span>{translatedText['Previous']}</span>
        </button>
        {!isZoomed && (
          <button
            className={styles.nextButton}
            onClick={() => {
              handleSubmit();
              showModal(translatedText['Upload Successfull']); // Show success message
              setTimeout(() => navigate('/producer'), 500);
            }}
          >
            <svg viewBox='0 0 24 24' fill='none'>
              <path d='M9 18L15 12L9 6' stroke='white' strokeWidth='2' />
            </svg>
            <span>{translatedText['Confirm']}</span>
          </button>
        )}
      </div>

      {isZoomed && (
        <button
          className={styles.fixedNextButton}
          onClick={() => {
            handleSubmit();
            showModal(translatedText['Upload Successfull']); // Show success message
            setTimeout(() => navigate('/producer'), 500);
          }}
        >
          <svg
            width='24'
            height='18'
            viewBox='0 0 24 18'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              d='M8.39264 18L0 9.46778L2.09816 7.33472L8.39264 13.7339L21.9018 0L24 2.13306L8.39264 18Z'
              fill='white'
            />
          </svg>
          <span>{translatedText['Confirm']}</span>
        </button>
      )}

      <div className={styles.mobilePreview}>
        <div className={styles.previewCard}>
          <div className={styles.titleContainer}>
            <h2 className={styles.title}>
              4. {translatedText['E-Label Preview']}
            </h2>
          </div>

          <div className={styles.contentContainer}>
            <div
              className={`${styles.iPhoneContainer} ${
                isZoomed ? styles.iPhoneContainerZoomed : ''
              }`}
            >
              <button
                className={`${styles.zoomButton} ${
                  isZoomed ? styles.zoomButtonZoomed : ''
                }`}
                onClick={toggleZoom}
              >
                <svg
                  width='29'
                  height='30'
                  viewBox='0 0 29 30'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <rect
                    x='0.660156'
                    width='27.4993'
                    height='29.3958'
                    rx='5'
                    fill='#717171'
                  />
                  <path
                    d='M12.8473 7.7959H9.32409C8.85689 7.7959 8.40882 7.98149 8.07846 
                    8.31186C7.7481 8.64222 7.5625 9.09029 7.5625 9.55749V20.127C7.5625 20.5942 7.7481 
                    21.0423 8.07846 21.3727C8.40882 21.703 8.85689 21.8886 9.32409 21.8886H19.8936C20.3608 
                    21.8886 20.8089 21.703 21.1393 21.3727C21.4696 21.0423 21.6552 20.5942 21.6552 
                    20.127V16.6038M14.6089 14.8423L21.6552 7.7959M21.6552 7.7959V12.1999M21.6552 7.7959H17.2512'
                    stroke='white'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
              </button>

              <div className={styles.phoneImageContainer}>
                <img
                  src={iPhoneSvg}
                  alt='iPhone frame'
                  className={styles.phoneImage}
                />
              </div>
              <div className={styles.phoneContent}>
                <div className={styles.appHeader}>
                  <span className={styles.appName}>Journy</span>
                  <div className={styles.disclaimer}>
                    <span className={styles.infoIcon}>i</span>
                    <p className={styles.disclaimerText}>
                      {translatedText['Education purposes']}
                    </p>
                  </div>
                </div>

                <div className={styles.productHeader}>
                  <div className={styles.productImage}>
                    {image ? (
                      <img src={URL.createObjectURL(image)} alt='Wine' />
                    ) : (
                      <div className={styles.placeholderImage}>
                        <img src={imageUrl} alt='Wine bottle placeholder' />
                      </div>
                    )}
                  </div>
                  <div className={styles.productInfo}>
                    <h1 className={styles.productName}>
                      {wineData?.Name || translatedText['Wine Name']}
                    </h1>
                    <p className={styles.productSubtitle}>
                      {translatedText[productInfo.Type] ||
                        translatedText['Type']}{' '}
                      {translatedText['wine by']}{' '}
                      {wineData?.BrandName || translatedText['Producer']}
                    </p>
                    <div className={styles.keyDetails}>
                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>
                          {translatedText['Year']}
                        </span>
                        <span className={styles.detailValue}>
                          {wineData?.WineYear || '2024'}
                        </span>
                      </div>
                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>
                          {translatedText['Country']}
                        </span>
                        <span className={styles.detailValue}>
                          {userData?.country || translatedText['Country']}
                        </span>
                      </div>
                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>
                          {translatedText['Alcohol']}
                        </span>
                        <span className={styles.detailValue}>
                          {productInfo.AlcoholVolume || '0'}%
                        </span>
                      </div>
                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>
                          {translatedText['Region']}
                        </span>
                        <span className={styles.detailValue}>
                          {userData.region}
                        </span>
                      </div>
                      <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>
                          {translatedText['Net quantity']}
                        </span>
                        <span className={styles.detailValue}>
                          {translatedText[productInfo.NetQuantity] ||
                            translatedText['750 ml']}
                        </span>
                      </div>
                      {userData.district && (
                        <div className={styles.detailItem}>
                          <span className={styles.detailLabel}>
                            {translatedText['District']}
                          </span>
                          <span className={styles.detailValue}>
                            {userData.district}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className={styles.wineOverviewSection}>
                  <div className={styles.wineOverview}>
                    <h2 className={styles.sectionTitle}>
                      {translatedText['Wine Overview']}
                    </h2>
                    <div className={styles.overviewItems}>
                      <div className={styles.overviewItem}>
                        <h3 className={styles.itemTitle}>
                          {translatedText['Grape variety']}
                        </h3>
                        <p className={styles.itemValue}>
                          {[
                            getGrapeText(
                              productInfo.MajorGrape,
                              productInfo.MajorGrapePercentage,
                              translatedText
                            ),
                            getGrapeText(
                              productInfo.SecondGrape,
                              productInfo.SecondGrapePercentage,
                              translatedText
                            ),
                            getGrapeText(
                              productInfo.ThirdGrape,
                              productInfo.ThirdGrapePercentage,
                              translatedText
                            ),
                            getGrapeText(
                              productInfo.FourthGrape,
                              productInfo.FourthGrapePercentage,
                              translatedText
                            ),
                          ]
                            .filter(Boolean)
                            .join('\n') || translatedText['Not specified']}
                        </p>
                      </div>
                      <div className={styles.overviewItem}>
                        <h3 className={styles.itemTitle}>
                          {translatedText['Sulphite Amount']}
                        </h3>
                        <p className={styles.itemValue}>
                          {productInfo.Sulphites !== undefined
                            ? productInfo.Sulphites + 'mg/L'
                            : translatedText['Less than 10mg/L']}
                        </p>
                      </div>
                      <div className={styles.overviewItem}>
                        <h3 className={styles.itemTitle}>
                          {translatedText['Ingredients']}
                        </h3>
                        <p className={styles.itemValue}>
                          {ingredientList.length > 0
                            ? ingredientList.join(', ')
                            : translatedText['Grapes, sulphites']}
                        </p>
                      </div>
                      <div className={styles.overviewItem}>
                        <h3 className={styles.itemTitle}>
                          {translatedText['Residual Sugar']}
                        </h3>
                        <p className={styles.itemValue}>
                          {productInfo.ResidualSugar + 'g/L' ||
                            translatedText['2.5g/L']}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className={styles.nutritionDeclaration}>
                    <h2 className={styles.sectionTitle}>
                      {translatedText['Nutrition Declaration']}
                    </h2>
                    <div className={styles.nutritionValues}>
                      <div className={styles.nutritionRow}>
                        <Nutrition
                          wineData={wineData}
                          setWineData={setWineData}
                          handleWineChange={handleWineChange}
                          translatedText={translatedText}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                {wineData.productionDetails &&
                  Object.values(wineData.productionDetails).some(
                    (val) => val !== ''
                  ) && (
                    <>
                      <ProductionDetailsPreview
                        wineData={wineData}
                        translatedText={translatedText}
                      />
                      <SparklingWinePreview
                        wineData={wineData}
                        translatedText={translatedText}
                      />
                    </>
                  )}

                {/* Sustainability Section */}
                <div>
                  {parsedCertificates?.length > 0 && (
                    <div className={styles.sustainabilitySection}>
                      {parsedCertificates[0].types === '' &&
                        parsedCertificates?.map(({ type, ref }, index) => (
                          <>
                            <h2 className={styles.sustainabilityTitle}>
                              {certificationImages[type] &&
                                translatedText['Sustainability']}
                            </h2>
                            <h3 className={styles.organicTitle}>
                              {certificationImages[type] &&
                                translatedText['This is an organic wine']}
                            </h3>
                            <section
                              key={index}
                              className={styles.certificationItem}
                            >
                              <div className={styles.certificationContent}>
                                {certificationImages[type] && (
                                  <img
                                    className={styles.certificationImage}
                                    src={certificationImages[type]}
                                    alt={`Sustainability ${index}`}
                                  />
                                )}

                                <div className={styles.certificationTypes}>
                                  {type === 'KRAV' && (
                                    <p>{translatedText['KRAV']}</p>
                                  )}
                                  {type === 'SQNPI' && (
                                    <p>{translatedText['SQNPI']}</p>
                                  )}
                                  {type === 'EU_ORGANIC' && (
                                    <p>{translatedText['EU_ORGANIC']}</p>
                                  )}
                                </div>
                              </div>
                              <div className={styles.referenceContainer}>
                                <h4 className={styles.referenceTitle}>
                                  {certificationImages[type] &&
                                    translatedText['Reference Number']}
                                </h4>
                                <p className={styles.referenceNumber}>{ref}</p>
                              </div>
                            </section>
                          </>
                        ))}

                      <div className={styles.recyclingSection}>
                        <h3 className={styles.recyclingTitle}>
                          {translatedText['Recycling Instructions']}
                        </h3>
                        <p className={styles.recyclingText}>
                          {translatedText['Recycling Instructions text']}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                <div className={styles.responsibilitySection}>
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

                <div className={styles.footerWrapper}>
                  <footer className={styles.footer}>
                    @Journy{new Date().getFullYear()}{' '}
                    {translatedText['all rights reserved']}
                  </footer>
                </div>
              </div>
            </div>

            {isZoomed && (
              <div className={styles.scrollInstructions}>
                <p>{translatedText['Scroll down to look at the whole page']}</p>
                <svg
                  width='85'
                  height='60'
                  viewBox='0 0 85 60'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M84.4776 2.25813C84.6202 1.44206 84.0742 0.664935 83.2581 0.522376C82.4421 0.379818 81.6649 0.925806 81.5224 1.74187L84.4776 2.25813ZM75.9688 12.7333L77.0957 13.7232L75.9688 12.7333ZM37.1562 41.6622L36.5676 40.2826L37.1562 41.6622ZM0.93934 46.9393C0.353553 47.5251 0.353553 48.4749 0.93934 49.0607L10.4853 58.6066C11.0711 59.1924 12.0208 59.1924 12.6066 58.6066C13.1924 58.0208 13.1924 57.0711 12.6066 56.4853L4.12132 48L12.6066 39.5147C13.1924 38.9289 13.1924 37.9792 12.6066 37.3934C12.0208 36.8076 11.0711 36.8076 10.4853 37.3934L0.93934 46.9393ZM81.5224 1.74187C81.2515 3.29241 80.3884 4.91337 79.1332 6.63518C77.8787 8.35592 76.3504 10.0258 74.8418 11.7434L77.0957 13.7232C78.5412 12.0776 80.1993 10.2654 81.5574 8.40245C82.9147 6.54062 84.0901 4.47651 84.4776 2.25813L81.5224 1.74187ZM74.8418 11.7434C65.9586 21.8567 52.8025 33.3557 36.5676 40.2826L37.7449 43.0419C54.5137 35.8872 68.018 24.0581 77.0957 13.7232L74.8418 11.7434ZM36.5676 40.2826C28.393 43.7704 12.832 46.5 2 46.5V49.5C13.1282 49.5 29.11 46.7261 37.7449 43.0419L36.5676 40.2826Z'
                    fill='#4E001D'
                  />
                </svg>
              </div>
            )}
          </div>
        </div>
      </div>
      {isZoomed && <div className={styles.blurOverlay}></div>}
    </div>
  );
};
