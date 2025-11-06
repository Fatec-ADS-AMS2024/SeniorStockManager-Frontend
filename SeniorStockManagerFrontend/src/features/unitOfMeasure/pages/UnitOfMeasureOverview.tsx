import { useEffect, useState } from 'react';
import UnitOfMeasureService from '../services/unitOfMeasureService';
import UnitOfMeasure from '@/types/models/UnitOfMeasure';
import Table from '@/components/Table';
import { TableColumn } from '@/components/Table/types';
import { Pencil, Plus, Trash } from '@phosphor-icons/react';
import BreadcrumbPageTitle from '@/components/BreadcrumbPageTitle';
import SearchBar from '@/components/SearchBar';
import Button from '@/components/Button';
import { AlertModal, ConfirmModal } from '@/components/Modal';
import UnitOfMeasureFormModal from '../components/UnitOfMeasureFormModal';

export default function UnitOfMeasureOverview() {
  const columns: TableColumn<UnitOfMeasure>[] = [
    { label: 'Descrição', attribute: 'description' },
    { label: 'Abreviação', attribute: 'abbreviation' }
  ];
  const [data, setData] = useState<UnitOfMeasure[]>([]);
  const [originalData, setOriginalData] = useState<UnitOfMeasure[]>([]);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'info' | 'success' | 'error'>(
    'info'
  );
  const [currentId, setCurrentId] = useState<number | null>(null);
  const [editingItem, setEditingItem] = useState<UnitOfMeasure | undefined>();

  const fetchData = async () => {
    const res = await UnitOfMeasureService.getAll();
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

    const filteredData = originalData.filter((unitOfMeasure) =>
      unitOfMeasure.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setData(filteredData);
  };

  const openCreateModal = () => {
    setEditingItem(undefined);
    setCurrentId(null);
    setIsFormModalOpen(true);
  };

  const openEditModal = (id: number) => {
    const item = data.find((row) => row.id === id);
    if (item) {
      setEditingItem(item);
      setCurrentId(id);
      setIsFormModalOpen(true);
    } else {
      showAlert('Registro não encontrado', 'error');
    }
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

  const validateUnitOfMeasure = (unitOfMeasure: UnitOfMeasure) => {
    if (unitOfMeasure.abbreviation.trim() === '') {
      return 'Abreviação não pode ser nula ou vazia';
    }
    if (unitOfMeasure.description.trim() === '') {
      return 'Descrição não pode ser nula ou vazia';
    }
    if (unitOfMeasure.description.trim().length > 50) {
      return 'Campo descrição deve conter menos de 50 caracteres';
    }
    if (unitOfMeasure.abbreviation.trim().length > 50) {
      return 'Campo abreviação deve conter menos de 50 caracteres';
    }
  };

  const handleSave = async (model: UnitOfMeasure) => {
    if (currentId !== null) {
      await editUnitOfMeasure(currentId, model);
    } else {
      await registerUnitOfMeasure(model);
    }
  };

  const registerUnitOfMeasure = async (model: UnitOfMeasure) => {
    const errorMessage = validateUnitOfMeasure(model);

    if (errorMessage) {
      showAlert(errorMessage, 'error');
      return;
    }
    const res = await UnitOfMeasureService.create(model);

    if (res.success) {
      await fetchData();
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

  const editUnitOfMeasure = async (id: number, model: UnitOfMeasure) => {
    const errorMessage = validateUnitOfMeasure(model);

    if (errorMessage) {
      showAlert(errorMessage, 'error');
      return;
    }
    const res = await UnitOfMeasureService.update(id, model);

    if (res.success) {
      await fetchData();
      showAlert(
        `Unidade de Medida "${res.data?.description}" atualizado com sucesso!`,
        'success'
      );
    } else {
      showAlert(
        res.message || 'Erro inesperado ao atualizar o Unidade de Medida.',
        'error'
      );
    }
  };

  const deleteUnitOfMeasure = async () => {
    if (!currentId) return;

    const res = await UnitOfMeasureService.deleteById(currentId);
    if (res.success) {
      setIsDeleteModalOpen(false);
      const itemName =
        data.find((item) => item.id === currentId)?.description || '';
      setCurrentId(null);

      await fetchData();
      showAlert(
        `Unidade de Medida "${itemName}" excluído com sucesso!`,
        'success'
      );
    } else {
      showAlert(
        res.message || 'Erro inesperado ao excluir o Unidade de Medida.',
        'error'
      );
    }
  };

  // Essa função cria botões que tem acesso ao id da linha onde eles aparecem
  const Actions = ({ id }: { id: number }) => (
    <>
      <button
        onClick={() => openEditModal(id)}
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
      <BreadcrumbPageTitle title='Cadastro de Unidade de Medida' />
      <div className='bg-neutralWhite px-6 py-6 max-w-[95%] mx-auto rounded-lg shadow-md mt-10'>
        <div className='flex items-center justify-between mb-4'>
          <SearchBar
            action={handleSearch}
            placeholder='Buscar Unidade de Medida...'
          />
          <Button
            label='Adicionar'
            icon={<Plus />}
            iconPosition='left'
            color='success'
            size='medium'
            onClick={openCreateModal}
          />
          <UnitOfMeasureFormModal
            isOpen={isFormModalOpen}
            onClose={() => {
              setIsFormModalOpen(false);
              setEditingItem(undefined);
            }}
            onSubmit={handleSave}
            objectData={editingItem}
          />
          <ConfirmModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={deleteUnitOfMeasure}
            title='Deseja realmente excluir esse Unidade de Medida?'
            message='Ao excluir este Unidade de Medida, ele será removido permanentemente do sistema.'
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
