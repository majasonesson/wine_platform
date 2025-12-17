import React from 'react';
import styles from '../../styles/CancelModal.module.scss';

const CancelModal = ({ isOpen, onClose, onConfirm, title, message, translatedText }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>{title}</h2>
        <p>{message}</p>
        <div className={styles.modalButtons}>
          <button onClick={onConfirm} className={styles.confirmBtn}>
            {translatedText['Yes']}
          </button>
          <button onClick={onClose} className={styles.cancelBtn}>
            {translatedText['No']}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelModal;
