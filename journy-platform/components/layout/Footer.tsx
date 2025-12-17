import styles from '@/app/styles/footer.module.scss';

interface FooterProps {
  translatedText?: Record<string, string>;
}

export const Footer = ({ translatedText = {} }: FooterProps) => {
  return (
    <div className={styles.footerWrapper}>
      <footer className={styles.footer}>
        @Journy{new Date().getFullYear()}{' '}
        {translatedText['all rights reserved'] || 'All rights reserved'}
      </footer>
    </div>
  );
};

