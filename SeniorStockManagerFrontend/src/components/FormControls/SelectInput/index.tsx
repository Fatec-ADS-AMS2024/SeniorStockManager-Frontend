import { BaseFieldProps } from '../types';
import { FormField } from '../FormField';
import { SelectHTMLAttributes, useEffect } from 'react';

interface SelectInputProps<T>
  extends BaseFieldProps,
    Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange' | 'name'> {
  options: { label: string; value: string | number }[];
  onChange: (attribute: keyof T, value: string | number) => void;
  name: keyof T;
  ariaLabel?: string;
}

export default function SelectInput<T>({
  label,
  error,
  required,
  value,
  options,
  onChange,
  icon,
  name,
  ariaLabel,
  ...props
}: SelectInputProps<T>) {
  useEffect(() => {
    if (options.length > 0 && !value) {
      onChange(name, options[0].value);
    }
  }, [name, onChange, options, value]);

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
      <select
        aria-label={ariaLabel || label || String(name)}
        aria-invalid={!!error}
        aria-required={required || undefined}
        value={value}
        name={String(name)}
        onChange={(e) => {
          const selectedValue = e.target.value;
          const option = options.find(
            (opt) => String(opt.value) === selectedValue
          );
          const convertedValue = option ? option.value : selectedValue;
          onChange(e.target.name as keyof T, Number(convertedValue));
        }}
        className={`w-full py-2 text-sm text-textPrimary rounded border focus:outline-none focus:border-neutralDarker ${
          error ? 'border-danger' : 'border-neutralDark'
        } ${icon ? 'pr-2 pl-7' : 'px-1'}`}
        {...props}
      >
        <option value='' disabled aria-label='Opção padrão'>
          Selecione um...
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value} aria-label={`Opção: ${option.label}`}>
            {option.label}
          </option>
        ))}
      </select>
    </FormField>
  );
}
