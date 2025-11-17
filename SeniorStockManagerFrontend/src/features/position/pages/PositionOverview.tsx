import { useCallback, useEffect, useState } from 'react';
import PositionService from '../services/positionService'; // MUDANÇA
import Position from '@/types/models/Position'; // MUDANÇA
import Table from '@/components/Table';
import { TableColumn } from '@/components/Table/types';
import { Pencil, Plus, Trash } from '@phosphor-icons/react';
import BreadcrumbPageTitle from '@/components/BreadcrumbPageTitle';
import SearchBar from '@/components/SearchBar';
import Button from '@/components/Button';
import { AlertModal, ConfirmModal } from '@/components/Modal';
import PositionFormModal from '../components/PositionFormModal'; // MUDANÇA

export default function PositionOverview() {
  // 1. Ajuste as colunas para 'Position'
  const columns: TableColumn<Position>[] = [
    { label: 'Descrição', attribute: 'description' },
    { label: 'Abreviação', attribute: 'abbreviation' },
  ];

  // 2. Renomeie os estados e tipos
  const [data, setData] = useState<Position[]>([]);
  const [originalData, setOriginalData] = useState<Position[]>([]);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'info' | 'success' | 'error'>(
    'info'
  );
  const [currentId, setCurrentId] = useState<number | null>(null);
  const [editingItem, setEditingItem] = useState<Position | undefined>();

  // 3. Ajuste a função de busca de dados
  const fetchData = useCallback(async () => {
    const res = await PositionService.getAll();
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

    const filteredData = originalData.filter((item) =>
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setData(filteredData);
  };

  // ===================================================================
  // FUNÇÕES QUE ESTAVAM FALTANDO (copiadas de UnitOfMeasureOverview)
  // ===================================================================
  
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

  // ===================================================================
  // FIM DAS FUNÇÕES QUE ESTAVAM FALTANDO
  // ===================================================================

  // 5. Implemente as validações para 'Position'
  const validatePosition = (item: Position) => {
    if (item.abbreviation.trim() === '') {
      return 'Abreviação não pode ser nula ou vazia';
    }
    if (item.description.trim() === '') {
      return 'Descrição não pode ser nula ou vazia';
    }
    // Adicione outras validações (ex: tamanho)
    if (item.description.trim().length > 50) {
      return 'Campo descrição deve conter menos de 50 caracteres';
    }
    if (item.abbreviation.trim().length > 50) {
      return 'Campo abreviação deve conter menos de 50 caracteres';
    }
  };

  // 6. Ajuste as funções de salvar (criar/editar)
  const handleSave = async (model: Position) => {
    if (currentId !== null) {
      await editPosition(currentId, model);
    } else {
      await registerPosition(model);
    }
  };

  const registerPosition = async (model: Position) => {
    const errorMessage = validatePosition(model);

    if (errorMessage) {
      showAlert(errorMessage, 'error');
      return;
    }
    const res = await PositionService.create(model);

    if (res.success) {
      await fetchData();
      showAlert(
        `Posição "${res.data?.description}" criada com sucesso!`,
        'success'
      );
    } else {
      showAlert(
        res.message || 'Erro inesperado ao criar a posição.',
        'error'
      );
    }
  };

  const editPosition = async (id: number, model: Position) => {
    const errorMessage = validatePosition(model);

    if (errorMessage) {
      showAlert(errorMessage, 'error');
      return;
    }
    const res = await PositionService.update(id, model);

    if (res.success) {
      await fetchData();
      showAlert(
        `Posição "${res.data?.description}" atualizada com sucesso!`,
        'success'
      );
    } else {
      showAlert(
        res.message || 'Erro inesperado ao atualizar a posição.',
        'error'
      );
    }
  };

  // 7. Ajuste a função de deletar
  const deletePosition = async () => {
    if (!currentId) return;

    const res = await PositionService.deleteById(currentId);
    if (res.success) {
      setIsDeleteModalOpen(false);
      const itemName =
        data.find((item) => item.id === currentId)?.description || '';
      setCurrentId(null);

      await fetchData();
      showAlert(
        `Posição "${itemName}" excluída com sucesso!`,
        'success'
      );
    } else {
      showAlert(
        res.message || 'Erro inesperado ao excluir a posição.',
        'error'
      );
    }
  };

  // Essa função cria botões que tem acesso ao id da linha onde eles aparecem
  // ESTAVA FALTANDO
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

  // 8. Ajuste o JSX (títulos, placeholders, etc.)
  // REMOVIDOS OS COMENTÁRIOS INVÁLIDOS
  return (
    <div>
      <BreadcrumbPageTitle title='Cadastro de Posição' />
      <div className='bg-neutralWhite px-6 py-6 max-w-[95%] mx-auto rounded-lg shadow-md mt-10'>
        <div className='flex items-center justify-between mb-4'>
          <SearchBar
            action={handleSearch}
            placeholder='Buscar Posição...'
          />
          <Button
            label='Adicionar'
            icon={<Plus />}
            iconPosition='left'
            color='success'
            size='medium'
            onClick={openCreateModal}
          />
          <PositionFormModal
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
            onConfirm={deletePosition}
            title='Deseja realmente excluir esta posição?'
            message='Ao excluir esta posição, ela será removida permanentemente do sistema.'
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