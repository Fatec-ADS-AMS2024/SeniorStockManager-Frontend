import { TextInput } from '@/components/FormControls';
import { ModalProps, FormModal } from '@/components/Modal';
import useFormData from '@/hooks/useFormData';
import UnitOfMeasure from '@/types/models/UnitOfMeasure';
import { useEffect } from 'react';

interface UnitOfMeasureFormModalProps extends Omit<ModalProps, 'children'> {
  onSubmit: (data: UnitOfMeasure) => Promise<void>;
  objectData?: UnitOfMeasure;
}

export default function UnitOfMeasureFormModal({
  onClose,
  onSubmit,
  isOpen,
  objectData,
}: UnitOfMeasureFormModalProps) {
  const { data, setData, updateField, reset } = useFormData<UnitOfMeasure>({
    id: 0,
    abbreviation: '',
    description: '',
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
    ? 'Editar unidade de medida'
    : 'Cadastrar unidade de medida';

  return (
    <FormModal
      isOpen={isOpen}
      onClose={handleClose}
      onSubmit={handleSubmit}
      title={title}
    >
      <div className='flex flex-col gap-4'>
        <TextInput<UnitOfMeasure>
          name='description'
          label='Descrição'
          onChange={updateField}
          value={data.description}
          required
        />
        <TextInput<UnitOfMeasure>
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
