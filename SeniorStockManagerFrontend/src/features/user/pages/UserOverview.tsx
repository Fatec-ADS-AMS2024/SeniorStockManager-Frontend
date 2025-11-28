import { useCallback, useEffect, useMemo, useState } from 'react';
import { Pencil, Plus, Trash } from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';
import BreadcrumbPageTitle from '@/components/BreadcrumbPageTitle';
import SearchBar from '@/components/SearchBar';
import Button from '@/components/Button';
import Table from '@/components/Table';
import { TableColumn } from '@/components/Table/types';
import { AlertModal, ConfirmModal } from '@/components/Modal';
import useAppRoutes from '@/hooks/useAppRoutes';
import User from '@/types/models/User';
import UserService from '../services/userService';

const roleLabels: Record<string, string> = {
  ADMIN: 'Administrador',
  MANAGER: 'Gestor',
  OPERATOR: 'Operador',
  VIEWER: 'Visualizador',
};

export default function UserOverview() {
  const columns: TableColumn<User>[] = useMemo(
    () => [
      { label: 'Nome', attribute: 'fullName' },
      { label: 'Email', attribute: 'email' },
      { label: 'CPF', attribute: 'cpf' },
      { label: 'Telefone', attribute: 'phone' },
      {
        label: 'Perfil',
        attribute: 'role',
        render: (value) => roleLabels[String(value)] ?? String(value),
      },
      {
        label: 'Status',
        attribute: 'isActive',
        render: (value) => (value ? 'Ativo' : 'Inativo'),
      },
    ],
    []
  );

  const routes = useAppRoutes();
  const navigate = useNavigate();
  const [data, setData] = useState<User[]>([]);
  const [originalData, setOriginalData] = useState<User[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'info' | 'success' | 'error'>(
    'info'
  );
  const [currentId, setCurrentId] = useState<number | null>(null);

  const showAlert = useCallback(
    (message: string, type: 'info' | 'success' | 'error') => {
      setAlertMessage(message);
      setAlertType(type);
      setIsAlertModalOpen(true);
    },
    []
  );

  const fetchData = useCallback(async () => {
    const res = await UserService.getAll();
    if (res.success && res.data) {
      setData([...res.data]);
      setOriginalData([...res.data]);
    } else {
      showAlert(`Erro ao buscar usuários: ${res.message}`, 'error');
    }
  }, [showAlert]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSearch = (searchTerm: string) => {
    if (!searchTerm) {
      setData(originalData);
      return;
    }

    const normalizedTerm = searchTerm.toLowerCase();
    const filteredData = originalData.filter((user) => {
      const searchableFields = [user.fullName, user.email, user.cpf].filter(
        (field): field is string => Boolean(field)
      );

      return searchableFields.some((field) =>
        field.toLowerCase().includes(normalizedTerm)
      );
    });
    setData(filteredData);
  };

  const openDeleteModal = (id: number) => {
    setCurrentId(id);
    setIsDeleteModalOpen(true);
  };

  const deleteUser = async () => {
    if (currentId === null) return;

    const res = await UserService.deleteById(currentId);
    if (res.success) {
      const userName = data.find((item) => item.id === currentId)?.fullName;
      setIsDeleteModalOpen(false);
      setCurrentId(null);
      await fetchData();
      showAlert(
        `Usuário "${userName ?? ''}" excluído com sucesso!`,
        'success'
      );
    } else {
      showAlert(res.message || 'Erro ao excluir usuário.', 'error');
    }
  };

  const Actions = ({ id }: { id: number }) => (
    <>
      <button
        onClick={() => navigate(routes.USER_EDIT.path.replace(':id', `${id}`))}
        className='text-edit hover:text-hoverEdit'
      >
        <Pencil className='size-6' weight='fill' />
      </button>
      <button
        onClick={() => openDeleteModal(id)}
        className='text-danger hover:text-hoverDanger'
      >
        <Trash className='size-6' weight='fill' />
      </button>
    </>
  );

  return (
    <div>
      <BreadcrumbPageTitle title='Cadastro de Usuário' />
      <div className='bg-neutralWhite px-6 py-6 max-w-[95%] mx-auto rounded-lg shadow-md mt-10'>
        <div className='flex items-center justify-between mb-4'>
          <SearchBar action={handleSearch} placeholder='Buscar usuário...' />
          <Button
            label='Adicionar'
            icon={<Plus />}
            iconPosition='left'
            color='success'
            size='medium'
            onClick={() => navigate(routes.USER_REGISTRATION.path)}
          />
          <ConfirmModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={deleteUser}
            title='Deseja realmente excluir este usuário?'
            message='Ao excluir este usuário, ele será removido permanentemente do sistema.'
          />
        </div>
        <AlertModal
          isOpen={isAlertModalOpen}
          onClose={() => setIsAlertModalOpen(false)}
          message={alertMessage}
          type={alertType}
        />
        <Table columns={columns} data={data} actions={(id) => <Actions id={id} />} />
      </div>
    </div>
  );
}
