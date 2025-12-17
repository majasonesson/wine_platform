'use client';

import { useEffect, useState } from 'react';
import '../../app/styles/modal.css';

interface ModalProps {
  message?: string;
  onClose?: () => void;
  isOpenInitially?: boolean;
  handleDeleteProduct?: (wineId: number) => void;
  wineId?: number;
  translatedText?: Record<string, string>;
  children?: React.ReactNode;
}

export const Modal = ({
  message = '',
  onClose,
  isOpenInitially = false,
  handleDeleteProduct,
  wineId,
  translatedText = {},
  children,
}: ModalProps) => {
  const [isOpen, setIsOpen] = useState(isOpenInitially);

  useEffect(() => {
    if (message) setIsOpen(true);
  }, [message]);

  const handleClose = () => {
    setIsOpen(false);
    if (onClose) onClose();
  };

  const handleClickOutside = (event: React.MouseEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).className === 'modal') {
      handleClose();
    }
  };

  const stopPropagation = (e: React.MouseEvent) => e.stopPropagation();

  if (!isOpen) return null;

  return (
    <div className="modal" onClick={handleClickOutside}>
      <div className="modal-content" onClick={stopPropagation}>
        <span className="close" onClick={handleClose}>
          &times;
        </span>
        {message && <p>{message}</p>}
        {children}
        {handleDeleteProduct && wineId && (
          <div className="button-group">
            <button onClick={() => handleDeleteProduct(wineId)}>
              {translatedText['Delete'] || 'Delete'}
            </button>
            <button onClick={handleClose}>
              {translatedText['Cancel'] || 'Cancel'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

