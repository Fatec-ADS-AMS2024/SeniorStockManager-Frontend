import { useCallback, useEffect, useState } from 'react';
import ProductBatchService from '../services/productBatchService';
import ProductBatch from '@/types/models/ProductBatch';
import Table from '@/components/Table';
import { TableColumn } from '@/components/Table/types';
import { Pencil, Plus, Trash } from '@phosphor-icons/react';
import BreadcrumbPageTitle from '@/components/BreadcrumbPageTitle';
import SearchBar from '@/components/SearchBar';
import Button from '@/components/Button';
import { AlertModal, ConfirmModal } from '@/components/Modal';
import ProductBatchFormModal from '../components/ProductBatchFormModal';

export default function ProductBatchOverview() {
  const columns: TableColumn<ProductBatch>[] = [
    { label: 'Número do Lote', attribute: 'batchNumber' },
    { label: 'Data de Fabricação', attribute: 'manufacturingDate' },
    { label: 'Data de Validade', attribute: 'expirationDate' },
    { label: 'Quantidade', attribute: 'quantity' },
  ];
  const [data, setData] = useState<ProductBatch[]>([]);
  const [originalData, setOriginalData] = useState<ProductBatch[]>([]);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'info' | 'success' | 'error'>(
    'info'
  );
  const [currentId, setCurrentId] = useState<number | null>(null);
  const [editingItem, setEditingItem] = useState<ProductBatch | undefined>();

  const fetchData = useCallback(async () => {
    const res = await ProductBatchService.getAll();
    if (res.success && res.data) {
      setData([...res.data]);
      setOriginalData([...res.data]); // Salva os dados originais
    } else {
      showAlert(`Erro ao buscar dados: ${res.message}`, 'error');
    }
  }, []);

  // Pega os dados ja cadastrados para mostrar na tabela
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSearch = (searchTerm: string) => {
    if (!searchTerm) {
      setData(originalData); // Restaura os dados originais
      return;
    }

    const filteredData = originalData.filter((productBatch) =>
      productBatch.batchNumber.toLowerCase().includes(searchTerm.toLowerCase())
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

  const handleSave = async (model: ProductBatch) => {
    if (currentId !== null) {
      await editProductBatch(currentId, model);
    } else {
      await registerProductBatch(model);
    }
  };

  const registerProductBatch = async (model: ProductBatch) => {
    // const errorMessage = validateProductBatch(model);

    // if (errorMessage) {
    //   showAlert(errorMessage, 'error');
    //   return;
    // }
    const res = await ProductBatchService.create(model);

    if (res.success) {
      await fetchData();
      showAlert(
        `Lote "${res.data?.batchNumber}" criado com sucesso!`,
        'success'
      );
    } else {
      showAlert(res.message || 'Erro inesperado ao criar o lote.', 'error');
    }
  };

  const editProductBatch = async (id: number, model: ProductBatch) => {
    // const errorMessage = validateProductBatch(model);

    // if (errorMessage) {
    //   showAlert(errorMessage, 'error');
    //   return;
    // }
    const res = await ProductBatchService.update(id, model);

    if (res.success) {
      await fetchData();
      showAlert(
        `Lote "${res.data?.batchNumber}" atualizado com sucesso!`,
        'success'
      );
    } else {
      showAlert(res.message || 'Erro inesperado ao atualizar o lote.', 'error');
    }
  };

  const deleteProductBatch = async () => {
    if (!currentId) return;

    const res = await ProductBatchService.deleteById(currentId);
    if (res.success) {
      setIsDeleteModalOpen(false);
      const itemName =
        data.find((item) => item.id === currentId)?.batchNumber || '';
      setCurrentId(null);

      await fetchData();
      showAlert(`Lote "${itemName}" excluído com sucesso!`, 'success');
    } else {
      showAlert(res.message || 'Erro inesperado ao excluir o lote.', 'error');
    }
  };

  const Actions = ({ id }: { id: number }) => (
    <>
      <button
        onClick={() => openEditModal(id)}
        className='text-edit hover:text-hoverEdit'
        aria-label={`Editar lote ID ${id}`}
      >
        <Pencil className='size-6' weight='fill' aria-hidden='true' />
      </button>
      <button
        onClick={() => openDeleteModal(id)}
        className='text-danger hover:text-hoverDanger'
        aria-label={`Excluir lote ID ${id}`}
      >
        <Trash className='size-6' weight='fill' aria-hidden='true' />
      </button>
    </>
  );

  return (
    <main role='main' aria-label='Página de gerenciamento de lotes de produtos'>
      <BreadcrumbPageTitle title='Cadastro de Lote de Produto' />
      <section
        className='bg-neutralWhite px-6 py-6 max-w-[95%] mx-auto rounded-lg shadow-md mt-10'
        aria-label='Seção de listagem de lotes'
      >
        <div
          className='flex items-center justify-between mb-4'
          role='toolbar'
          aria-label='Barra de ferramentas'
        >
          <SearchBar action={handleSearch} placeholder='Buscar Lote...' />
          <Button
            label='Adicionar'
            icon={<Plus aria-hidden='true' />}
            iconPosition='left'
            color='success'
            size='medium'
            onClick={openCreateModal}
          />
          <ProductBatchFormModal
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
            onConfirm={deleteProductBatch}
            title='Deseja realmente excluir este lote?'
            message='Ao excluir este lote, ele será removido permanentemente do sistema.'
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
      </section>
    </main>
  );
}
