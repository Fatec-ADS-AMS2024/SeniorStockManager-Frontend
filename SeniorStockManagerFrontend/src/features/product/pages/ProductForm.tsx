import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react';
import BreadcrumbPageTitle from '@/components/BreadcrumbPageTitle';
import InputText from '@/components/InputText';
import Product from '@/types/models/Product';
import Button from '@/components/Button';
import Modal from '@/components/GenericModal';
import { YesNo } from '@/types/enums/YesNo';
import ProductType from '@/types/models/ProductType';
import { ProductTypeService } from '@/features/productType';
import ProductGroup from '@/types/models/ProductGroup';
import { ProductGroupService } from '@/features/productGroup';
import { UnitOfMeasureService } from '@/features/unitOfMeasure';
import UnitOfMeasure from '@/types/models/UnitOfMeasure';
import ProductService from '../services/productService';
import useAppRoutes from '@/hooks/useAppRoutes';

export default function ProductForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const routes = useAppRoutes();

  const [genericName, setGenericName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [minimumStock, setMinimumStock] = useState<number>(0);
  const [currentStock, setCurrentStock] = useState<number>(0);
  const [unitPrice, setUnitPrice] = useState<number>(0);
  const [highCost, setHighCost] = useState<boolean>(false);
  const [expirationControlled, setExpirationControlled] =
    useState<boolean>(false);
  const [hasMinimumStock, setHasMinimumStock] = useState<boolean>(false);

  const [modalType, setModalType] = useState<boolean>(false);
  const [modalGroup, setModalGroup] = useState<boolean>(false);
  const [modalUnit, setModalUnit] = useState<boolean>(false);

  const isEditing = id !== undefined && id !== '0';

  const fetchProduct = useCallback(
    async (productId: string) => {
      const res = await ProductService.getById(Number(productId));
      if (res.success && res.data) {
        const p = res.data;
        setGenericName(p.genericName);
        setDescription(p.description);
        setMinimumStock(p.minimumStock);
        setCurrentStock(p.currentStock);
        setUnitPrice(p.unitPrice);
        setHighCost(p.highCost === YesNo.YES);
        setExpirationControlled(p.expirationControlled === YesNo.YES);
      } else {
        alert('Produto não encontrado!');
        navigate(routes.PRODUCT.path);
      }
    },
    [navigate, routes.PRODUCT.path]
  );

  useEffect(() => {
    getProductTypes();
    getProductGroups();
    getUnitOfMeasure();
    if (isEditing) {
      fetchProduct(id);
    }
  }, [id, fetchProduct, isEditing]);

  const openModalType = () => setModalType(true);
  const openModalGroup = () => setModalGroup(true);
  const openModalUnit = () => setModalUnit(true);
  const closeModalType = () => setModalType(false);
  const closeModalGroup = () => setModalGroup(false);
  const closeModalUnit = () => setModalUnit(false);

  const registerProductType = async (model: ProductType) => {
    const newProductType = { ...model, id: 0 };
    const res = await ProductTypeService.create(newProductType);

    if (res.success) {
      alert(`Tipo de produto ${res.data?.name} criado com sucesso!`);
      setModalType(false);
    } else {
      alert(res.message);
    }
  };

  const [productTypes, setProductTypes] = useState<ProductType[]>([]);

  const getProductTypes = async () => {
    const res = await ProductTypeService.getAll();
    if (res.success && res.data) {
      setProductTypes(res.data);
    } else {
      alert(res.message);
    }
  };

  const registerProductGroup = async (model: ProductGroup) => {
    const res = await ProductGroupService.create({
      ...model,
      id: Number(model.id),
    });
    if (res.success) {
      alert(`Grupo de produto ${res.data?.name} criado com sucesso!`);
      setModalGroup(false);
    } else {
      alert(res.message);
    }
  };

  const [productGroups, setProductGroups] = useState<ProductGroup[]>([]);

  const getProductGroups = async () => {
    const res = await ProductGroupService.getAll();
    if (res.success && res.data) {
      setProductGroups(res.data);
    } else {
      alert(res.message);
    }
  };

  const registerUnitOfMeasure = async (model: UnitOfMeasure) => {
    const res = await UnitOfMeasureService.create({
      ...model,
      id: Number(model.id),
    });
    if (res.success) {
      alert(`Unidade de medida ${res.data?.description} criada com sucesso!`);
      setModalUnit(false);
    } else {
      alert(res.message);
    }
  };

  const [unitOfMeasures, setUnitOfMeasures] = useState<UnitOfMeasure[]>([]);

  const getUnitOfMeasure = async () => {
    const res = await UnitOfMeasureService.getAll();
    if (res.success && res.data) {
      setUnitOfMeasures(res.data);
    } else {
      alert(res.message);
    }
  };

  const inputsType = [
    {
      label: 'Nome do Tipo',
      attribute: 'name',
      type: 'text',
      required: true,
    },
  ];

  const inputsGroup = [
    {
      label: 'Nome do Grupo',
      attribute: 'groupName',
      type: 'text',
      required: true,
    },
  ];

  const inputsUnit = [
    {
      label: 'Nome da Unidade',
      attribute: 'unitName',
      type: 'text',
      required: true,
    },
    {
      label: 'Abreviação',
      attribute: 'abbreviation',
      type: 'text',
      required: true,
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const productData: Product = {
      id: isEditing ? Number(id) : 0,
      description,
      genericName,
      minimumStock,
      currentStock,
      unitPrice,
      highCost: highCost ? YesNo.YES : YesNo.NO,
      expirationControlled: expirationControlled ? YesNo.YES : YesNo.NO,
    };

    let res;

    if (isEditing) {
      res = await ProductService.update(productData.id, productData);
    } else {
      res = await ProductService.create(productData);
    }

    if (res.success) {
      alert(`Produto ${isEditing ? 'atualizado' : 'cadastrado'} com sucesso!`);
      navigate(routes.PRODUCT.path);
    } else {
      alert(res.message);
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
                <InputText
                  label='Nome Genérico'
                  value={genericName}
                  action={setGenericName}
                  defaultDisable={false}
                  property={{ type: 'text' }}
                />
              </div>
              <div className='flex-1'>
                <InputText
                  label='Descrição'
                  value={description}
                  action={setDescription}
                  defaultDisable={false}
                  property={{ type: 'text' }}
                />
              </div>
            </div>
          </div>

          <div className='w-full mt-4'>
            <div className='flex flex-row gap-4'>
              <div className='flex-1'>
                <label
                  htmlFor='category'
                  className='block text-sm font-medium text-textPrimary'
                >
                  Tipo:
                </label>
                <select
                  id='category'
                  name='category'
                  className='p-2 mt-1 block w-full border border-neutral rounded-sm focus:border-neutralDarker sm:text-sm'
                >
                  {productTypes.map((productType) => (
                    <option key={productType.id} value={productType.id}>
                      {productType.name}
                    </option>
                  ))}
                </select>
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
                <Modal
                  title='Cadastrar Tipo'
                  inputs={inputsType}
                  action={registerProductType}
                  statusModal={modalType}
                  closeModal={closeModalType}
                  type='create'
                />
              </div>

              <div className='flex-1'>
                <label
                  htmlFor='group'
                  className='block text-sm font-medium text-textPrimary'
                >
                  Grupo:
                </label>
                <select
                  id='group'
                  name='group'
                  className='p-2 mt-1 block w-full border border-neutral rounded-sm focus:border-neutralDarker sm:text-sm'
                >
                  {productGroups.map((productGroup) => (
                    <option key={productGroup.id} value={productGroup.id}>
                      {productGroup.name}
                    </option>
                  ))}
                </select>
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
                <Modal
                  title='Cadastrar Grupo'
                  inputs={inputsGroup}
                  action={registerProductGroup}
                  statusModal={modalGroup}
                  closeModal={closeModalGroup}
                  type='create'
                />
              </div>
            </div>
          </div>

          <div className='w-full mt-4'>
            <div className='flex flex-row gap-4'>
              <div className='flex-1'>
                <label
                  htmlFor='unit'
                  className='block text-sm font-medium text-textPrimary'
                >
                  Unidade de medida:
                </label>
                <select
                  id='unit'
                  name='unit'
                  className='p-2 mt-1 block w-full border border-neutral rounded-sm focus:border-neutralDarker sm:text-sm'
                >
                  {unitOfMeasures.map((unitOfMeasure) => (
                    <option key={unitOfMeasure.id} value={unitOfMeasure.id}>
                      {unitOfMeasure.abbreviation}
                    </option>
                  ))}
                </select>
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
                <Modal
                  title='Cadastrar Unidade de Medida'
                  inputs={inputsUnit}
                  action={registerUnitOfMeasure}
                  statusModal={modalUnit}
                  closeModal={closeModalUnit}
                  type='create'
                />
              </div>
              <div className='flex-1'>
                <div className='flex flex-col gap-y-4'>
                  <div className='flex items-center'>
                    <input
                      type='checkbox'
                      id='validityCheckbox'
                      name='validityCheckbox'
                      className='h-4 w-4 text-primary focus:ring-secondary border-neutralDarker rounded'
                      checked={expirationControlled}
                      onChange={(e) =>
                        setExpirationControlled(e.target.checked)
                      }
                    />
                    <label
                      htmlFor='validityCheckbox'
                      className='ml-2 text-sm font-medium text-textSecondary whitespace-nowrap'
                    >
                      Possui controle de validade
                    </label>
                  </div>
                  <div className='flex items-center'>
                    <input
                      type='checkbox'
                      id='highCostCheckbox'
                      name='highCostCheckbox'
                      className='h-4 w-4 text-primary focus:ring-secondary border-neutralDarker rounded'
                      checked={highCost}
                      onChange={(e) => setHighCost(e.target.checked)}
                    />
                    <label
                      htmlFor='highCostCheckbox'
                      className='ml-2 text-sm font-medium text-textSecondary whitespace-nowrap'
                    >
                      Alto Custo
                    </label>
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
                <InputText
                  label='Estoque Mínimo'
                  value={String(minimumStock)}
                  action={(value) => setMinimumStock(Number(value))}
                  defaultDisable={!hasMinimumStock}
                  property={{ type: 'number' }}
                />
              </div>
              <div className='w-full'>
                <InputText
                  label='Estoque Atual'
                  value={String(currentStock)}
                  action={(value) => setCurrentStock(Number(value))}
                  defaultDisable={false}
                  property={{ type: 'number' }}
                />
              </div>
            </div>
          </div>

          <div className='w-full border border-neutralDarker mt-4 mb-8'></div>
          <div className='w-full flex'>
            <InputText
              label='Preço por Unidade'
              value={String(unitPrice)}
              action={(value) => setUnitPrice(Number(value))}
              defaultDisable={false}
              property={{ type: 'number' }}
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
      <Modal
        title='Cadastrar Unidade de Medida'
        inputs={inputsUnit}
        action={registerUnitOfMeasure}
        statusModal={modalUnit}
        closeModal={closeModalUnit}
        type='create'
      />
    </div>
  );
}
