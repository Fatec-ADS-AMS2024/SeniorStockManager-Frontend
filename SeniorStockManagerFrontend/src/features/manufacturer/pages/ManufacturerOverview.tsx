import { useEffect, useState } from 'react';
import ManufacturerService from '../services/manufacturerService';
import Manufacturer from '@/types/models/Manufacturer';
import Table from '@/components/Table';
import { TableColumn } from '@/components/Table/types';
import { Pencil, Plus, Trash } from '@phosphor-icons/react';
import BreadcrumbPageTitle from '@/components/BreadcrumbPageTitle';
import SearchBar from '@/components/SearchBar';
import Button from '@/components/Button';
import { AlertModal, ConfirmModal } from '@/components/Modal';
import ManufacturerFormModal from '../components/ManufacturerFormModal';

export default function ManufacturerOverview() {
  const columns: TableColumn<Manufacturer>[] = [
    { label: 'Nome Corporativo', attribute: 'corporateName' },
    { label: 'Nome Comercial', attribute: 'tradeName' },
    { label: 'CPF/CNPJ', attribute: 'cpfCnpj' },
  ];
  const [data, setData] = useState<Manufacturer[]>([]);
  const [originalData, setOriginalData] = useState<Manufacturer[]>([]);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'info' | 'success' | 'error'>(
    'info'
  );
  const [currentId, setCurrentId] = useState<number | null>(null);
  const [editingItem, setEditingItem] = useState<Manufacturer | undefined>();

  const fetchData = async () => {
    const res = await ManufacturerService.getAll();
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

    const filteredData = originalData.filter((manufacturer) =>
      manufacturer.corporateName
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
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

  const handleSave = async (model: Manufacturer) => {
    if (currentId !== null) {
      await editManufacturer(currentId, model);
    } else {
      await registerManufacturer(model);
    }
  };

  const registerManufacturer = async (model: Manufacturer) => {
    // const errorMessage = validateManufacturer(model);

    // if (errorMessage) {
    //   showAlert(errorMessage, 'error');
    //   return;
    // }
    const res = await ManufacturerService.create(model);

    if (res.success) {
      await fetchData();
      showAlert(
        `Fabricante "${res.data?.corporateName}" criado com sucesso!`,
        'success'
      );
    } else {
      showAlert(
        res.message || 'Erro inesperado ao criar o Fabricante.',
        'error'
      );
    }
  };

  const editManufacturer = async (id: number, model: Manufacturer) => {
    // const errorMessage = validateManufacturer(model);

    // if (errorMessage) {
    //   showAlert(errorMessage, 'error');
    //   return;
    // }
    const res = await ManufacturerService.update(id, model);

    if (res.success) {
      await fetchData();
      showAlert(
        `Fabricante "${res.data?.corporateName}" atualizado com sucesso!`,
        'success'
      );
    } else {
      showAlert(
        res.message || 'Erro inesperado ao atualizar o Fabricante.',
        'error'
      );
    }
  };

  const deleteManufacturer = async () => {
    if (!currentId) return;

    const res = await ManufacturerService.deleteById(currentId);
    if (res.success) {
      setIsDeleteModalOpen(false);
      const itemName =
        data.find((item) => item.id === currentId)?.corporateName || '';
      setCurrentId(null);

      await fetchData();
      showAlert(`Fabricante "${itemName}" excluído com sucesso!`, 'success');
    } else {
      showAlert(
        res.message || 'Erro inesperado ao excluir o Fabricante.',
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
      <BreadcrumbPageTitle title='Cadastro de Fabricante' />
      <div className='bg-neutralWhite px-6 py-6 max-w-[95%] mx-auto rounded-lg shadow-md mt-10'>
        <div className='flex items-center justify-between mb-4'>
          <SearchBar action={handleSearch} placeholder='Buscar Fabricante...' />
          <Button
            label='Adicionar'
            icon={<Plus />}
            iconPosition='left'
            color='success'
            size='medium'
            onClick={openCreateModal}
          />
          <ManufacturerFormModal
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
            onConfirm={deleteManufacturer}
            title='Deseja realmente excluir esse Fabricante?'
            message='Ao excluir este Fabricante, ele será removido permanentemente do sistema.'
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
