import { useEffect } from 'react';
import SelectDropdown from '../../../Layout/SelectDropDown';

export const AddCertifications = ({
  handleWineChange,
  selectedCertifications = [], // This will now receive the pre-selected values
  setSelectedCertifications,
  translatedText,
  userCertifications,
  styles,
}) => {
  const certificationOptions = userCertifications.map((certification) => ({
    label:
      certification.CertificationType === 'EU_ORGANIC'
        ? 'EU Organic'
        : certification.CertificationType,
    value: certification.CertificationType || '',
  }));

  const handleSelectChange = (options) => {
    setSelectedCertifications(options);

    // Get selected certification types from dropdown
    const selectedTypes = options.map((option) => option.value);

    // Combine type + reference number only for selected ones
    const certTypeRefNumber = userCertifications
      .filter((cert) => selectedTypes.includes(cert.CertificationType))
      .map(
        (cert) => `${cert.CertificationType}::${cert.ReferenceNumber}` // Use actual key name here
      );

    // Fire fused values as a single string
    const certificationEvent = {
      target: {
        name: 'Certificates',
        value: certTypeRefNumber.join(', '),
      },
    };

    handleWineChange(certificationEvent);
  };
  
  return (
    <div className={styles.certificates}>
      <SelectDropdown
        multiple
        options={certificationOptions}
        selectedValue={selectedCertifications}
        name={'Certificates'}
        onChange={handleSelectChange}
        translatedText={translatedText}
        className='certificatesSelect certificatesDropdownTop'
      />
    </div>
  );
};
