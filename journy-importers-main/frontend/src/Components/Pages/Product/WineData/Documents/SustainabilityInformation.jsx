import { useEffect, useState } from 'react';
import { getCertifications } from '../../../../../Services/Httpclient.jsx';
import styles from './Sustainability.module.scss';
import KRAV from '/assets/Images/Krav.png';
import SQNPI from '/assets/Images/SQPNI.png';
import EU_ORGANIC from '/assets/Images/EU.png';

/* This component displays the sustainability information of wine product. */
export const SustainabilityInformation = ({ product, translatedText }) => {
  // Define a mapping of certification types to imported images
  const certificationImages = {
    'KRAV': KRAV,
    'SQNPI': SQNPI,
    'EU_ORGANIC': EU_ORGANIC,
  };

  const parsedCertificates = product.Certificates?.split(', ').map(
    (entry) => {
      const [type, ref] = entry.split('::');
      return { type, ref };
    }
  );

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>{translatedText['Sustainability']}</h2>

      <p className={styles.subtitle}>
        {translatedText['This is an organic wine']}
      </p>

      {parsedCertificates?.map(({type, ref}, index) => (
        <div key={index} className={styles.certRow}>
          <img
            src={certificationImages[type]}
            alt={type}
            className={styles.logo}
          />
          <div className={styles.certText}>
            <p>{translatedText[type]}</p>
            <p className={styles.ref}>
              {translatedText['Reference Number']}: {ref}
            </p>
          </div>
        </div>
      ))}

      <div className={styles.recycle}>
        <h3>{translatedText['Recycling Instructions']}</h3>
        <p>{translatedText['Recycling instructions text']}</p>
      </div>
    </div>
  );
};
