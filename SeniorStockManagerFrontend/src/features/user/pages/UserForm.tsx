import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BreadcrumbPageTitle from '@/components/BreadcrumbPageTitle';
import Button from '@/components/Button';
import { Checkbox, SelectInput, TextInput } from '@/components/FormControls';
import { AlertModal } from '@/components/Modal';
import useAppRoutes from '@/hooks/useAppRoutes';
import useFormData from '@/hooks/useFormData';
import User from '@/types/models/User';
import UserService from '../services/userService';

const roleOptions = [
  { label: 'Administrador', value: 'ADMIN' },
  { label: 'Gestor', value: 'MANAGER' },
  { label: 'Operador', value: 'OPERATOR' },
  { label: 'Visualizador', value: 'VIEWER' },
];

type UserFormErrors = Partial<
  Record<'fullName' | 'email' | 'cpf' | 'phone' | 'role', string>
>;

export default function UserForm() {
  const navigate = useNavigate();
  const routes = useAppRoutes();
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id && id !== '0');
  const [errors, setErrors] = useState<UserFormErrors>({});
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'info' | 'success' | 'error'>(
    'info'
  );

  const { data, setData, updateField, reset } = useFormData<User>({
    id: 0,
    fullName: '',
    email: '',
    cpf: '',
    phone: '',
    role: roleOptions[0].value,
    isActive: true,
  });

  const showAlert = useCallback(
    (message: string, type: 'info' | 'success' | 'error') => {
      setAlertMessage(message);
      setAlertType(type);
      setIsAlertModalOpen(true);
    },
    []
  );

  /**
   * Executa as validações obrigatórias antes de submeter o formulário de usuário.
   * Retorna verdadeiro quando não há erros e atualiza o estado local com mensagens amigáveis.
   */
  const validateUserForm = useCallback(
    (form: User) => {
      const newErrors: UserFormErrors = {};
      const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/;
      const digitsOnly = (value: string) => value.replace(/\D/g, '');

      if (!form.fullName.trim()) {
        newErrors.fullName = 'Informe o nome completo.';
      }

      if (!form.email.trim() || !emailRegex.test(form.email)) {
        newErrors.email = 'Informe um e-mail válido.';
      }

      if (digitsOnly(form.cpf).length !== 11) {
        newErrors.cpf = 'CPF deve conter 11 dígitos.';
      }

      if (digitsOnly(form.phone).length < 10) {
        newErrors.phone = 'Telefone deve conter ao menos 10 dígitos.';
      }

      if (!form.role) {
        newErrors.role = 'Selecione um perfil.';
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    },
    []
  );

  const fetchUser = useCallback(
    async (userId: string) => {
      const res = await UserService.getById(Number(userId));
      if (res.success && res.data) {
        setData(res.data);
        setErrors({});
      } else {
        showAlert('Usuário não encontrado.', 'error');
        navigate(routes.USER.path);
      }
    },
    [navigate, routes.USER.path, setData, showAlert]
  );

  useEffect(() => {
    if (isEditing && id) {
      fetchUser(id);
    } else {
      reset();
      setErrors({});
    }
  }, [fetchUser, id, isEditing, reset]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateUserForm(data)) {
      showAlert('Revise os campos destacados e tente novamente.', 'error');
      return;
    }

    const res = isEditing
      ? await UserService.update(data.id, data)
      : await UserService.create(data);

    if (res.success) {
      showAlert(
        `Usuário ${isEditing ? 'atualizado' : 'cadastrado'} com sucesso!`,
        'success'
      );
      navigate(routes.USER.path);
    } else {
      showAlert(res.message || 'Erro ao salvar usuário.', 'error');
    }
  };

  return (
    <div>
      <BreadcrumbPageTitle title='Usuário' />
      <div className='w-full h-full flex flex-col items-center py-10'>
        <form
          className='w-[95%] h-full bg-white shadow-md p-8 flex flex-col justify-center items-center rounded-lg'
          onSubmit={handleSubmit}
        >
          <h1 className='text-textPrimary font-bold text-2xl w-full mb-6'>
            {isEditing ? 'Editar Usuário' : 'Cadastrar Usuário'}
          </h1>

          <div className='w-full'>
            <div className='flex flex-row gap-4'>
              <div className='flex-1'>
                <TextInput<User>
                  label='Nome Completo'
                  value={data.fullName}
                  onChange={updateField}
                  name='fullName'
                  required
                  error={errors.fullName}
                />
              </div>
              <div className='flex-1'>
                <TextInput<User>
                  label='Email'
                  type='email'
                  value={data.email}
                  onChange={updateField}
                  name='email'
                  required
                  error={errors.email}
                />
              </div>
            </div>
          </div>

          <div className='w-full mt-4'>
            <div className='flex flex-row gap-4'>
              <div className='flex-1'>
                <TextInput<User>
                  label='CPF'
                  value={data.cpf}
                  onChange={updateField}
                  name='cpf'
                  required
                  error={errors.cpf}
                />
              </div>
              <div className='flex-1'>
                <TextInput<User>
                  label='Telefone'
                  value={data.phone}
                  onChange={updateField}
                  name='phone'
                  required
                  error={errors.phone}
                />
              </div>
            </div>
          </div>

          <div className='w-full mt-4'>
            <div className='flex flex-row gap-4 items-end'>
              <div className='flex-1'>
                <SelectInput<User>
                  label='Perfil de Acesso'
                  value={data.role}
                  onChange={updateField}
                  name='role'
                  required
                  options={roleOptions}
                  error={errors.role}
                />
              </div>
              <div className='flex-1'>
                <Checkbox<User>
                  name='isActive'
                  label='Usuário ativo'
                  checked={data.isActive}
                  onChange={updateField}
                />
              </div>
            </div>
          </div>

          <div className='w-full border border-neutralDarker mt-6 mb-8'></div>
          <div className='flex justify-end w-full gap-4'>
            <Button
              label={isEditing ? 'Salvar Alterações' : 'Cadastrar Usuário'}
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
