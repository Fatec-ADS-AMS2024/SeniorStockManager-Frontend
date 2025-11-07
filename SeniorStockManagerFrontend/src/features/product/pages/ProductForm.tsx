import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react';
import BreadcrumbPageTitle from '@/components/BreadcrumbPageTitle';
import Product from '@/types/models/Product';
import Button from '@/components/Button';
import { Checkbox, SelectInput, TextInput } from '@/components/FormControls';
import { YesNo } from '@/types/enums/YesNo';
import ProductType from '@/types/models/ProductType';
import {
  ProductTypeFormModal,
  ProductTypeService,
} from '@/features/productType';
import ProductGroup from '@/types/models/ProductGroup';
import {
  ProductGroupFormModal,
  ProductGroupService,
} from '@/features/productGroup';
import {
  UnitOfMeasureFormModal,
  UnitOfMeasureService,
} from '@/features/unitOfMeasure';
import UnitOfMeasure from '@/types/models/UnitOfMeasure';
import ProductService from '../services/productService';
import useAppRoutes from '@/hooks/useAppRoutes';
import useFormData from '@/hooks/useFormData';
import { AlertModal } from '@/components/Modal';

export default function ProductForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = id !== undefined && id !== '0';
  const routes = useAppRoutes();
  const [selectedProductGroup, setSelectedProductGroup] = useState<number>(0);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'info' | 'success' | 'error'>(
    'info'
  );
  const { data, reset, setData, updateField } = useFormData<Product>({
    id: 0,
    currentStock: 0,
    description: '',
    expirationControlled: YesNo.NO,
    genericName: '',
    highCost: YesNo.NO,
    minimumStock: 0,
    unitPrice: 0,
    averageCost: undefined,
    lastPurchasePrice: undefined,
    stockValue: undefined,
    productTypeId: 0,
    unitOfMeasureId: 0,
  });

  const [expirationChecked, setExpirationChecked] = useState(false);
  const [highCostChecked, setHighCostChecked] = useState(false);
  const [hasMinimumStock, setHasMinimumStock] = useState(false);

  const [modalType, setModalType] = useState<boolean>(false);
  const [modalGroup, setModalGroup] = useState<boolean>(false);
  const [modalUnit, setModalUnit] = useState<boolean>(false);

  const showAlert = (message: string, type: 'info' | 'success' | 'error') => {
    setAlertMessage(message);
    setAlertType(type);
    setIsAlertModalOpen(true);
  };

  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [productGroups, setProductGroups] = useState<ProductGroup[]>([]);
  const [unitOfMeasures, setUnitOfMeasures] = useState<UnitOfMeasure[]>([]);

  const getProductTypes = useCallback(async () => {
    const res = await ProductTypeService.getAll();
    if (res.success && res.data) {
      setProductTypes(res.data);
    } else {
      showAlert(res.message, 'error');
    }
  }, []);

  const fetchProduct = useCallback(
    async (productId: string) => {
      const res = await ProductService.getById(Number(productId));
      if (res.success && res.data) {
        const product = res.data!;

        setExpirationChecked(product.expirationControlled === YesNo.YES);
        setHighCostChecked(product.highCost === YesNo.YES);
        setHasMinimumStock((product.minimumStock ?? 0) > 0);

        const pt = productTypes.find((t) => t.id === product.productTypeId);
        if (pt) {
          setSelectedProductGroup(pt.productGroupId);
        }
        setData(product);
      } else {
        showAlert('Produto não encontrado!', 'error');
        navigate(routes.PRODUCT.path);
      }
    },
    [navigate, routes.PRODUCT.path, setData, productTypes]
  );

  const getProductGroups = useCallback(async () => {
    const res = await ProductGroupService.getAll();
    if (res.success && res.data) {
      setProductGroups(res.data);
    } else {
      showAlert(res.message, 'error');
    }
  }, []);

  const getUnitOfMeasure = useCallback(async () => {
    const res = await UnitOfMeasureService.getAll();
    if (res.success && res.data) {
      setUnitOfMeasures(res.data);
    } else {
      showAlert(res.message, 'error');
    }
  }, []);

  useEffect(() => {
    getProductTypes();
    getProductGroups();
    getUnitOfMeasure();
  }, [getProductTypes, getProductGroups, getUnitOfMeasure]);

  useEffect(() => {
    if (isEditing && productTypes.length > 0) {
      fetchProduct(id);
    } else if (!isEditing) {
      reset();
    }
  }, [fetchProduct, id, isEditing, reset, productTypes.length]);

  const openModalType = () => setModalType(true);
  const openModalGroup = () => setModalGroup(true);
  const openModalUnit = () => setModalUnit(true);
  const closeModalType = () => setModalType(false);
  const closeModalGroup = () => setModalGroup(false);
  const closeModalUnit = () => setModalUnit(false);

  const registerProductType = async (model: ProductType) => {
    const res = await ProductTypeService.create(model);

    if (res.success) {
      await getProductTypes();
      showAlert(
        `Tipo de produto "${res.data?.name}" criado com sucesso!`,
        'success'
      );
    } else {
      showAlert(
        res.message || 'Erro inesperado ao criar o tipo de produto.',
        'error'
      );
    }
  };

  const registerProductGroup = async (model: ProductGroup) => {
    const res = await ProductGroupService.create(model);

    if (res.success) {
      await getProductGroups();
      showAlert(
        `Grupo de produto "${res.data?.name}" criado com sucesso!`,
        'success'
      );
    } else {
      showAlert(
        res.message || 'Erro inesperado ao criar o Grupo de produto.',
        'error'
      );
    }
  };

  const registerUnitOfMeasure = async (model: UnitOfMeasure) => {
    const res = await UnitOfMeasureService.create(model);

    if (res.success) {
      await getUnitOfMeasure();
      showAlert(
        `Unidade de Medida "${res.data?.description}" criado com sucesso!`,
        'success'
      );
    } else {
      showAlert(
        res.message || 'Erro inesperado ao criar o Unidade de Medida.',
        'error'
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const productData: Product = data;

    const res = isEditing
      ? await ProductService.update(productData.id, productData)
      : await ProductService.create(productData);

    if (res.success) {
      showAlert(
        `Produto ${isEditing ? 'atualizado' : 'cadastrado'} com sucesso!`,
        'success'
      );
      navigate(routes.PRODUCT.path);
    } else {
      showAlert(res.message, 'error');
    }
  };

  return (
    <div>
      <BreadcrumbPageTitle title='Produto' />
      <div className='w-full h-full flex flex-col items-center py-10'>
        <form
          className='w-[95%] h-full bg-white shadow-md p-8 flex flex-col justify-center items-center rounded-lg'
          onSubmit={handleSubmit}
        >
          <h1 className='text-textPrimary font-bold text-2xl w-full mb-6'>
            Produto
          </h1>

          <div className='w-full'>
            <div className='flex flex-row gap-4'>
              <div className='flex-1'>
                <TextInput<Product>
                  label='Nome Genérico'
                  value={data.genericName}
                  onChange={updateField}
                  name='genericName'
                  required
                />
              </div>
              <div className='flex-1'>
                <TextInput<Product>
                  label='Descrição'
                  value={data.description}
                  onChange={updateField}
                  name='description'
                  required
                />
              </div>
            </div>
          </div>

          <div className='w-full mt-4'>
            <div className='flex flex-row gap-4'>
              <div className='flex-1'>
                <SelectInput<ProductGroup>
                  name='id'
                  label='Grupo'
                  onChange={(_, value) =>
                    setSelectedProductGroup(Number(value))
                    }
                  options={productGroups.map((group) => ({
                    label: group.name,
                    value: group.id,
                  }))}
                  required
                />
                <a
                  href='#'
                  onClick={(e) => {
                    e.preventDefault();
                    openModalGroup();
                  }}
                  className='mt-2 text-[12px] text-textSecondary underline hover:text-primary pl-2'
                >
                  Grupo não encontrado
                </a>
                <ProductGroupFormModal
                  isOpen={modalGroup}
                  onClose={closeModalGroup}
                  onSubmit={registerProductGroup}
                />
              </div>
              <div className='flex-1'>
                <SelectInput<Product>
                  name='productTypeId'
                  label='Tipo'
                  value={data.productTypeId}
                  onChange={updateField}
                  options={productTypes
                    .filter(
                      (type) => type.productGroupId === selectedProductGroup
                    )
                    .map((type) => ({
                      label: type.name,
                      value: type.id,
                    }))}
                  required
                />
                <a
                  href='#'
                  onClick={(e) => {
                    e.preventDefault();
                    openModalType();
                  }}
                  className='mt-2 text-[12px] text-textSecondary underline hover:text-primary pl-2'
                >
                  Tipo não encontrado
                </a>
                <ProductTypeFormModal
                  isOpen={modalType}
                  onClose={closeModalType}
                  onSubmit={registerProductType}
                />
              </div>
            </div>
          </div>

          <div className='w-full mt-4'>
            <div className='flex flex-row gap-4'>
              <div className='flex-1'>
                <SelectInput<Product>
                  name='unitOfMeasureId'
                  label='Unidade de medida'
                  value={data.unitOfMeasureId}
                  onChange={updateField}
                  options={unitOfMeasures.map((unit) => ({
                    label: unit.abbreviation,
                    value: unit.id,
                  }))}
                  required
                />
                <a
                  href='#'
                  onClick={(e) => {
                    e.preventDefault();
                    openModalUnit();
                  }}
                  className='mt-2 text-[12px] text-textSecondary underline hover:text-primary pl-2'
                >
                  Unidade de medida não encontrada
                </a>
                <UnitOfMeasureFormModal
                  isOpen={modalUnit}
                  onClose={closeModalUnit}
                  onSubmit={registerUnitOfMeasure}
                />
              </div>
              <div className='flex-1'>
                <div className='flex flex-col gap-y-4'>
                  <div className='flex items-center'>
                    <Checkbox<Product>
                      name='expirationControlled'
                      label='Possui controle de validade'
                      checked={expirationChecked}
                      onChange={(_, value) => {
                        const isControlled = value ? YesNo.YES : YesNo.NO;
                        setExpirationChecked(value);
                        setData({
                          ...data,
                          expirationControlled: isControlled,
                        });
                      }}
                    />
                  </div>
                  <div className='flex items-center'>
                    <Checkbox<Product>
                      name='highCost'
                      label='Alto Custo'
                      checked={highCostChecked}
                      onChange={(_, value) => {
                        const isHighCost = value ? YesNo.YES : YesNo.NO;
                        setHighCostChecked(value);
                        setData({
                          ...data,
                          highCost: isHighCost,
                        });
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className='w-full border border-neutralDarker mt-8 mb-8'></div>
          <div className='w-full flex'>
            <div className='flex flex-row gap-8 items-center'>
              <div className='flex flex-1 items-center'>
                <input
                  type='checkbox'
                  id='stockCheckbox'
                  name='stockCheckbox'
                  className='h-4 w-4 text-primary focus:ring-secondary border-neutralDarker rounded'
                  checked={hasMinimumStock}
                  onChange={(e) => setHasMinimumStock(e.target.checked)}
                />
                <label
                  htmlFor='stockCheckbox'
                  className='ml-2 text-sm font-medium text-textSecondary whitespace-nowrap'
                >
                  Possui estoque mínimo
                </label>
              </div>
              <div className='w-full'>
                <TextInput<Product>
                  label='Estoque Mínimo'
                  type='number'
                  value={data.minimumStock}
                  onChange={updateField}
                  name='minimumStock'
                  required
                  disabled={!hasMinimumStock}
                />
              </div>
              <div className='w-full'>
                <TextInput<Product>
                  label='Estoque Atual'
                  type='number'
                  value={data.currentStock}
                  onChange={updateField}
                  name='currentStock'
                  required
                />
              </div>
            </div>
          </div>

          <div className='w-full border border-neutralDarker mt-4 mb-8'></div>
          <div className='w-full flex'>
            <TextInput<Product>
              label='Preço por Unidade'
              type='number'
              value={data.unitPrice}
              onChange={updateField}
              name='unitPrice'
              required
            />
          </div>

          <div className='w-full border border-neutralDarker mt-4 mb-8'></div>
          <div className='flex justify-end w-full gap-4'>
            <Button
              label={isEditing ? 'Salvar Alterações' : 'Cadastrar Produto'}
              color='primary'
              size='medium'
              type='submit'
            />
          </div>
        </form>
      </div>
      <AlertModal
        isOpen={isAlertModalOpen}
        onClose={() => setIsAlertModalOpen(false)}
        message={alertMessage}
        type={alertType}
      />
    </div>
  );
}
