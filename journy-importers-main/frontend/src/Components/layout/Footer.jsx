import styles from '../../styles/footer.module.scss';

export const Footer = ({ translatedText }) => {
  return (
    <div className={styles.footerWrapper}>
      <footer className={styles.footer}>
        @Journy{new Date().getFullYear()}{' '}
        {translatedText['all rights reserved'] || 'All rights reserved'}
      </footer>
    </div>
  );
};
