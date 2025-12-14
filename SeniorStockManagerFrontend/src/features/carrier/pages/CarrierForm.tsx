import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useCallback, useState } from 'react';
import BreadcrumbPageTitle from '@/components/BreadcrumbPageTitle';
import Button from '@/components/Button';
import Carrier from '@/types/models/Carrier';
import useAppRoutes from '@/hooks/useAppRoutes';
import CarrierService from '../services/carrierService';
import { SelectInput, TextInput } from '@/components/FormControls';
import useFormData from '@/hooks/useFormData';

const BRAZILIAN_STATES = [
  { label: 'Acre (AC)', value: 'AC' },
  { label: 'Alagoas (AL)', value: 'AL' },
  { label: 'Amapá (AP)', value: 'AP' },
  { label: 'Amazonas (AM)', value: 'AM' },
  { label: 'Bahia (BA)', value: 'BA' },
  { label: 'Ceará (CE)', value: 'CE' },
  { label: 'Distrito Federal (DF)', value: 'DF' },
  { label: 'Espírito Santo (ES)', value: 'ES' },
  { label: 'Goiás (GO)', value: 'GO' },
  { label: 'Maranhão (MA)', value: 'MA' },
  { label: 'Mato Grosso (MT)', value: 'MT' },
  { label: 'Mato Grosso do Sul (MS)', value: 'MS' },
  { label: 'Minas Gerais (MG)', value: 'MG' },
  { label: 'Pará (PA)', value: 'PA' },
  { label: 'Paraíba (PB)', value: 'PB' },
  { label: 'Paraná (PR)', value: 'PR' },
  { label: 'Pernambuco (PE)', value: 'PE' },
  { label: 'Piauí (PI)', value: 'PI' },
  { label: 'Rio de Janeiro (RJ)', value: 'RJ' },
  { label: 'Rio Grande do Norte (RN)', value: 'RN' },
  { label: 'Rio Grande do Sul (RS)', value: 'RS' },
  { label: 'Rondônia (RO)', value: 'RO' },
  { label: 'Roraima (RR)', value: 'RR' },
  { label: 'Santa Catarina (SC)', value: 'SC' },
  { label: 'São Paulo (SP)', value: 'SP' },
  { label: 'Sergipe (SE)', value: 'SE' },
  { label: 'Tocantins (TO)', value: 'TO' },
] as const;

const CARRIER_TYPE_OPTIONS = [
  { label: 'Transportadora Própria', value: 'OWN' },
  { label: 'Parceira', value: 'PARTNER' },
  { label: 'Terceirizada', value: 'THIRD_PARTY' },
];

const CARRIER_GROUP_OPTIONS = [
  { label: 'Rodoviário', value: 'ROAD' },
  { label: 'Aéreo', value: 'AIR' },
  { label: 'Marítimo', value: 'SEA' },
  { label: 'Ferroviário', value: 'RAIL' },
  { label: 'Multimodal', value: 'MULTIMODAL' },
];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type CarrierFormErrors = Partial<Record<keyof Carrier, string>>;

interface ValidateCarrierOptions {
  existingCarriers: Carrier[];
  editingId?: number;
}

const BRAZILIAN_STATE_VALUES = BRAZILIAN_STATES.map((state) => state.value) as string[];
const CARRIER_TYPE_VALUES = CARRIER_TYPE_OPTIONS.map((option) => option.value) as string[];
const CARRIER_GROUP_VALUES = CARRIER_GROUP_OPTIONS.map((option) => option.value) as string[];

const onlyDigits = (value: string | undefined) => (value ? value.replace(/\D/g, '') : '');

const isRepeatedSequence = (value: string) => {
  if (!value) return false;
  return value.split('').every((digit) => digit === value[0]);
};

const formatCpfCnpj = (value: string) => {
  const digits = onlyDigits(value).slice(0, 14);
  if (digits.length <= 11) {
    return digits
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  }
  return digits
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1/$2')
    .replace(/(\d{4})(\d{1,2})$/, '$1-$2');
};

const formatPostalCode = (value: string) => {
  const digits = onlyDigits(value).slice(0, 8);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
};

const formatPhone = (value: string) => {
  const digits = onlyDigits(value).slice(0, 11);
  if (!digits) return '';
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
};

const normalizeCarrier = (carrier: Partial<Carrier>): Carrier => ({
  id: carrier.id ?? 0,
  corporateName: (carrier.corporateName ?? '').trim(),
  tradeName: (carrier.tradeName ?? '').trim(),
  cpfCnpj: onlyDigits(carrier.cpfCnpj).slice(0, 14),
  carrierType: (carrier.carrierType ?? '').trim().toUpperCase(),
  carrierGroup: (carrier.carrierGroup ?? '').trim().toUpperCase(),
  street: (carrier.street ?? '').trim(),
  number: onlyDigits(carrier.number),
  district: (carrier.district ?? '').trim(),
  addressComplement: (carrier.addressComplement ?? '').trim(),
  city: (carrier.city ?? '').trim(),
  state: (carrier.state ?? '').trim().toUpperCase(),
  postalCode: onlyDigits(carrier.postalCode).slice(0, 8),
  phone: onlyDigits(carrier.phone).slice(0, 11),
  email: (carrier.email ?? '').trim().toLowerCase(),
});

/**
 * Aplica todas as regras de validação necessárias para o cadastro de transportadoras.
 * Garante obrigatoriedades, tamanhos, formatos e unicidade em memória antes de enviar ao backend.
 */
const validateCarrier = (
  carrier: Carrier,
  { existingCarriers, editingId }: ValidateCarrierOptions
): CarrierFormErrors => {
  const errors: CarrierFormErrors = {};
  const normalizedCorporateName = carrier.corporateName.trim();
  const normalizedTradeName = carrier.tradeName.trim();
  const normalizedStreet = carrier.street.trim();
  const normalizedDistrict = carrier.district.trim();
  const normalizedCity = carrier.city.trim();

  if (!normalizedCorporateName) {
    errors.corporateName = 'Razão Social é obrigatória.';
  } else if (
    normalizedCorporateName.length < 3 ||
    normalizedCorporateName.length > 150
  ) {
    errors.corporateName = 'Razão Social deve ter entre 3 e 150 caracteres.';
  } else if (
    existingCarriers.some(
      (existing) =>
        existing.id !== editingId &&
        existing.corporateName.trim().toLowerCase() ===
          normalizedCorporateName.toLowerCase()
    )
  ) {
    errors.corporateName =
      'Já existe uma transportadora com esta Razão Social.';
  }

  if (!normalizedTradeName) {
    errors.tradeName = 'Nome Fantasia é obrigatório.';
  } else if (
    normalizedTradeName.length < 3 ||
    normalizedTradeName.length > 150
  ) {
    errors.tradeName = 'Nome Fantasia deve ter entre 3 e 150 caracteres.';
  }

  const cpfCnpjDigits = carrier.cpfCnpj;
  if (!cpfCnpjDigits) {
    errors.cpfCnpj = 'CPF/CNPJ é obrigatório.';
  } else if (![11, 14].includes(cpfCnpjDigits.length)) {
    errors.cpfCnpj = 'Informe um CPF (11 dígitos) ou CNPJ (14 dígitos) válido.';
  } else if (isRepeatedSequence(cpfCnpjDigits)) {
    errors.cpfCnpj = 'CPF/CNPJ não pode conter todos os dígitos iguais.';
  } else if (
    existingCarriers.some(
      (existing) =>
        existing.id !== editingId && existing.cpfCnpj === cpfCnpjDigits
    )
  ) {
    errors.cpfCnpj = 'Já existe uma transportadora com este CPF/CNPJ.';
  }

  if (!normalizedStreet || normalizedStreet.length < 2) {
    errors.street = 'Logradouro deve ter ao menos 2 caracteres.';
  }

  if (!carrier.number) {
    errors.number = 'Número é obrigatório e deve conter apenas dígitos.';
  }

  if (!normalizedDistrict || normalizedDistrict.length < 2) {
    errors.district = 'Bairro deve ter ao menos 2 caracteres.';
  }

  if (!normalizedCity || normalizedCity.length < 2) {
    errors.city = 'Cidade deve ter ao menos 2 caracteres.';
  }

  if (!carrier.state) {
    errors.state = 'Estado é obrigatório.';
  } else if (!BRAZILIAN_STATE_VALUES.includes(carrier.state)) {
    errors.state = 'Selecione uma UF válida.';
  }

  if (!carrier.postalCode || carrier.postalCode.length !== 8) {
    errors.postalCode = 'CEP deve conter 8 dígitos numéricos.';
  }

  if (!carrier.phone || carrier.phone.length !== 11) {
    errors.phone = 'Telefone deve seguir o formato (99) 99999-9999.';
  }

  if (!carrier.email) {
    errors.email = 'E-mail é obrigatório.';
  } else if (!EMAIL_REGEX.test(carrier.email)) {
    errors.email = 'Informe um e-mail válido.';
  }

  if (!carrier.carrierType) {
    errors.carrierType = 'Tipo é obrigatório.';
  } else if (!CARRIER_TYPE_VALUES.includes(carrier.carrierType)) {
    errors.carrierType = 'Selecione um tipo válido.';
  }

  if (!carrier.carrierGroup) {
    errors.carrierGroup = 'Grupo é obrigatório.';
  } else if (!CARRIER_GROUP_VALUES.includes(carrier.carrierGroup)) {
    errors.carrierGroup = 'Selecione um grupo válido.';
  }

  return errors;
};

export default function CarrierForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const routes = useAppRoutes();
  const isEditing = id !== undefined && id !== '0';

  const [errors, setErrors] = useState<CarrierFormErrors>({});
  const [existingCarriers, setExistingCarriers] = useState<Carrier[]>([]);

  const { data, updateField, setData, reset } = useFormData<Carrier>({
    id: isEditing ? Number(id) : 0,
    addressComplement: '',
    city: '',
    corporateName: '',
    cpfCnpj: '',
    carrierType: '',
    carrierGroup: '',
    district: '',
    email: '',
    number: '',
    phone: '',
    postalCode: '',
    state: '',
    street: '',
    tradeName: '',
  });

  const fetchExistingCarriers = useCallback(async () => {
    const res = await CarrierService.getAll();
    if (res.success && res.data) {
      setExistingCarriers(res.data.map((carrier) => normalizeCarrier(carrier)));
    } else {
      console.error('Erro ao carregar transportadoras:', res.message);
      alert('Não foi possível carregar as transportadoras para validação.');
    }
  }, []);

  // Função para buscar dados de um Carrier para edição
  const fetchCarrier = useCallback(
    async (carrierId: string) => {
      const res = await CarrierService.getById(Number(carrierId));
      if (res.success && res.data) {
        setData(normalizeCarrier(res.data));
        setErrors({});
      } else {
        alert('Transportadora não encontrada!');
        navigate(routes.CARRIER.path);
      }
    },
    [navigate, routes.CARRIER.path, setData]
  );

  useEffect(() => {
    fetchExistingCarriers();
  }, [fetchExistingCarriers]);

  useEffect(() => {
    if (isEditing) {
      fetchCarrier(id);
    } else {
      reset();
      setErrors({});
    }
  }, [fetchCarrier, id, isEditing, reset]);

  const updateFieldAndClearError = (field: keyof Carrier, value: string) => {
    if (field === 'id') return;
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    updateField(field, value);
  };

  const handleDefaultChange = (
    field: keyof Carrier,
    value: string | number
  ) => {
    updateFieldAndClearError(field, String(value));
  };

  const handleDigitsChange = (
    field: keyof Carrier,
    value: string,
    maxLength?: number
  ) => {
    const digits = onlyDigits(value);
    const limitedDigits = maxLength ? digits.slice(0, maxLength) : digits;
    updateFieldAndClearError(field, limitedDigits);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const preparedCarrier = normalizeCarrier(data);
    preparedCarrier.id = data.id;

    const validationErrors = validateCarrier(preparedCarrier, {
      existingCarriers,
      editingId: isEditing ? preparedCarrier.id : undefined,
    });

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      alert('Revise os campos destacados antes de continuar.');
      return;
    }

    const res = isEditing
      ? await CarrierService.update(preparedCarrier.id, preparedCarrier)
      : await CarrierService.create(preparedCarrier);

    if (res.success) {
      alert(
        `Transportadora ${isEditing ? 'atualizada' : 'cadastrada'} com sucesso!`
      );
      navigate(routes.CARRIER.path);
    } else {
      if (res.errors && res.errors.length > 0) {
        const serverErrors: CarrierFormErrors = {};
        res.errors.forEach((error) => {
          if (error.field && error.message) {
            const fieldName = error.field as keyof Carrier;
            if (fieldName in preparedCarrier) {
              serverErrors[fieldName] = error.message;
            }
          }
        });
        setErrors((prev) => ({ ...prev, ...serverErrors }));
      }
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
              onChange={handleDefaultChange}
              name='corporateName'
              required
              minLength={3}
              maxLength={150}
              error={errors.corporateName}
            />
            <TextInput<Carrier>
              label='Nome Fantasia'
              value={data.tradeName}
              onChange={handleDefaultChange}
              name='tradeName'
              required
              minLength={3}
              maxLength={150}
              error={errors.tradeName}
            />
            <TextInput<Carrier>
              label='CPF / CNPJ'
              value={formatCpfCnpj(data.cpfCnpj)}
              onChange={(field, value) => handleDigitsChange(field, value, 14)}
              name='cpfCnpj'
              required
              inputMode='numeric'
              maxLength={18}
              error={errors.cpfCnpj}
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
                onChange={handleDefaultChange}
                name='street'
                required
                minLength={2}
                maxLength={150}
                error={errors.street}
              />
            </div>
            <TextInput<Carrier>
              label='Número'
              value={data.number}
              onChange={(field, value) => handleDigitsChange(field, value, 6)}
              name='number'
              required
              inputMode='numeric'
              maxLength={6}
              error={errors.number}
            />
          </div>
          <div className='w-full grid grid-cols-1 md:grid-cols-3 gap-4 mb-4'>
            <TextInput<Carrier>
              label='Complemento'
              value={data.addressComplement}
              onChange={handleDefaultChange}
              name='addressComplement'
              maxLength={80}
            />
            <TextInput<Carrier>
              label='Bairro'
              value={data.district}
              onChange={handleDefaultChange}
              name='district'
              required
              minLength={2}
              maxLength={120}
              error={errors.district}
            />
            <TextInput<Carrier>
              label='CEP'
              value={formatPostalCode(data.postalCode)}
              onChange={(field, value) => handleDigitsChange(field, value, 8)}
              name='postalCode'
              required
              inputMode='numeric'
              maxLength={9}
              error={errors.postalCode}
            />
          </div>
          <div className='w-full grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
            <TextInput<Carrier>
              label='Cidade'
              value={data.city}
              onChange={handleDefaultChange}
              name='city'
              required
              minLength={2}
              maxLength={120}
              error={errors.city}
            />
            <SelectInput<Carrier>
              label='Estado (UF)'
              value={data.state}
              onChange={handleDefaultChange}
              name='state'
              options={BRAZILIAN_STATES.map((stateOption) => ({
                label: stateOption.label,
                value: stateOption.value,
              }))}
              required
              error={errors.state}
              autoSelectFirst={false}
            />
          </div>

          <div className='w-full border-t my-4'></div>
          <h2 className='text-textPrimary font-bold text-xl w-full mb-4'>
            Contato e Classificação
          </h2>
          <div className='w-full grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
            <TextInput<Carrier>
              label='Telefone'
              value={formatPhone(data.phone)}
              onChange={(field, value) => handleDigitsChange(field, value, 11)}
              name='phone'
              required
              inputMode='tel'
              maxLength={15}
              error={errors.phone}
            />
            <TextInput<Carrier>
              label='E-mail'
              type='email'
              value={data.email}
              onChange={handleDefaultChange}
              name='email'
              required
              maxLength={150}
              error={errors.email}
            />
          </div>
          <div className='w-full grid grid-cols-1 md:grid-cols-2 gap-4'>
            <SelectInput<Carrier>
              label='Tipo'
              value={data.carrierType}
              onChange={handleDefaultChange}
              name='carrierType'
              options={CARRIER_TYPE_OPTIONS}
              required
              error={errors.carrierType}
              autoSelectFirst={false}
            />
            <SelectInput<Carrier>
              label='Grupo'
              value={data.carrierGroup}
              onChange={handleDefaultChange}
              name='carrierGroup'
              options={CARRIER_GROUP_OPTIONS}
              required
              error={errors.carrierGroup}
              autoSelectFirst={false}
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
