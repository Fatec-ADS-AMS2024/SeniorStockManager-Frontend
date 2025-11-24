import { ReactNode, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from '@phosphor-icons/react';
import { ModalProps } from './types';

interface ModalHeaderProps {
  title?: string;
  showCloseButton?: boolean;
  onClose: () => void;
}

interface ModalContentProps {
  children: ReactNode;
}

interface ModalFooterProps {
  children: ReactNode;
}

export const ModalRoot = ({
  isOpen,
  onClose,
  children,
  closeOnBackdropClick = true,
}: ModalProps & { ariaLabel?: string }) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleEsc);

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return createPortal(
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'
      role='dialog'
      aria-modal='true'
      aria-label={'Janela modal'}
      onClick={closeOnBackdropClick ? onClose : undefined}
    >
      <div
        className='relative bg-white transition-all rounded-[10px] shadow-lg w-full max-w-xl px-4 py-6 bg-neutralWhite'
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.body
  );
};

export const ModalHeader = ({
  title,
  showCloseButton = true,
  onClose,
}: ModalHeaderProps) => {
  return (
    <>
      <div
        className='flex items-center px-2 pb-1'
        role='heading'
        aria-level={2}
        aria-label={title}
      >
        {title && (
          <h3
            className='text-xl font-semibold text-textPrimary'
            id='modal-title'
          >
            {title}
          </h3>
        )}
        {showCloseButton && (
          <button
            type='button'
            aria-label='Fechar modal'
            className='ml-auto h-6 w-6 flex items-center justify-center bg-transparent text-textSecondary'
            onClick={onClose}
          >
            <X size={24} aria-hidden='true' />
          </button>
        )}
      </div>
      <hr className='border-t border-neutralDark w-full mx-auto' />
    </>
  );
};

export const ModalContent = ({
  children,
}: ModalContentProps) => {
  return (
    <div
      className='px-3 py-4 text-textSecondary'
      role='document'
      aria-label={'Conteúdo da modal'}
    >
      {children}
    </div>
  );
};

export const ModalFooter = ({
  children,
}: ModalFooterProps) => {
  return (
    <>
      <hr className='border-t border-neutralDark w-full mx-auto' />
      <div
        className='flex justify-end gap-7 px-2 pt-4'
        role='group'
        aria-label={'Rodapé da modal'}
      >
        {children}
      </div>
    </>
  );
};
