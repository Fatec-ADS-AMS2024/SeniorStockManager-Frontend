import { useState } from 'react';

export function useModalForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (
    submitFn: () => Promise<void> | void,
    onSuccess?: () => void
  ) => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      await submitFn();
      onSuccess?.();
    } catch (error) {
      console.error('Form submission error:', error);
      // Não chama onClose em caso de erro - mantém a modal aberta
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    handleSubmit,
  };
}
