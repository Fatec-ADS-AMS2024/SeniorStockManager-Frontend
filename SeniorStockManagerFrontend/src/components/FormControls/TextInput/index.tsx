import { InputHTMLAttributes } from 'react';
import { FormField } from '../FormField';
import { BaseFieldProps } from '../types';

interface TextInputProps<T>
  extends BaseFieldProps,
    Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'name'> {
  type?: 'text' | 'email' | 'number';
  name: keyof T;
  onChange: (attribute: keyof T, value: string) => void;
  ariaLabel?: string;
}

/**
 * Um input comum que suporta texto, email e números
 */
export default function TextInput<T>({
  label,
  error,
  required,
  type = 'text',
  value,
  icon,
  name,
  onChange,
  ariaLabel,
  ...props
}: TextInputProps<T>) {
  return (
    <FormField
      label={label}
      error={error}
      required={required}
      ariaLabel={ariaLabel || label}
    >
      {icon && (
        <span className='absolute top-2.5 left-2 text-xl text-textSecondary shrink-0'>
          {icon}
        </span>
      )}
      <input
        type={type}
        value={value}
        name={String(name)}
        aria-label={ariaLabel || label || String(name)}
        aria-invalid={!!error}
        aria-required={required || undefined}
        onChange={(e) => onChange(e.target.name as keyof T, e.target.value)}
        className={`w-full py-2 text-sm text-textPrimary rounded border focus:outline-none focus:border-neutralDarker ${
          error ? 'border-danger' : 'border-neutralDark'
        } ${icon ? 'pr-2 pl-8' : 'px-2'}`}
        {...props}
      />
    </FormField>
  );
}
