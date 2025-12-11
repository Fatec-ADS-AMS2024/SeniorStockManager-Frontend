import * as Modal from './BaseModal';
import { ModalProps } from './types';
import { Info, CheckCircle, XCircle } from '@phosphor-icons/react';

interface AlertModalProps extends Omit<ModalProps, 'children'> {
  type?: 'info' | 'success' | 'error';
  message: string;
}

const icons = {
  info: {
    color: 'text-secondary',
    icon: <Info weight='fill' />,
  },
  success: {
    color: 'text-success',
    icon: <CheckCircle weight='fill' />,
  },
  error: {
    color: 'text-danger',
    icon: <XCircle weight='fill' />,
  },
};

export default function AlertModal({
  isOpen,
  onClose,
  message,
  type = 'info',
  ...props
}: AlertModalProps) {
  const styles = icons[type];

  return (
    <Modal.ModalRoot
      isOpen={isOpen}
      onClose={onClose}
      aria-modal='true'
      aria-label={` Janela de alerta ${type}`}
      aria-describedby='alert-message'
      {...props}
    >
      <Modal.ModalContent>
        <div className='flex flex-col items-center justify-center gap-2'>
          <span
            className={`text-8xl rounded-full shrink-0 ${styles.color}`}
            aria-hidden='true'
          >
            {styles.icon}
          </span>
          <p
            id='alert-message'
            className='text-textSecondary text-xl font-semibold text-center'
          >
            {message}
          </p>
        </div>
      </Modal.ModalContent>
    </Modal.ModalRoot>
  );
}
