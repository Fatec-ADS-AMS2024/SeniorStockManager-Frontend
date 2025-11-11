import { InputHTMLAttributes } from 'react';
import { FormField } from '../FormField';
import { BaseFieldProps } from '../types';

interface CheckboxProps<T>
  extends BaseFieldProps,
    Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'type' | 'name'> {
  checked: boolean;
  onChange: (attribute: keyof T, checked: boolean) => void;
  name: keyof T;
}

/**
 * Um checkbox para seleção única
 */
export default function Checkbox<T>({
  label,
  error,
  required,
  checked,
  name,
  onChange,
  ...props
}: CheckboxProps<T>) {
  return (
    <FormField error={error} required={required}>
      <label className='flex items-center cursor-pointer'>
        <input
          type='checkbox'
          checked={checked}
          name={String(name)}
          onChange={(e) => onChange(e.target.name as keyof T, e.target.checked)}
          className={`w-4 h-4 text-textPrimary rounded border focus:ring-2 focus:ring-neutralDarker ${
            error ? 'border-danger' : 'border-neutralDark'
          }`}
          {...props}
        />
        {label && (
          <span className='ml-2 text-sm text-textPrimary'>{label}</span>
        )}
      </label>
    </FormField>
  );
}
