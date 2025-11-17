import { TextInput } from '@/components/FormControls';
import { ModalProps, FormModal } from '@/components/Modal';
import useFormData from '@/hooks/useFormData';
import Position from '@/types/models/Position'; // MUDANÇA
import { useEffect } from 'react';

interface PositionFormModalProps extends Omit<ModalProps, 'children'> {
  onSubmit: (data: Position) => Promise<void>; // MUDANÇA
  objectData?: Position; // MUDANÇA
}

export default function PositionFormModal({ // MUDANÇA
  onClose,
  onSubmit,
  isOpen,
  objectData,
}: PositionFormModalProps) {
  const { data, setData, updateField, reset } = useFormData<Position>({ // MUDANÇA
    id: 0,
    abbreviation: '', // Ajustar campos
    description: '', // Ajustar campos
  });

  useEffect(() => {
    if (!isOpen) return;
    if (objectData) {
      setData(objectData);
    } else {
      reset();
    }
  }, [isOpen, objectData, setData, reset]);

  const handleSubmit = async () => {
    await onSubmit(data);
    handleClose();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const title = objectData?.id
    ? 'Editar Posição' // MUDANÇA
    : 'Cadastrar Posição'; // MUDANÇA

  return (
    <FormModal
      isOpen={isOpen}
      onClose={handleClose}
      onSubmit={handleSubmit}
      title={title}
    >
      <div className='flex flex-col gap-4'>
        {/* Ajuste os campos conforme o modelo Position */}
        <TextInput<Position>
          name='description'
          label='Descrição'
          onChange={updateField}
          value={data.description}
          required
        />
        <TextInput<Position>
          name='abbreviation'
          label='Abreviação'
          onChange={updateField}
          value={data.abbreviation}
          required
        />
      </div>
    </FormModal>
  );
}