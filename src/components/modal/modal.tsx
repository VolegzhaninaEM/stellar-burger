import { CloseIcon } from '@krgaa/react-developer-burger-ui-components';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

import ModalOverlay from '../modal-overlay/modal-overlay';

import type { JSX, ReactNode } from 'react';

import modalStyles from './modal.module.css';

type TModalProps = {
  onClose: () => void;
  children: ReactNode;
};

export const Modal = ({ onClose, children }: TModalProps): JSX.Element | null => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true); // гарантируем, что мы в браузере
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return (): void => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const modalRoot = document.getElementById('app');

  if (!mounted || !modalRoot) return null;

  return createPortal(
    <>
      <ModalOverlay onClose={onClose} />
      <div className={modalStyles.modal} role="dialog" aria-modal="true">
        <button
          className={modalStyles.closeButton}
          onClick={onClose}
          type="button"
          aria-label="Закрыть модальное окно"
        >
          <CloseIcon type="primary" />
        </button>
        {children}
      </div>
    </>,
    modalRoot
  );
};
