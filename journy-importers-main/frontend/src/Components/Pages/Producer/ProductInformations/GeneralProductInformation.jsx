import { useEffect, useState } from 'react';
import styles from '../../../../styles/generalProductInformation.module.scss';
import { fetchUser, getCertifications } from '../../../../Services/HttpClient';
import { AddCertifications } from './AddCertifications';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { CustomDropdown } from './CustomDropdown';

export const GeneralProductInformation = ({
  wineData,
  handleWineChange,
  translatedText,
  onNext,
  selectedCertifications,
  setSelectedCertifications,
  imageUrl,
  setImageUrl,
}) => {
  const [image, setImage] = useState(null);
  const [userCertifications, setUserCertifications] = useState([]);
  const [userData, setUserData] = useState(null);
  const [brand, setBrand] = useState('');

  useEffect(() => {
    // Fetch user's certifications on component mount
    const fetchUserCertifications = async () => {
      const certifications = await getCertifications();

      setUserCertifications(certifications);
    };

    fetchUserCertifications();
  }, []);

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

  useEffect(() => {
    if (wineData.BrandName) {
      setBrand(wineData.BrandName);
    }
  }, [wineData.BrandName]);

  if (!userData) return;

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImage(file);
      setImageUrl(url);

      // Create a custom event to pass the file to parent
      const customEvent = {
        target: {
          name: 'image',
          value: file,
        },
      };
      handleWineChange(customEvent);
    }
  };

  const certificates = [
    { id: 'sqpni', name: 'SQPNI' },
    { id: 'krav', name: 'KRAV' },
    { id: 'eu', name: 'EU Organic' },
  ];

  const validateInputFields = () => {
    // Fill in minimal default values if missing
    if (!wineData.Name) {
      handleWineChange({ target: { name: 'Name', value: translatedText['Unnamed Wine'] } });
    }

    if (!wineData.EAN) {
      handleWineChange({ target: { name: 'EAN', value: '0000000000000' } });
    }

    if (!wineData.WineYear) {
      handleWineChange({ target: { name: 'WineYear', value: '2024' } });
    }

    if (!wineData.BrandName) {
      handleWineChange({
        target: { name: 'BrandName', value: translatedText['Unknown Brand'] },
      });
    }

    if (selectedCertifications.length === 0) {
      setSelectedCertifications([]);

      handleWineChange({
        target: {
          name: 'Certificates',
          value: '', // Set to empty string
        },
      });
    }

    onNext(); // Proceed regardless of what's missing
  };

  const handleBrandChange = (e) => {
    const brandValue = e.target?.value.trim();

    setBrand(brandValue);

    const brandChange = {
      target: {
        name: 'BrandName',
        value: e.target?.value.trim(),
        type: 'select',
      },
    };

    handleWineChange(brandChange);
  };

  return (
    <div className={styles.container}>
      <h2>1. {translatedText['General Information']}</h2>
      <div className={styles.content}>
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

        <div className={styles.formFields}>
          <div className={styles.field}>
            <label>{translatedText['Product Name']} *</label>
            <input
              type='text'
              name='Name'
              value={wineData.Name}
              onChange={handleWineChange}
              placeholder={translatedText['Write here']}
            />
          </div>

          <div className={styles.field}>
            <label>EAN *</label>
            <input
              type='text'
              name='EAN'
              value={wineData.EAN}
              onChange={handleWineChange}
              placeholder='******'
            />
          </div>

          <div className={styles.field} style={{ zIndex: 1000, top: '141px' }}>
            <label data-name="brand">{translatedText['Brand Name']} *</label>
            <div
              className={styles.inputContainer}
              style={{ paddingTop: '1rem' }}
            >
              <CustomDropdown
                name='BrandName'
                value={brand || ''}
                options={
                  userData && userData.company
                    ? userData.company.split(', ').map((company) => ({
                        value: company,
                        label: company,
                      }))
                    : []
                }
                onChange={(e) => handleBrandChange(e)}
                translatedText={translatedText}
              />
            </div>

            <div style={{ marginBottom: '35px' }}></div>
            <label>{translatedText['Year']} *</label>
            <div className={styles.inputContainer}>
              <input
                type='text'
                name='WineYear'
                value={wineData.WineYear}
                onChange={handleWineChange}
                className={styles.input}
              />
              <svg
                className={styles.calendarIcon}
                width='23'
                height='26'
                viewBox='0 0 23 26'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M20.4444 23.4H2.55556V9.1H20.4444M16.6111 0V2.6H6.38889V0H3.83333V2.6H2.55556C1.13722 2.6 0 3.757 0 5.2V23.4C0 24.0896 0.269245 24.7509 0.748505 25.2385C1.22776 25.7261 1.87778 26 2.55556 26H20.4444C21.1222 26 21.7722 25.7261 22.2515 25.2385C22.7308 24.7509 23 24.0896 23 23.4V5.2C23 4.51044 22.7308 3.84912 22.2515 3.36152C21.7722 2.87393 21.1222 2.6 20.4444 2.6H19.1667V0M17.8889 14.3H11.5V20.8H17.8889V14.3Z'
                  fill='#808080'
                />
              </svg>
            </div>
          </div>

          <div className={styles.field}>
            <label>{translatedText['Certificates']} *</label>
            <AddCertifications
              handleWineChange={handleWineChange}
              selectedCertifications={selectedCertifications}
              setSelectedCertifications={setSelectedCertifications}
              translatedText={translatedText}
              userCertifications={userCertifications}
              styles={styles}
            />
          </div>
        </div>

        <div className={styles.buttonContainer}>
          <button onClick={validateInputFields} className={styles.nextButton}>
            <div className={styles.circle}>
              <div className={styles.arrow}></div>
            </div>
            <span>{translatedText['Next']}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
