import Button from '../Button';
import * as Modal from './BaseModal';
import { ModalProps } from './types';

interface ConfirmModalProps extends Omit<ModalProps, 'children'> {
  onConfirm: () => void;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  message,
  title = 'Confirmação',
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  ...props
}: ConfirmModalProps) {
  return (
    <Modal.ModalRoot isOpen={isOpen} onClose={onClose} {...props}>
      <Modal.ModalHeader title={title} onClose={onClose} showCloseButton={false} />

      <Modal.ModalContent>
        <p className='text-center text-textSecondary text-base'>{message}</p>
      </Modal.ModalContent>

      <Modal.ModalFooter>
        <Button
          label={cancelLabel}
          onClick={onClose}
          color='textSecondary'
          className='font-semibold'
          size='medium'
        />
        <Button
          label={confirmLabel}
          onClick={onConfirm}
          color='primary'
          className='font-semibold'
          size='medium'
        />
      </Modal.ModalFooter>
    </Modal.ModalRoot>
  );
}
