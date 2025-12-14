import { BaseFieldProps } from '../types';
import { FormField } from '../FormField';
import { SelectHTMLAttributes, useEffect } from 'react';

interface SelectInputProps<T>
  extends BaseFieldProps,
    Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange' | 'name'> {
  options: { label: string; value: string | number }[];
  onChange: (attribute: keyof T, value: string | number) => void;
  name: keyof T;
  autoSelectFirst?: boolean;
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
  autoSelectFirst = true,
  ...props
}: SelectInputProps<T>) {
  useEffect(() => {
    if (!autoSelectFirst || options.length === 0) return;

    const hasValue =
      value !== undefined &&
      value !== '' &&
      !(typeof value === 'number' && value <= 0);

    if (!hasValue) {
      onChange(name, options[0].value);
    }
  }, [autoSelectFirst, name, onChange, options, value]);

  return (
    <FormField label={label} error={error} required={required}>
      {icon && (
        <span className='absolute top-2.5 left-2 text-xl text-textSecondary shrink-0'>
          {icon}
        </span>
      )}
      <select
        value={value ?? ''}
        name={String(name)}
        onChange={(e) => {
          const selectedValue = e.target.value;
          const option = options.find(
            (opt) => String(opt.value) === selectedValue
          );
          const convertedValue = option ? option.value : selectedValue;
          onChange(e.target.name as keyof T, convertedValue);
        }}
        className={`w-full py-2 text-sm text-textPrimary rounded border focus:outline-none focus:border-neutralDarker ${
          error ? 'border-danger' : 'border-neutralDark'
        } ${icon ? 'pr-2 pl-7' : 'px-1'}`}
        {...props}
      >
        {/* Placeholder */}
        <option value='' disabled>
          Selecione um...
        </option>
        {/* Lista de opções */}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FormField>
  );
}
