import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react';
import BreadcrumbPageTitle from '@/components/BreadcrumbPageTitle';
import InputText from '@/components/InputText';
import Button from '@/components/Button';
import Carrier from '@/types/models/Carrier';
import useAppRoutes from '@/hooks/useAppRoutes';
import CarrierService from '../services/carrierService';

export default function CarrierForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const routes = useAppRoutes();
  const isEditing = id !== undefined && id !== '0';

  // --- ESTADOS PARA OS CAMPOS DE CARRIER ---
  const [corporateName, setCorporateName] = useState<string>('');
  const [tradeName, setTradeName] = useState<string>('');
  const [cpfCnpj, setCpfcnpj] = useState<string>('');
  const [street, setStreet] = useState<string>('');
  const [number, setNumber] = useState<string>('');
  const [district, setDistrict] = useState<string>('');
  const [addressComplement, setAddressComplement] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [state, setState] = useState<string>('');
  const [postalCode, setPostalCode] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');

  // Função para buscar dados de um Carrier para edição
  const fetchCarrier = useCallback(
    async (carrierId: string) => {
      const carrierService = new CarrierService();
      const res = await carrierService.getById(Number(carrierId));
      if (res.code === 200 && res.data) {
        const c = res.data.data; // 'c' de carrier
        setCorporateName(c.corporateName);
        setTradeName(c.tradeName);
        setCpfcnpj(c.cpfCnpj);
        setStreet(c.street);
        setNumber(c.number);
        setDistrict(c.district);
        setAddressComplement(c.adressComplement);
        setCity(c.city);
        setState(c.state);
        setPostalCode(c.postalCode);
        setPhone(c.phone);
        setEmail(c.email);
      } else {
        alert('Transportadora não encontrada!');
        navigate(routes.CARRIER.path);
      }
    },
    [navigate, routes.CARRIER.path]
  );

  useEffect(() => {
    if (isEditing) {
      fetchCarrier(id);
    }
  }, [id, fetchCarrier, isEditing]);

  // Função para submeter o formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const carrierData: Carrier = {
      id: isEditing ? Number(id) : 0,
      corporateName,
      tradeName,
      cpfCnpj,
      street,
      number,
      district,
      addressComplement,
      city,
      state,
      postalCode,
      phone,
      email,
    };

    const carrierService = new CarrierService();
    const res = isEditing
      ? await carrierService.update(carrierData.id, carrierData)
      : await carrierService.create(carrierData);

    if (res.code === 200 || res.code === 201) {
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

          {/* --- DADOS BÁSICOS --- */}
          <div className='w-full grid grid-cols-1 md:grid-cols-3 gap-4 mb-4'>
            <InputText
              label='Razão Social'
              value={corporateName}
              action={setCorporateName}
              property={{ type: 'text', required: true }}
            />
            <InputText
              label='Nome Fantasia'
              value={tradeName}
              action={setTradeName}
              property={{ type: 'text' }}
            />
            <InputText
              label='CPF / CNPJ'
              value={cpfCnpj}
              action={setCpfcnpj}
              property={{ type: 'text', required: true }}
            />
          </div>

          {/* --- ENDEREÇO --- */}
          <div className='w-full border-t my-4'></div>
          <h2 className='text-textPrimary font-bold text-xl w-full mb-4'>
            Endereço
          </h2>
          <div className='w-full grid grid-cols-1 md:grid-cols-4 gap-4 mb-4'>
            <div className='md:col-span-3'>
              <InputText
                label='Logradouro (Rua, Av.)'
                value={street}
                action={setStreet}
                property={{ type: 'text' }}
              />
            </div>
            <InputText
              label='Número'
              value={number}
              action={setNumber}
              property={{ type: 'text' }}
            />
          </div>
          <div className='w-full grid grid-cols-1 md:grid-cols-3 gap-4 mb-4'>
            <InputText
              label='Complemento'
              value={addressComplement}
              action={setAddressComplement}
              property={{ type: 'text' }}
            />
            <InputText
              label='Bairro'
              value={district}
              action={setDistrict}
              property={{ type: 'text' }}
            />
            <InputText
              label='CEP'
              value={postalCode}
              action={setPostalCode}
              property={{ type: 'text' }}
            />
          </div>
          <div className='w-full grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
            <InputText
              label='Cidade'
              value={city}
              action={setCity}
              property={{ type: 'text' }}
            />
            <InputText
              label='Estado (UF)'
              value={state}
              action={setState}
              property={{ type: 'text' }}
            />
          </div>

          {/* --- CONTATO E GRUPOS --- */}
          <div className='w-full border-t my-4'></div>
          <h2 className='text-textPrimary font-bold text-xl w-full mb-4'>
            Contato e Classificação
          </h2>
          <div className='w-full grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
            <InputText
              label='Telefone'
              value={phone}
              action={setPhone}
              property={{ type: 'tel' }}
            />
            <InputText
              label='E-mail'
              value={email}
              action={setEmail}
              property={{ type: 'email' }}
            />
          </div>

          {/* --- BOTÃO DE SUBMISSÃO --- */}
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
