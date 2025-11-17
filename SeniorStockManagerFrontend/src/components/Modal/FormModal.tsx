import * as Modal from './BaseModal';
import { FormEvent } from 'react';
import Button from '../Button';
import { Plus, X } from '@phosphor-icons/react';
// import { useModalForm } from '@/hooks/useModalForm'; // 1. REMOVA O HOOK DAQUI
import { ModalProps } from './types';

interface FormModalProps extends ModalProps {
  onSubmit: (data?: unknown) => void;
  isSubmitting?: boolean; // 2. ADICIONE A PROP AQUI
}

export default function FormModal({
  isOpen,
  onClose,
  onSubmit,
  title,
  children,
  closeOnBackdropClick = false,
  showCloseButton = true,
  isSubmitting = false, // 3. RECEBA A PROP AQUI
}: FormModalProps) {
  // const { isSubmitting, handleSubmit } = useModalForm(); // 4. REMOVA ESTA LINHA

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    // 5. CHAME O onSubmit DIRETAMENTE
    // A lógica de try/catch e isSubmitting agora será feita
    // pelo componente que tem o formulário (ProductTypeFormModal)
    onSubmit();
  };

  return (
    <Modal.ModalRoot
      isOpen={isOpen}
      onClose={onClose}
      closeOnBackdropClick={closeOnBackdropClick && !isSubmitting}
    >
      <form onSubmit={handleFormSubmit}>
        <Modal.ModalHeader
          onClose={onClose}
          showCloseButton={showCloseButton}
          title={title}
        />
        <Modal.ModalContent>{children}</Modal.ModalContent>
        <Modal.ModalFooter>
          <Button
            type='button'
            onClick={onClose}
            label='Cancelar'
            color='danger'
            icon={<X weight='bold' />}
            disabled={isSubmitting} // 6. USE A PROP AQUI
          />
          <Button
            type='submit'
            label={isSubmitting ? 'Salvando...' : 'Salvar'}
            color='success'
            icon={<Plus weight='bold' />}
            disabled={isSubmitting} // 7. USE A PROP AQUI
          />
        </Modal.ModalFooter>
      </form>
    </Modal.ModalRoot>
  );
}