import { useState } from 'react';
import React from 'react';
import styles from './ResetPasswordModal.module.scss';
import { requestPasswordReset } from '../../Services/Httpclient';

export const ResetPasswordModal = ({ translatedText, isOpen, onClose, onSubmit, error }) => {
  const [email, setEmail] = useState('');
  const [validationError, setValidationError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setValidationError('');
    setSuccessMessage('');

    if (!email) {
      setValidationError(translatedText['Email is required']);
      return; // Stop the form submission
    }

    try {
      setIsSubmitting(true);
      await requestPasswordReset(email);
      setSuccessMessage(translatedText['Password reset link has been sent to your email']);
      setTimeout(() => {
        onClose();
      }, 3000);
    } catch (error) {
      setValidationError(
        error.response?.data?.message || translatedText['Failed to send reset link']
      );
    } finally {
      setIsSubmitting(false);
    }

    onSubmit(email);
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>{translatedText['Reset Password']}</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>{translatedText['Email']}</label>
            <input
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          {validationError && (
            <div className={styles.error}>{validationError}</div>
          )}
          {error && <div className={styles.error}>{error}</div>}
          <div className={styles.buttonGroup}>
            <button type='submit'>{translatedText['Send Email']}</button>
            <button type='button' onClick={onClose}>
              {translatedText['Cancel']}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
