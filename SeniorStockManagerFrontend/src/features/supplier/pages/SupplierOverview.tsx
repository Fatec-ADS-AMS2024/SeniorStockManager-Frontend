import { useEffect, useState } from 'react';
import SupplierService from '../services/supplierService';
import Supplier from '@/types/models/Supplier';
import Table from '@/components/Table';
import { TableColumn } from '@/components/Table/types';
import { Pencil, Plus, Trash } from '@phosphor-icons/react';
import BreadcrumbPageTitle from '@/components/BreadcrumbPageTitle';
import SearchBar from '@/components/SearchBar';
import Button from '@/components/Button';
import { AlertModal, ConfirmModal } from '@/components/Modal';
import useAppRoutes from '@/hooks/useAppRoutes';
import { useNavigate } from 'react-router-dom';

export default function SupplierOverview() {
  const columns: TableColumn<Supplier>[] = [
    { label: 'Nome', attribute: 'tradeName' },
    { label: 'CPF/CNPJ', attribute: 'cpfCnpj' },
    { label: 'Razão Social', attribute: 'corporateName' },
  ];
  const routes = useAppRoutes();
  const navigate = useNavigate();
  const [data, setData] = useState<Supplier[]>([]);
  const [originalData, setOriginalData] = useState<Supplier[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'info' | 'success' | 'error'>(
    'info'
  );
  const [currentId, setCurrentId] = useState<number | null>(null);

  const fetchData = async () => {
    const res = await SupplierService.getAll();
    if (res.success && res.data) {
      setData([...res.data]);
      setOriginalData([...res.data]); // Salva os dados originais
    } else {
      showAlert(`Erro ao buscar dados: ${res.message}`, 'error');
    }
  };

  // Pega os dados ja cadastrados para mostrar na tabela
  useEffect(() => {
    fetchData();
  }, []);

  const handleSearch = (searchTerm: string) => {
    if (!searchTerm) {
      setData(originalData); // Restaura os dados originais
      return;
    }

    const filteredData = originalData.filter((supplier) =>
      supplier.tradeName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setData(filteredData);
  };

  const openDeleteModal = (id: number) => {
    setCurrentId(id);
    setIsDeleteModalOpen(true);
  };

  const showAlert = (message: string, type: 'info' | 'success' | 'error') => {
    setAlertMessage(message);
    setAlertType(type);
    setIsAlertModalOpen(true);
  };

  const deleteSupplier = async () => {
    if (!currentId) return;

    const res = await SupplierService.deleteById(currentId);
    if (res.success) {
      setIsDeleteModalOpen(false);
      const itemName =
        data.find((item) => item.id === currentId)?.tradeName || '';
      setCurrentId(null);

      await fetchData();
      showAlert(`Fornecedor "${itemName}" excluído com sucesso!`, 'success');
    } else {
      showAlert(
        res.message || 'Erro inesperado ao excluir o Fornecedor.',
        'error'
      );
    }
  };

  // Essa função cria botões que tem acesso ao id da linha onde eles aparecem
  const Actions = ({ id }: { id: number }) => (
    <>
      <button
        onClick={() =>
          navigate(routes.SUPPLIER_EDIT.path.replace(':id', `${id}`))
        }
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
      <BreadcrumbPageTitle title='Cadastro de Fornecedor' />
      <div className='bg-neutralWhite px-6 py-6 max-w-[95%] mx-auto rounded-lg shadow-md mt-10'>
        <div className='flex items-center justify-between mb-4'>
          <SearchBar action={handleSearch} placeholder='Buscar Fornecedor...' />
          <Button
            label='Adicionar'
            icon={<Plus />}
            iconPosition='left'
            color='success'
            size='medium'
            onClick={() => navigate(routes.SUPPLIER_REGISTRATION.path)}
          />
          <ConfirmModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={deleteSupplier}
            title='Deseja realmente excluir esse Fornecedor?'
            message='Ao excluir este Fornecedor, ele será removido permanentemente do sistema.'
          />
          <AlertModal
            isOpen={isAlertModalOpen}
            onClose={() => setIsAlertModalOpen(false)}
            message={alertMessage}
            type={alertType}
          />
        </div>
        <Table
          columns={columns}
          data={data}
          actions={(id) => <Actions id={id} />}
        />
      </div>
    </div>
  );
}
