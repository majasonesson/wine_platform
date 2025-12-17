import { NavLink } from "react-router-dom";
import styles from '../../../../styles/updateProductLink.module.scss';

export const UpdateProductLink = ({ 
  wineId,
  translatedText
}) => {
  return (
    <NavLink
      to={`/producer/updateProduct/${wineId}`}
      className={styles.updateProductLink}
    >
      {translatedText['Edit Product']}
    </NavLink>
  );
  
};
