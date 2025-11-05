import { useEffect, useState } from 'react';
import ProductGroupService from '../services/productGroupService';
import ProductGroup from '@/types/models/ProductGroup';
import Table from '@/components/Table';
import { Pencil, Plus, Trash } from '@phosphor-icons/react';
import BreadcrumbPageTitle from '@/components/BreadcrumbPageTitle';
import SearchBar from '@/components/SearchBar';
import Button from '@/components/Button';
import { AlertModal, ConfirmModal } from '@/components/Modal';
import ProductGroupFormModal from '../components/ProductGroupFormModal';

export default function ProductGroupOverview() {
  const columns = ['Nome Corporativo', 'Nome Comercial', 'CpfCnpj'];
  const [data, setData] = useState<ProductGroup[]>([]);
  const [originalData, setOriginalData] = useState<ProductGroup[]>([]);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'info' | 'success' | 'error'>(
    'info'
  );
  const [currentId, setCurrentId] = useState<number | null>(null);
  const [editingItem, setEditingItem] = useState<ProductGroup | undefined>();

  const fetchData = async () => {
    const res = await ProductGroupService.getAll();
    if (res.success && res.data) {
      setData([...res.data]);
      setOriginalData([...res.data]); // Salva os dados originais
    } else {
      alert(`Erro ao buscar dados: ${res.message}`);
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

    const filteredData = originalData.filter((productGroup) =>
      productGroup.name.toLowerCase().includes(searchTerm.toLowerCase())
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

  const handleSave = async (model: ProductGroup) => {
    if (currentId !== null) {
      await editProductGroup(currentId, model);
    } else {
      await registerProductGroup(model);
    }
  };

  const registerProductGroup = async (model: ProductGroup) => {
    // const errorMessage = validateProductGroup(model);

    // if (errorMessage) {
    //   showAlert(errorMessage, 'error');
    //   return;
    // }
    const res = await ProductGroupService.create(model);

    if (res.success) {
      await fetchData();
      showAlert(
        `Grupo de Produto "${res.data?.name}" criado com sucesso!`,
        'success'
      );
    } else {
      showAlert(
        res.message || 'Erro inesperado ao criar o Grupo de Produto.',
        'error'
      );
      throw new Error(res.message);
    }
  };

  const editProductGroup = async (id: number, model: ProductGroup) => {
    // const errorMessage = validateProductGroup(model);

    // if (errorMessage) {
    //   showAlert(errorMessage, 'error');
    //   return;
    // }
    const res = await ProductGroupService.update(id, model);

    if (res.success) {
      await fetchData();
      showAlert(
        `Grupo de Produto "${res.data?.name}" atualizado com sucesso!`,
        'success'
      );
    } else {
      showAlert(
        res.message || 'Erro inesperado ao atualizar o Grupo de Produto.',
        'error'
      );
      throw new Error(res.message);
    }
  };

  const deleteProductGroup = async () => {
    if (!currentId) return;

    const res = await ProductGroupService.deleteById(currentId);
    if (res.success) {
      setIsDeleteModalOpen(false);
      const itemName = data.find((item) => item.id === currentId)?.name || '';
      setCurrentId(null);

      await fetchData();
      showAlert(
        `Grupo de Produto "${itemName}" excluído com sucesso!`,
        'success'
      );
    } else {
      showAlert(
        res.message || 'Erro inesperado ao excluir o Grupo de Produto.',
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
      <BreadcrumbPageTitle title='Cadastro de Grupo de Produto' />
      <div className='bg-neutralWhite px-6 py-6 max-w-[95%] mx-auto rounded-lg shadow-md mt-10'>
        <div className='flex items-center justify-between mb-4'>
          <SearchBar
            action={handleSearch}
            placeholder='Buscar Grupo de Produto...'
          />
          <Button
            label='Adicionar'
            icon={<Plus />}
            iconPosition='left'
            color='success'
            size='medium'
            onClick={openCreateModal}
          />
          <ProductGroupFormModal
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
            onConfirm={deleteProductGroup}
            title='Deseja realmente excluir esse Grupo de Produto?'
            message='Ao excluir este Grupo de Produto, ele será removido permanentemente do sistema.'
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
