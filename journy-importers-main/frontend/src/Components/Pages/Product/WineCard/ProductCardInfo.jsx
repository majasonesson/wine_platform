import styles from '../../../../styles/productCardInfo.module.scss';

export const ProductCardInfo = ({ product }) => {
  return (
    <div className={styles.cardContainer}>
      <img
        src={product.ImageURL}
        alt={product.Name}
        className={styles.productImage}
      />
      <h1 className={styles.productTitle}>
        {product.Name} {product.WineYear}
      </h1>
    </div>
  );
};
