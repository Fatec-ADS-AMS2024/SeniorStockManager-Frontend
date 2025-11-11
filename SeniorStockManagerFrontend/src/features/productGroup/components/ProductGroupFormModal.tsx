import { TextInput } from '@/components/FormControls';
import { ModalProps, FormModal } from '@/components/Modal';
import useFormData from '@/hooks/useFormData';
import ProductGroup from '@/types/models/ProductGroup';
import { useEffect } from 'react';

interface ProductGroupFormModalProps extends Omit<ModalProps, 'children'> {
  onSubmit: (data: ProductGroup) => Promise<void>;
  objectData?: ProductGroup;
}

export default function ProductGroupFormModal({
  onClose,
  onSubmit,
  isOpen,
  objectData,
}: ProductGroupFormModalProps) {
  const { data, setData, updateField, reset } = useFormData<ProductGroup>({
    id: 0,
    name: '',
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
    ? 'Editar grupo de produto'
    : 'Cadastrar grupo de produto';

  return (
    <FormModal
      isOpen={isOpen}
      onClose={handleClose}
      onSubmit={handleSubmit}
      title={title}
    >
      <div className='flex flex-col gap-4'>
        <TextInput<ProductGroup>
          name='name'
          label='Nome'
          onChange={updateField}
          value={data.name}
          required
        />
      </div>
    </FormModal>
  );
}
