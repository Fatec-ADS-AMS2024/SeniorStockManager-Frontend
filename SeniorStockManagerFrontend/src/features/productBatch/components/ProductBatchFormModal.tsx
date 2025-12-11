import { TextInput, SelectInput, DateInput } from '@/components/FormControls';
import { ModalProps, FormModal } from '@/components/Modal';
import useFormData from '@/hooks/useFormData';
import ProductBatch from '@/types/models/ProductBatch';
import { useEffect, useState } from 'react';
import ProductService from '@/features/product/services/productService';
import Product from '@/types/models/Product';

interface ProductBatchFormModalProps extends Omit<ModalProps, 'children'> {
  onSubmit: (data: ProductBatch) => Promise<void>;
  objectData?: ProductBatch;
}

export default function ProductBatchFormModal({
  onClose,
  onSubmit,
  isOpen,
  objectData,
}: ProductBatchFormModalProps) {
  const { data, setData, updateField, reset } = useFormData<ProductBatch>({
    id: 0,
    batchNumber: '',
    manufacturingDate: '',
    expirationDate: '',
    quantity: 0,
    productId: 0,
  });

  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await ProductService.getAll();
      if (res.success && res.data) {
        setProducts(res.data);
      }
    };
    fetchProducts();
  }, []);

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
    ? 'Editar lote de produto'
    : 'Cadastrar lote de produto';

  const productOptions = products.map((product) => ({
    label: product.description,
    value: product.id,
  }));

  return (
    <FormModal
      isOpen={isOpen}
      onClose={handleClose}
      onSubmit={handleSubmit}
      title={title}
    >
      <div className='flex flex-col gap-4'>
        <TextInput<ProductBatch>
          name='batchNumber'
          label='Número do Lote'
          onChange={updateField}
          value={data.batchNumber}
          required
        />
        <SelectInput<ProductBatch>
          name='productId'
          label='Produto'
          onChange={updateField}
          value={data.productId}
          options={productOptions}
          required
        />
        <DateInput<ProductBatch>
          name='manufacturingDate'
          label='Data de Fabricação'
          type='date'
          onChange={updateField}
          value={data.manufacturingDate}
          required
        />
        <DateInput<ProductBatch>
          name='expirationDate'
          label='Data de Validade'
          type='date'
          onChange={updateField}
          value={data.expirationDate}
          required
        />
        <TextInput<ProductBatch>
          name='quantity'
          label='Quantidade'
          type='number'
          onChange={updateField}
          value={data.quantity.toString()}
          required
        />
      </div>
    </FormModal>
  );
}
