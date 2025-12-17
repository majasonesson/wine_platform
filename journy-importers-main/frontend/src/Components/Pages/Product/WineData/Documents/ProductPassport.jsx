import styles from '../../../../../styles/productPassport.module.scss';

export const ProductPassport = ({ product, translatedText }) => {
  return (
    <div className={styles.passportContainer}>
      <img
        src={product.ImageURL}
        alt={product.Name}
        className={styles.wineImage}
      />
      <div className={styles.productHeader}>
        <div className={styles.productInfo}>
          <h1 className={styles.productName}>
            {product.Name || translatedText['Wine Name']}
          </h1>

          <p className={styles.productSubtitle}>
            {translatedText[product.Type] || translatedText['Type']}{' '}
            {translatedText['wine by']} {product.BrandName}
          </p>

          <div className={styles.keyDetails}>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>
                {translatedText['Year']}
              </span>
              <span className={styles.detailValue}>
                {product.WineYear || '2024'}
              </span>
            </div>

            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>
                {translatedText['Country']}
              </span>
              <span className={styles.detailValue}>{product?.Country}</span>
            </div>

            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>
                {translatedText['Alcohol']}
              </span>
              <span className={styles.detailValue}>
                {product.AlcoholVolume || '0'}%
              </span>
            </div>

            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>
                {translatedText['Region']}
              </span>
              <span className={styles.detailValue}>{product.Region}</span>
            </div>

            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>
                {translatedText['Net quantity']}
              </span>
              <span className={styles.detailValue}>{product.NetQuantity}</span>
            </div>

            {product.District && (
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>
                  {translatedText['District']}
                </span>
                <span className={styles.detailValue}>{product.District}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
