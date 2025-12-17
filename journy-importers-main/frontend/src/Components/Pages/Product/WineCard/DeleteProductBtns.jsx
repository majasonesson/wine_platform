import styles from '../../../../styles/deleteProduct.module.scss';

export const DeleteProductBtns = ({ 
  handleDeleteProduct, 
  wineId, 
  handleClose, 
  translatedText
}) => {

  return (
    <div className={styles.deleteBtnContainer}>
      <button className={styles.cancelBtn} onClick={handleClose}>{translatedText['Cancel']}</button>
      <button className={styles.deleteProduct} onClick={() => handleDeleteProduct(wineId)}>{translatedText['Delete Product']}</button>
    </div>
  )
}