import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react';
import BreadcrumbPageTitle from '@/components/BreadcrumbPageTitle';
import Supplier from '@/types/models/Supplier';
import Button from '@/components/Button';
import { TextInput } from '@/components/FormControls';
import SupplierService from '../services/supplierService';
import useAppRoutes from '@/hooks/useAppRoutes';
import useFormData from '@/hooks/useFormData';
import { AlertModal } from '@/components/Modal';

export default function SupplierForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = id !== undefined && id !== '0';
  const routes = useAppRoutes();
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'info' | 'success' | 'error'>(
    'info'
  );
  const { data, reset, setData, updateField } = useFormData<Supplier>({
    id: 0,
    corporateName: '',
    tradeName: '',
    cpfCnpj: '',
    email: '',
    phone: '',
    postalCode: '',
    street: '',
    number: '',
    addressComplement: '',
    district: '',
    city: '',
    state: '',
  });

  const fetchSupplier = useCallback(
    async (supplierId: string) => {
      const res = await SupplierService.getById(Number(supplierId));
      if (res.success && res.data) {
        setData(res.data);
      } else {
        showAlert('Fornecedor não encontrado!', 'error');
        navigate(routes.SUPPLIER.path);
      }
    },
    [navigate, routes.SUPPLIER.path, setData]
  );

  useEffect(() => {
    if (isEditing) {
      fetchSupplier(id);
    } else {
      reset();
    }
  }, [fetchSupplier, id, isEditing, reset]);

  const showAlert = (message: string, type: 'info' | 'success' | 'error') => {
    setAlertMessage(message);
    setAlertType(type);
    setIsAlertModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const supplierData: Supplier = data;

    const res = isEditing
      ? await SupplierService.update(supplierData.id, supplierData)
      : await SupplierService.create(supplierData);

    if (res.success) {
      showAlert(
        `Fornecedor ${isEditing ? 'atualizado' : 'cadastrado'} com sucesso!`,
        'success'
      );
      navigate(routes.SUPPLIER.path);
    } else {
      showAlert(res.message, 'error');
    }
  };

  return (
    <div>
      <BreadcrumbPageTitle title='Fornecedor' />
      <div className='w-full h-full flex flex-col items-center py-10'>
        <form
          className='w-[95%] h-full bg-white shadow-md p-8 flex flex-col justify-center items-center rounded-lg'
          onSubmit={handleSubmit}
        >
          <h1 className='text-textPrimary font-bold text-2xl w-full mb-6'>
            Fornecedor
          </h1>

          <div className='w-full'>
            <div className='flex flex-row gap-4'>
              <div className='flex-1'>
                <TextInput<Supplier>
                  label='Nome'
                  value={data.tradeName}
                  onChange={updateField}
                  name='tradeName'
                  required
                />
              </div>
              <div className='flex-1'>
                <TextInput<Supplier>
                  label='Razão Social'
                  value={data.corporateName}
                  onChange={updateField}
                  name='corporateName'
                  required
                />
              </div>
            </div>
          </div>

          <div className='w-full mt-4'>
            <div className='flex flex-row gap-4'>
              <div className='flex-1'>
                <TextInput<Supplier>
                  label='CPF/CNPJ'
                  value={data.cpfCnpj}
                  onChange={updateField}
                  name='cpfCnpj'
                  required
                />
              </div>
              <div className='flex-1'>
                <TextInput<Supplier>
                  label='Email'
                  type='email'
                  value={data.email}
                  onChange={updateField}
                  name='email'
                />
              </div>
            </div>
          </div>

          <div className='w-full mt-4'>
            <div className='flex flex-row gap-4'>
              <div className='flex-1'>
                <TextInput<Supplier>
                  label='Telefone'
                  value={data.phone}
                  onChange={updateField}
                  name='phone'
                  required
                />
              </div>
              <div className='flex-1'>
                <TextInput<Supplier>
                  label='CEP'
                  value={data.postalCode}
                  onChange={updateField}
                  name='postalCode'
                  required
                />
              </div>
            </div>
          </div>

          <div className='w-full border border-neutralDarker mt-8 mb-8'></div>
          <div className='w-full flex'>
            <div className='flex flex-row gap-4 w-full'>
              <div className='flex-1'>
                <TextInput<Supplier>
                  label='Rua/Avenida'
                  value={data.street}
                  onChange={updateField}
                  name='street'
                  required
                />
              </div>
              <div className='flex-1'>
                <TextInput<Supplier>
                  label='Número'
                  value={data.number}
                  onChange={updateField}
                  name='number'
                  required
                />
              </div>
              <div className='flex-1'>
                <TextInput<Supplier>
                  label='Complemento'
                  value={data.addressComplement}
                  onChange={updateField}
                  name='addressComplement'
                />
              </div>
            </div>
          </div>

          <div className='w-full mt-4'>
            <div className='flex flex-row gap-4'>
              <div className='flex-1'>
                <TextInput<Supplier>
                  label='Bairro'
                  value={data.district}
                  onChange={updateField}
                  name='district'
                  required
                />
              </div>
              <div className='flex-1'>
                <TextInput<Supplier>
                  label='Cidade'
                  value={data.city}
                  onChange={updateField}
                  name='city'
                  required
                />
              </div>
              <div className='flex-1'>
                <TextInput<Supplier>
                  label='Estado'
                  value={data.state}
                  onChange={updateField}
                  name='state'
                  required
                />
              </div>
            </div>
          </div>

          <div className='w-full border border-neutralDarker mt-4 mb-8'></div>
          <div className='flex justify-end w-full gap-4'>
            <Button
              label={isEditing ? 'Salvar Alterações' : 'Cadastrar Fornecedor'}
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
