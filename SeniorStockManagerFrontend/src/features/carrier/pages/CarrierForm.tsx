import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useCallback } from 'react';
import BreadcrumbPageTitle from '@/components/BreadcrumbPageTitle';
import Button from '@/components/Button';
import Carrier from '@/types/models/Carrier';
import useAppRoutes from '@/hooks/useAppRoutes';
import CarrierService from '../services/carrierService';
import { TextInput } from '@/components/FormControls';
import useFormData from '@/hooks/useFormData';

export default function CarrierForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const routes = useAppRoutes();
  const isEditing = id !== undefined && id !== '0';

  const { data, updateField, setData, reset } = useFormData<Carrier>({
    id: isEditing ? Number(id) : 0,
    addressComplement: '',
    city: '',
    corporateName: '',
    cpfCnpj: '',
    district: '',
    email: '',
    number: '',
    phone: '',
    postalCode: '',
    state: '',
    street: '',
    tradeName: '',
  });

  // Função para buscar dados de um Carrier para edição
  const fetchCarrier = useCallback(
    async (carrierId: string) => {
      const res = await CarrierService.getById(Number(carrierId));
      if (res.success && res.data) {
        setData(res.data);
      } else {
        alert('Transportadora não encontrada!');
        navigate(routes.CARRIER.path);
      }
    },
    [navigate, routes.CARRIER.path, setData]
  );

  useEffect(() => {
    if (isEditing) {
      fetchCarrier(id);
    } else {
      reset();
    }
  }, [fetchCarrier, id, isEditing, reset]);

  // Função para submeter o formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const carrierData = data;

    const res = isEditing
      ? await CarrierService.update(carrierData.id, carrierData)
      : await CarrierService.create(carrierData);

    if (res.success) {
      alert(
        `Transportadora ${isEditing ? 'atualizada' : 'cadastrada'} com sucesso!`
      );
      navigate(routes.CARRIER.path);
    } else {
      alert(res.message);
    }
  };

  return (
    <div>
      <BreadcrumbPageTitle
        title={isEditing ? 'Editar Transportadora' : 'Cadastrar Transportadora'}
      />
      <div className='w-full h-full flex flex-col items-center py-10'>
        <form
          className='w-[95%] h-full bg-white shadow-md p-8 flex flex-col justify-center items-center rounded-lg'
          onSubmit={handleSubmit}
        >
          <h1 className='text-textPrimary font-bold text-2xl w-full mb-6'>
            Dados da Transportadora
          </h1>

          <div className='w-full grid grid-cols-1 md:grid-cols-3 gap-4 mb-4'>
            <TextInput<Carrier>
              label='Razão Social'
              value={data.corporateName}
              onChange={updateField}
              name='corporateName'
              required
            />
            <TextInput<Carrier>
              label='Nome Fantasia'
              value={data.tradeName}
              onChange={updateField}
              name='tradeName'
              required
            />
            <TextInput<Carrier>
              label='CPF / CNPJ'
              value={data.cpfCnpj}
              onChange={updateField}
              name='cpfCnpj'
              required
            />
          </div>

          <div className='w-full border-t my-4'></div>
          <h2 className='text-textPrimary font-bold text-xl w-full mb-4'>
            Endereço
          </h2>
          <div className='w-full grid grid-cols-1 md:grid-cols-4 gap-4 mb-4'>
            <div className='md:col-span-3'>
              <TextInput<Carrier>
                label='Logradouro (Rua, Av.)'
                value={data.street}
                onChange={updateField}
                name='street'
                required
              />
            </div>
            <TextInput<Carrier>
              label='Número'
              value={data.number}
              onChange={updateField}
              name='number'
              required
            />
          </div>
          <div className='w-full grid grid-cols-1 md:grid-cols-3 gap-4 mb-4'>
            <TextInput<Carrier>
              label='Complemento'
              value={data.addressComplement}
              onChange={updateField}
              name='addressComplement'
              required
            />
            <TextInput<Carrier>
              label='Bairro'
              value={data.district}
              onChange={updateField}
              name='district'
              required
            />
            <TextInput<Carrier>
              label='CEP'
              value={data.postalCode}
              onChange={updateField}
              name='postalCode'
              required
            />
          </div>
          <div className='w-full grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
            <TextInput<Carrier>
              label='Cidade'
              value={data.city}
              onChange={updateField}
              name='city'
              required
            />
            <TextInput<Carrier>
              label='Estado (UF)'
              value={data.state}
              onChange={updateField}
              name='state'
              required
            />
          </div>

          <div className='w-full border-t my-4'></div>
          <h2 className='text-textPrimary font-bold text-xl w-full mb-4'>
            Contato e Classificação
          </h2>
          <div className='w-full grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
            <TextInput<Carrier>
              label='Telefone'
              value={data.phone}
              onChange={updateField}
              name='phone'
              required
            />
            <TextInput<Carrier>
              label='E-mail'
              type='email'
              value={data.email}
              onChange={updateField}
              name='email'
              required
            />
          </div>

          <div className='flex justify-end w-full gap-4 mt-8'>
            <Button
              label={
                isEditing ? 'Salvar Alterações' : 'Cadastrar Transportadora'
              }
              color='primary'
              size='medium'
              type='submit'
            />
          </div>
        </form>
      </div>
    </div>
  );
}
