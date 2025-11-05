import { TextInput } from '@/components/FormControls';
import { ModalProps, FormModal } from '@/components/Modal';
import useFormData from '@/hooks/useFormData';
import Manufacturer from '@/types/models/Manufacturer';
import { useEffect } from 'react';

interface ManufacturerFormModalProps extends Omit<ModalProps, 'children'> {
  onSubmit: (data: Manufacturer) => Promise<void>;
  objectData?: Manufacturer;
}

export default function ManufacturerFormModal({
  onClose,
  onSubmit,
  isOpen,
  objectData,
}: ManufacturerFormModalProps) {
  const { data, setData, updateField, reset } = useFormData<Manufacturer>({
    id: 0,
    corporateName: '',
    cpfCnpj: '',
    tradeName: '',
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

  const title = objectData?.id ? 'Editar Fabricante' : 'Cadastrar Fabricante';

  return (
    <FormModal
      isOpen={isOpen}
      onClose={handleClose}
      onSubmit={handleSubmit}
      title={title}
    >
      <div className='flex flex-col gap-4'>
        <TextInput<Manufacturer>
          name='corporateName'
          label='Razão Social'
          onChange={updateField}
          value={data.corporateName}
          required
        />
        <TextInput<Manufacturer>
          name='tradeName'
          label='Nome Fantasia'
          onChange={updateField}
          value={data.tradeName}
          required
        />
        <TextInput<Manufacturer>
          name='cpfCnpj'
          label='CPF/CNPJ'
          onChange={updateField}
          value={data.cpfCnpj}
          required
        />
      </div>
    </FormModal>
  );
}
