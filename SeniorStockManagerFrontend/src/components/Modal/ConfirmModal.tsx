import Button from '../Button';
import * as Modal from './BaseModal';
import { ModalProps } from './types';

interface ConfirmModalProps extends Omit<ModalProps, 'children'> {
  onConfirm: () => void;
  message: string;
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  message,
  title,
  ...props
}: ConfirmModalProps) {
  return (
    <Modal.ModalRoot isOpen={isOpen} onClose={onClose} {...props}>
      <Modal.ModalHeader
        title={title}
        onClose={onClose}
        showCloseButton={false}
      />
      <Modal.ModalContent>
        <p>{message}</p>
      </Modal.ModalContent>
      <Modal.ModalFooter>
        <Button
          label='Cancelar'
          onClick={onClose}
          color='textSecondary'
          className='font-semibold'
          size='medium'
        />
        <Button
          label='Confirmar'
          onClick={onConfirm}
          color='primary'
          className='font-semibold'
          size='medium'
        />
      </Modal.ModalFooter>
    </Modal.ModalRoot>
  );
}
