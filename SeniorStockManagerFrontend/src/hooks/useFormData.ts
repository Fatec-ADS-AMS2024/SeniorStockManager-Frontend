import { useCallback, useState } from 'react';

export default function useFormData<T>(initial: T) {
  const [data, setData] = useState(initial);
  const [originalData] = useState(initial);

  const updateField = (fieldName: keyof T, value: unknown) => {
    setData((prev) => ({ ...prev, [fieldName]: value }));
  };

  const reset = useCallback(() => {
    setData(originalData);
  }, [originalData]);

  return { data, updateField, setData, reset };
}
