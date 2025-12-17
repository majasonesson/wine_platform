import { NavLink } from 'react-router-dom';
import styles from '../../styles/ProducerSupplierLogin.module.scss';
import { useEffect, useState } from 'react';
import { SelectLanguage } from '../layout/SelectLanguage';

export const ProducerSupplierLogin = () => {
  const [language, setLanguage] = useState(
    localStorage.getItem('language') || ''
  );

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const handleLanguageChange = (e) => setLanguage(e.target.value);

  return (
    <div className={styles['producer-supplier-container']}>
      <div className={styles['content-box']}>
        <h1>{'Welcome to Journy'}</h1>
        <p>{'Are you a producer or a supplier?'}</p>
        <div className={styles['buttons-container']}>
          <NavLink
            to="/producer"
            className={styles.button}
          >
            {'Producer login'}
          </NavLink>
          <NavLink
            to="/coming-soon"
            className={styles.button}
          >
            {'Supplier login'}
          </NavLink>
        </div>
      </div>
    </div>
  );
};
