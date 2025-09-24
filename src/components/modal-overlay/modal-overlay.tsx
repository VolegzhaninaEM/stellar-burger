import type { FC, JSX, MouseEvent } from 'react';

import modalOverlayStyles from './modal-overlay.module.css';

type TModalOverlayProps = {
  onClose: () => void;
};

const ModalOverlay: FC<TModalOverlayProps> = ({
  onClose,
}: TModalOverlayProps): JSX.Element => {
  const handleClick = (evt: MouseEvent<HTMLDivElement>): void => {
    if (evt.target === evt.currentTarget) {
      onClose();
    }
  };

  return <div className={modalOverlayStyles.overlay} onClick={handleClick} />;
};

export default ModalOverlay;
