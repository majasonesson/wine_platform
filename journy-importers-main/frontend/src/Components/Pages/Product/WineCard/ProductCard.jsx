import { NavLink } from "react-router-dom";
import { ProductCardInfo } from "./ProductCardInfo";
import { DeleteProduct } from './DeleteProduct';
import styles from '../../../../styles/productCard.module.scss';

// ProductCard.jsx
export const ProductCard = ({
  product,
  setProducts,
  translatedText,
  onDownloadQR
}) => {
  return (
    <div className={styles['product-card']}>
      <DeleteProduct 
        product={product}
        setProducts={setProducts}
        translatedText={translatedText}
      />
      <div className={styles['image-container']}>
        {product.ImageURL ? (
          <img 
            src={product.ImageURL} 
            alt={product.Name} 
            className={styles['product-image']}
          />
        ) : (
          <div className={styles['placeholder-image']}></div>
        )}
      </div>
      <div className={styles['product-info']}>
        <h3 className={styles['product-title']}>{product.Name || 'Title'}</h3>
      </div>
      <NavLink to={`product/${product.WineID}`}>
        <button className={styles['details-button']}>
          {translatedText['View']}
        </button>
      </NavLink>
      {/* QR-knappen kommenterad bort tillfälligt
      <button 
        onClick={onDownloadQR}
        className={styles['qr-button']}
      >
        {translatedText['QR Code']}
      </button>
      */}
    </div>
  );
};

