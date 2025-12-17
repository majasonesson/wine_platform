import { useState } from 'react';
import { Footer } from '../../layout/Footer';

export const CertificationStep = ({
  styles,
  translatedText,
  formData,
  setFormData,
  setSustainabilityImages,
  setUploadModalMessage,
  setUploadDocModal,
  nextStepValidation,
}) => {
  const [uploadStatus, setUploadStatus] = useState({});
  const [uploadErrors, setUploadErrors] = useState({});

  const certificationOptions = [
    {
      value: 'SQNPI',
      label: 'SQNPI',
      image: '/assets/Images/SQPNI.png',
    },
    {
      value: 'KRAV',
      label: 'KRAV',
      image: '/assets/Images/Krav.png',
    },
    {
      value: 'EU_ORGANIC',
      label: 'EU Organic',
      image: '/assets/Images/EU.png',
    },
  ];

  const handleCertificationImageUpload = async (certType, e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size (5MB = 5 * 1024 * 1024 bytes)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setUploadModalMessage(translatedText['File size exceeds 5MB limit']);
      setUploadDocModal(true);
      return;
    }

    // Check file type
    const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      setUploadModalMessage(
        translatedText['Invalid file type. Please upload PDF, PNG, or JPG']
      );
      setUploadDocModal(true);
      return;
    }

    try {
      // Update form data with the actual file
      setFormData((prev) => ({
        ...prev,
        certificationDetails: {
          ...prev.certificationDetails,
          [certType]: {
            ...prev.certificationDetails[certType],
            document: file,
          },
        },
      }));

      // Add file to sustainabilityImages
      setSustainabilityImages((prev) => [...prev, file]);
      setUploadStatus((prev) => ({ ...prev, [certType]: 'success' }));
    } catch (error) {
      console.error('Upload error:', error);
      setUploadErrors((prev) => ({ ...prev, [certType]: error.message }));
      setUploadStatus((prev) => ({ ...prev, [certType]: 'error' }));
      setUploadDocModal(true);
    }
  };

  const handleCheckboxChange = (certType, checked) => {
    setFormData((prev) => ({
      ...prev,
      certificationDetails: {
        ...prev.certificationDetails,
        [certType]: {
          ...prev.certificationDetails[certType],
          isActive: checked,
        },
      },
    }));
  };

  const handleCertificationDetailChange = (certType, field, value) => {
    setFormData((prev) => ({
      ...prev,
      certificationDetails: {
        ...prev.certificationDetails,
        [certType]: {
          ...prev.certificationDetails[certType],
          [field]: value,
        },
      },
    }));
  };

  return (
    <div className={styles.certificationSection}>
      <h2>
        {undefined
          ? 'Sustainability Certifications'
          : translatedText['Sustainability Certifications']}
      </h2>
      <p>{translatedText['Select your certifications']}</p>
      <p className={styles.certificateHelper}>
        {translatedText['Please select the certifications relevant to you']}.
      </p>
      <div className={styles.certificationsGrid}>
        {certificationOptions.map((cert) => (
          <div key={cert.value}>
            <div className={styles.certificationCheckboxWrapper}>
              <label htmlFor={cert.value}>{cert.label}</label>
              <input
                className={styles.customRoundCheckbox}
                type='checkbox'
                id={cert.value}
                checked={formData.certificationDetails[cert.value].isActive}
                onChange={(e) =>
                  handleCheckboxChange(cert.value, e.target.checked)
                }
              />
            </div>

            {/* Only render the card if isActive is true */}
            {formData.certificationDetails[cert.value].isActive && (
              <div className={styles.certificationCard}>
                <div className={styles.certHeader}>
                  <img
                    src={cert.image}
                    alt={`${cert.label} logo`}
                    className={styles.certificationLogo}
                  />
                  <h3>{cert.label}</h3>
                </div>
                <div>
                  <p className={styles.pStyle}>
                    {translatedText['Expiry Date']}
                  </p>
                  <input
                    required
                    className={styles.inputField}
                    type='date'
                    placeholder={
                      undefined ? 'Expiry Date' : translatedText['Expiry Date']
                    }
                    value={formData.certificationDetails[cert.value].expiryDate}
                    onChange={(e) =>
                      handleCertificationDetailChange(
                        cert.value,
                        'expiryDate',
                        e.target.value
                      )
                    }
                  />
                </div>
                <div>
                  <p className={styles.pStyle}>
                    {translatedText['Reference Number']}
                  </p>
                  <input
                    required
                    type='text'
                    className={styles.inputField}
                    placeholder={
                      undefined
                        ? 'Reference Number'
                        : translatedText['Reference Number']
                    }
                    value={
                      formData.certificationDetails[cert.value].referenceNumber
                    }
                    onChange={(e) =>
                      handleCertificationDetailChange(
                        cert.value,
                        'referenceNumber',
                        e.target.value
                      )
                    }
                  />
                </div>
                <p className={styles.pStyle}>
                  {translatedText['Upload Document']}
                </p>
                <div className={styles.fileUploadContainer}>
                  {uploadStatus[cert.value] === 'success' ? (
                    <div className={styles.uploadSuccess}>
                      <div className={styles.iconAndName}>
                        <img
                          className={styles.uploadedIcon}
                          src='/assets/Images/uploadedIcon.png'
                          alt='uploadedIcon'
                        />
                        <p className={styles.fileName}>
                          {
                            formData.certificationDetails[cert.value]?.document
                              ?.name
                          }
                        </p>
                      </div>
                      <div className={styles.successMessage}>
                        <span className={styles.successIcon}>✓</span>
                        <p>{translatedText['The file is accepted']}</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <img
                        src='/assets/Images/uploadedIcon.png'
                        alt='Upload document'
                        className={styles.uploadedIcon}
                      />
                      <p className={styles.uploadP}>
                        {translatedText['Upload']}
                      </p>
                      <input
                        type='file'
                        accept='image/*'
                        onChange={(e) =>
                          handleCertificationImageUpload(cert.value, e)
                        }
                      />
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className={styles.buttonContainer}>
        <button type='button' onClick={nextStepValidation}>
          {undefined ? 'Next' : translatedText['Next']}
        </button>
      </div>
    </div>
  );
};
