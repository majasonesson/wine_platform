'use client';

import { useState } from 'react';
import { requestPasswordReset } from '@/lib/api-client';
import styles from '@/app/styles/login.module.scss';

interface ResetPasswordModalProps {
  translatedText: Record<string, string>;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (email: string) => void;
  error?: string;
}

export const ResetPasswordModal = ({
  translatedText,
  isOpen,
  onClose,
  onSubmit,
  error,
}: ResetPasswordModalProps) => {
  const [email, setEmail] = useState('');
  const [validationError, setValidationError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setValidationError('');
    setSuccessMessage('');

    if (!email) {
      setValidationError(translatedText['Email is required'] || 'Email is required');
      return;
    }

    try {
      setIsSubmitting(true);
      await requestPasswordReset(email);
      setSuccessMessage(
        translatedText['Password reset link has been sent to your email'] ||
          'Password reset link has been sent to your email'
      );
      setTimeout(() => {
        onClose();
      }, 3000);
    } catch (error: any) {
      setValidationError(
        error.response?.data?.message ||
          translatedText['Failed to send reset link'] ||
          'Failed to send reset link'
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
        <h2>{translatedText['Reset Password'] || 'Reset Password'}</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>{translatedText['Email'] || 'Email'}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          {validationError && <div className={styles.error}>{validationError}</div>}
          {error && <div className={styles.error}>{error}</div>}
          {successMessage && <div className={styles.success}>{successMessage}</div>}
          <div className={styles.buttonGroup}>
            <button type="submit" disabled={isSubmitting}>
              {translatedText['Send Email'] || 'Send Email'}
            </button>
            <button type="button" onClick={onClose}>
              {translatedText['Cancel'] || 'Cancel'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

