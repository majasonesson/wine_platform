import { Link, NavLink } from 'react-router-dom';
import styles from '../../../styles/producerPage.module.scss';
import { useState } from 'react';
import { Modal } from '../../layout/Modal';

export const AddProductLink = ({ translatedText, user }) => {
  const [modalMessage, setModalMessage] = useState('');

  const showModal = (message) => {
    setModalMessage(message);
  };

  const handleModalClose = () => {
    setModalMessage('');
  };

  return (
    <>
      {user?.labels <= 0 ? (
        <div
          onClick={() =>
            showModal(
              <>
                You have used all your available wine labels. To add more,
                please{' '}
                <NavLink to='/producer/profile/settings/plan'>
                  upgrade your plan
                </NavLink>{' '}
                or <a href='mailto:hello@journy.se'>contact support</a>.
              </>
            )
          }
        >
          <span className={styles.addProductText}>
            {translatedText['Add Product']}
          </span>
          <div className={styles.plusIcon}></div>
        </div>
      ) : (
        <Link to='addproduct' className={styles.addProductLink}>
          <span className={styles.addProductText}>
            {translatedText['Add Product']}
          </span>
          <div className={styles.plusIcon}></div>
        </Link>
      )}
      <Modal
        message={modalMessage}
        onClose={handleModalClose}
        translatedText={translatedText}
      />
    </>
  );
};
