import { useEffect, useState } from 'react';
import ProductTypeService from '../services/productTypeService';
import ProductType from '@/types/models/ProductType';
import Table from '@/components/Table';
import { Pencil, Plus, Trash } from '@phosphor-icons/react';
import BreadcrumbPageTitle from '@/components/BreadcrumbPageTitle';
import SearchBar from '@/components/SearchBar';
import Button from '@/components/Button';
import { AlertModal, ConfirmModal } from '@/components/Modal';
import ProductTypeFormModal from '../components/ProductTypeFormModal';

export default function ProductTypeOverview() {
  const columns = ['Nome'];
  const [data, setData] = useState<ProductType[]>([]);
  const [originalData, setOriginalData] = useState<ProductType[]>([]);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'info' | 'success' | 'error'>(
    'info'
  );
  const [currentId, setCurrentId] = useState<number | null>(null);
  const [editingItem, setEditingItem] = useState<ProductType | undefined>();

  const fetchData = async () => {
    const res = await ProductTypeService.getAll();
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

    const filteredData = originalData.filter((productType) =>
      productType.name.toLowerCase().includes(searchTerm.toLowerCase())
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

  const handleSave = async (model: ProductType) => {
    if (currentId !== null) {
      await editProductType(currentId, model);
    } else {
      await registerProductType(model);
    }
  };

  const registerProductType = async (model: ProductType) => {
    // const errorMessage = validateProductType(model);

    // if (errorMessage) {
    //   showAlert(errorMessage, 'error');
    //   return;
    // }
    const res = await ProductTypeService.create(model);

    if (res.success) {
      await fetchData();
      showAlert(
        `Tipo de Produto "${res.data?.name}" criado com sucesso!`,
        'success'
      );
    } else {
      showAlert(
        res.message || 'Erro inesperado ao criar o Tipo de Produto.',
        'error'
      );
      throw new Error(res.message);
    }
  };

  const editProductType = async (id: number, model: ProductType) => {
    // const errorMessage = validateProductType(model);

    // if (errorMessage) {
    //   showAlert(errorMessage, 'error');
    //   return;
    // }
    const res = await ProductTypeService.update(id, model);

    if (res.success) {
      await fetchData();
      showAlert(
        `Tipo de Produto "${res.data?.name}" atualizado com sucesso!`,
        'success'
      );
    } else {
      showAlert(
        res.message || 'Erro inesperado ao atualizar o Tipo de Produto.',
        'error'
      );
      throw new Error(res.message);
    }
  };

  const deleteProductType = async () => {
    if (!currentId) return;

    const res = await ProductTypeService.deleteById(currentId);
    if (res.success) {
      setIsDeleteModalOpen(false);
      const itemName = data.find((item) => item.id === currentId)?.name || '';
      setCurrentId(null);

      await fetchData();
      showAlert(
        `Tipo de Produto "${itemName}" excluído com sucesso!`,
        'success'
      );
    } else {
      showAlert(
        res.message || 'Erro inesperado ao excluir o Tipo de Produto.',
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
      <BreadcrumbPageTitle title='Cadastro de Tipo de Produto' />
      <div className='bg-neutralWhite px-6 py-6 max-w-[95%] mx-auto rounded-lg shadow-md mt-10'>
        <div className='flex items-center justify-between mb-4'>
          <SearchBar
            action={handleSearch}
            placeholder='Buscar Tipo de Produto...'
          />
          <Button
            label='Adicionar'
            icon={<Plus />}
            iconPosition='left'
            color='success'
            size='medium'
            onClick={openCreateModal}
          />
          <ProductTypeFormModal
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
            onConfirm={deleteProductType}
            title='Deseja realmente excluir esse Tipo de Produto?'
            message='Ao excluir este Tipo de Produto, ele será removido permanentemente do sistema.'
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
