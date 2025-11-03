import { useEffect, useState } from 'react';
import ProductGroupService from '../services/productGroupService';
import ProductGroup from '@/types/models/ProductGroup';
import Table from '@/components/Table';
import {
  CheckCircle,
  Pencil,
  Plus,
  Trash,
  XCircle,
} from '@phosphor-icons/react';
import BreadcrumbPageTitle from '@/components/BreadcrumbPageTitle';
import SearchBar from '@/components/SearchBar';
import Button from '@/components/Button';
import Modal from '@/components/GenericModal';

const inputs: {
  label: string;
  attribute: keyof ProductGroup;
  defaultValue: string;
}[] = [
  {
    label: 'Nome',
    attribute: 'name',
    defaultValue: '',
  },
];

export default function ProductGroupOverview() {
  const columns = ['Nome'];
  const [data, setData] = useState<ProductGroup[]>([]);
  const [originalData, setOriginalData] = useState<ProductGroup[]>([]);
  const [modalRegister, setModalRegister] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);
  const [modalInfo, setModalInfo] = useState(false);
  const [infoMessage, setInfoMessage] = useState('');
  const [currentId, setCurrentId] = useState<number | null>(null);
  const [infoIcon, setInfoIcon] = useState<JSX.Element | undefined>(undefined);

  const fetchData = async () => {
    const res = await ProductGroupService.getAll();
    if (res.success && res.data) {
      setData([...res.data]);
      setOriginalData([...res.data]);
    } else {
      alert(`Erro ao buscar dados: ${res.message}`);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearch = (searchTerm: string) => {
    if (!searchTerm) {
      setData(originalData);
      return;
    }
    const filteredData = originalData.filter((productGroup) =>
      productGroup.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setData(filteredData);
  };

  const getRowValues = (id: number) => {
    return data.find((row) => row.id === id);
  };

  const openCloseModalRegister = () => {
    setCurrentId(null);
    inputs.forEach((input) => (input.defaultValue = ''));
    setModalRegister(true);
  };

  const openCloseModalEdit = (id?: number) => {
    if (!id) {
      setModalEdit(false);
      setCurrentId(null);
      return;
    }
    const rowValues = getRowValues(id);
    if (rowValues) {
      inputs.forEach((input) => {
        input.defaultValue = String(rowValues[input.attribute]);
      });
      setCurrentId(id);
      setModalEdit(true);
    } else {
      showInfoModal('Registro não encontrado', 'error');
    }
  };

  const openCloseModalDelete = (id?: number) => {
    if (!id) {
      setModalDelete(false);
      setCurrentId(null);
      return;
    }
    setCurrentId(id);
    setModalDelete(true);
  };

  const openCloseModalInfo = () => setModalInfo(false);

  const showInfoModal = (message: string, type: 'success' | 'error') => {
    setInfoMessage(message);
    setInfoIcon(
      type === 'success' ? (
        <CheckCircle size={90} className='text-success' weight='fill' />
      ) : (
        <XCircle size={90} className='text-danger' weight='fill' />
      )
    );
    setModalInfo(true);
  };

  const handleSave = (model: ProductGroup) => {
    if (currentId !== null) {
      const modelToUpdate = { ...model, id: currentId };
      editProductGroup(currentId, modelToUpdate);
    } else {
      registerProductGroup(model);
    }
  };

  const registerProductGroup = async (model: ProductGroup) => {
    if (
      !model.name ||
      model.name.trim().length < 3 ||
      model.name.trim().length > 100
    ) {
      showInfoModal('Nome deve ter entre 3 e 100 caracteres.', 'error');
      return;
    }
    if (!/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/.test(model.name)) {
      showInfoModal('Nome deve conter apenas letras e espaços.', 'error');
      return;
    }
    if (
      originalData.some(
        (pg) => pg.name.toLowerCase() === model.name.trim().toLowerCase()
      )
    ) {
      showInfoModal('Já existe um Grupo de Produto com esse nome.', 'error');
      return;
    }

    const res = await ProductGroupService.create(model);
    if (res.success) {
      setModalRegister(false);
      await fetchData();
      showInfoModal(
        `Grupo de Produto "${res.data?.name}" criado com sucesso!`,
        'success'
      );
    } else {
      showInfoModal(
        res.message || 'Erro inesperado ao criar o Grupo de Produto.',
        'error'
      );
    }
  };

  const editProductGroup = async (id: number, model: ProductGroup) => {
    if (
      !model.name ||
      model.name.trim().length < 3 ||
      model.name.trim().length > 100
    ) {
      showInfoModal('Nome deve ter entre 3 e 100 caracteres.', 'error');
      return;
    }
    if (!/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/.test(model.name)) {
      showInfoModal('Nome deve conter apenas letras e espaços.', 'error');
      return;
    }
    if (
      originalData.some(
        (pg) =>
          pg.id !== id &&
          pg.name.toLowerCase() === model.name.trim().toLowerCase()
      )
    ) {
      showInfoModal('Já existe um Grupo de Produto com esse nome.', 'error');
      return;
    }

    const res = await ProductGroupService.update(id, model);
    if (res.success) {
      setModalEdit(false);
      await fetchData();
      showInfoModal(
        `Grupo de Produto "${res.data?.name}" atualizado com sucesso!`,
        'success'
      );
    } else {
      showInfoModal(
        res.message || 'Erro inesperado ao atualizar o Grupo de Produto.',
        'error'
      );
    }
  };

  const deleteProductGroup = async (id: number) => {
    const res = await ProductGroupService.deleteById(id);
    if (res.success) {
      setModalDelete(false);
      setCurrentId(null);
      const itemName = data.find((item) => item.id === id)?.name || '';
      await fetchData();
      showInfoModal(
        `Grupo de Produto "${itemName}" excluído com sucesso!`,
        'success'
      );
    } else {
      showInfoModal(
        res.message || 'Erro inesperado ao excluir o Grupo de Produto.',
        'error'
      );
    }
    showInfoModal('Erro inesperado ao excluir o Grupo de Produto.', 'error');
  };

  const Actions = ({ id }: { id: number }) => (
    <>
      <button
        onClick={() => openCloseModalEdit(id)}
        className='text-edit hover:text-hoverEdit'
      >
        <Pencil className='size-6' weight='fill' />
      </button>
      <button
        onClick={() => openCloseModalDelete(id)}
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
        <Modal<ProductGroup>
          title='Cadastrar Grupo de Produto'
          inputs={inputs}
          action={handleSave}
          statusModal={modalRegister}
          closeModal={() => setModalRegister(false)}
          type='create'
        />
        <Modal<ProductGroup>
          type='update'
          title='Editar Grupo de Produto'
          inputs={inputs}
          action={handleSave}
          statusModal={modalEdit}
          closeModal={() => openCloseModalEdit()}
        />
        <Modal<ProductGroup>
          type='delete'
          title='Deseja realmente excluir esse Grupo de Produto?'
          msgInformation='Ao excluir este Grupo de Produto, ele será removido permanentemente do sistema.'
          action={() => {
            if (currentId !== null) deleteProductGroup(currentId);
          }}
          statusModal={modalDelete}
          closeModal={() => openCloseModalDelete()}
        />
        <Modal<ProductGroup>
          type='info'
          msgInformation={infoMessage}
          icon={infoIcon}
          statusModal={modalInfo}
          closeModal={openCloseModalInfo}
        />
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
            onClick={openCloseModalRegister}
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
