import { FormField } from '../FormField';
import { BaseFieldProps } from '../types';
import Checkbox from '../Checkbox';

interface CheckboxOption<T> {
  value: unknown;
  label: string;
  disabled?: boolean;
  name: keyof T;
  ariaLabel?: string;
}

interface CheckboxGroupProps<T> extends BaseFieldProps {
  options: CheckboxOption<T>[];
  values: unknown[];
  onChange: (attribute: keyof T, values: unknown[]) => void;
  ariaLabel?: string;
}

/**
 * Um grupo de checkboxes para múltiplas seleções
 */
export default function CheckboxGroup<T>({
  label,
  error,
  required,
  options,
  values,
  onChange,
  ariaLabel,
}: CheckboxGroupProps<T>) {
  const handleChange = (
    attribute: keyof T,
    optionValue: unknown,
    checked: boolean
  ) => {
    if (checked) {
      onChange(attribute, [...values, optionValue]);
    } else {
      onChange(
        attribute,
        values.filter((value) => value !== optionValue)
      );
    }
  };

  return (
    <FormField
      label={label}
      error={error}
      required={required}
      aria-label={ariaLabel || String(label)}
    >
      <div
        className={`space-y-2 ${label && 'px-2'}`}
        role='group'
        aria-labelledby={ariaLabel || String(label)}
      >
        {options.map((option) => (
          <Checkbox
            key={`Option_${option.value}`}
            label={option.label}
            name={option.name}
            checked={values.includes(option.value)}
            onChange={(name, checked) =>
              handleChange(name, option.value, checked)
            }
            disabled={option.disabled}
            ariaLabel={option.ariaLabel || option.label}
          />
        ))}
      </div>
    </FormField>
  );
}
