import { SelectInput, TextInput } from '@/components/FormControls';
import { ModalProps, FormModal } from '@/components/Modal';
import { ProductGroupService } from '@/features/productGroup';
import useFormData from '@/hooks/useFormData';
import ProductGroup from '@/types/models/ProductGroup';
import ProductType from '@/types/models/ProductType';
import { useEffect, useState } from 'react';

interface ProductTypeFormModalProps extends Omit<ModalProps, 'children'> {
  onSubmit: (data: ProductType) => Promise<void>;
  objectData?: ProductType;
}

export default function ProductTypeFormModal({
  onClose,
  onSubmit,
  isOpen,
  objectData,
}: ProductTypeFormModalProps) {
  const [productGroups, setProductGroups] = useState<ProductGroup[]>([]);
  const { data, setData, updateField, reset } = useFormData<ProductType>({
    id: 0,
    name: '',
    productGroupId: 0,
  });

  const fetchProductGroups = async () => {
    const res = await ProductGroupService.getAll();
    if (res.success && res.data) {
      setProductGroups(res.data);
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    fetchProductGroups();
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
    ? 'Editar tipo de produto'
    : 'Cadastrar tipo de produto';

  return (
    <FormModal
      isOpen={isOpen}
      onClose={handleClose}
      onSubmit={handleSubmit}
      title={title}
    >
      <div className='flex flex-col gap-4'>
        <TextInput<ProductType>
          name='name'
          label='Nome'
          onChange={updateField}
          value={data.name}
          required
        />
        <SelectInput<ProductType>
          name='productGroupId'
          label='Grupo'
          onChange={updateField}
          value={data.productGroupId}
          options={productGroups.map((group) => ({
            label: group.name,
            value: group.id,
          }))}
          required
        />
      </div>
    </FormModal>
  );
}
