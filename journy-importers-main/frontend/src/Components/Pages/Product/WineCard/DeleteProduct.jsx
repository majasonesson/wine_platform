import { deleteProduct } from '../../../../Services/Httpclient';
import { Modal } from '../../../layout/Modal';
import { useState } from 'react';
import styles from '../../../../styles/deleteProduct.module.scss';
import { LoadingModal } from '../../../layout/LoadingModal';

export const DeleteProduct = ({
  product,
  setProducts,
  translatedText
}) => {
  const [modalMessage, setModalMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const showModal = (message) => {
    setModalMessage(message);
  };

  const handleModalClose = () => {
    setModalMessage('');
  };

  const handleDeleteProduct = async (id) => {
    try {
      setLoading(true);
      await deleteProduct(id);
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.WineID !== id)
      );
    } catch (error) {
      console.error('error deleting product', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className={styles['delete-product-container']}>
        {loading && <LoadingModal translatedText={translatedText} />}
        <button
          onClick={() => showModal(translatedText['Delete confirmation'])}
          className={styles['delete-button']}
          aria-label={translatedText['Delete Product']}
        />
      </div>
      <Modal
        message={modalMessage}
        onClose={handleModalClose}
        handleDeleteProduct={handleDeleteProduct}
        wineId={product.WineID}
        translatedText={translatedText}
      />
    </>
  );
};
