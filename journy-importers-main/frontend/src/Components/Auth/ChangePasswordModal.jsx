import { useState } from 'react';
import styles from '../Auth/changePassword.module.scss';
import React from 'react';

const ChangePasswordModal = ({ isOpen, onClose, onSubmit, error, translatedText }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationError, setValidationError] = useState('');
  const handleSubmit = (e) => {
    e.preventDefault();

    setValidationError('');

    if (newPassword !== confirmPassword) {
      setValidationError(translatedText['New passwords do not match']);
      return; // Stop the form submission
    }

    onSubmit(currentPassword, newPassword);
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>{translatedText['Change Password']}</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>{translatedText['Current Password']}</label>
            <input
              type='password'
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>{translatedText['New Password']}</label>
            <input
              type='password'
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>{translatedText['Confirm New Password']}</label>
            <input
              type='password'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          {validationError && (
            <div className={styles.error}>{validationError}</div>
          )}
          {error && <div className={styles.error}>{error}</div>}
          <div className={styles.buttonGroup}>
            <button type='submit'>{translatedText['Change Password']}</button>
            <button type='button' onClick={onClose}>
              {translatedText['Cancel']}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
