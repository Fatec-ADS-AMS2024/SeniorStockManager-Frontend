import { XCircle } from '@phosphor-icons/react';

interface FormFieldProps {
  label?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}

/**
 * Este componente é utilizado para fornecer elementos básicos aos campos de um
 * formulário, como label e espaço para mensagem de erro.
 */
export function FormField({
  label,
  error,
  required,
  children,
}: FormFieldProps) {
  return (
    <div>
      {label && (
        <label className='block text-textPrimary text-sm mb-1 break-all'>
          {label}
          {required && '*'}
        </label>
      )}
      <div className='relative'>{children}</div>
      {error && (
        <span className='text-danger text-xs flex gap-1 items-center'>
          <XCircle />
          {error}
        </span>
      )}
    </div>
  );
}
